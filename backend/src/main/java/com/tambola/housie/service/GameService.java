package com.tambola.housie.service;

import com.tambola.housie.dto.CallNumberResponse;
import com.tambola.housie.dto.StartGameResponse;
import com.tambola.housie.dto.websocket.GameCompletedEvent;
import com.tambola.housie.dto.websocket.GameStartedEvent;
import com.tambola.housie.dto.websocket.NumberCalledEvent;
import com.tambola.housie.entity.*;
import com.tambola.housie.entity.enums.GameStatus;
import com.tambola.housie.entity.enums.RoomStatus;
import com.tambola.housie.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Random;
import java.util.Set;

@Service
public class GameService {

    private static final Logger logger = LoggerFactory.getLogger(GameService.class);

    private final RoomRepository roomRepository;
    private final PlayerRepository playerRepository;
    private final GameRepository gameRepository;
    private final CalledNumberRepository calledNumberRepository;
    private final WebSocketEventBroadcaster eventBroadcaster;
    private final Random random;

    public GameService(RoomRepository roomRepository,
                      PlayerRepository playerRepository,
                      GameRepository gameRepository,
                      CalledNumberRepository calledNumberRepository,
                      WebSocketEventBroadcaster eventBroadcaster) {
        this.roomRepository = roomRepository;
        this.playerRepository = playerRepository;
        this.gameRepository = gameRepository;
        this.calledNumberRepository = calledNumberRepository;
        this.eventBroadcaster = eventBroadcaster;
        this.random = new Random();
    }

    @Transactional
    public StartGameResponse startGame(String roomCode, Long playerId) {
        // Find the room with players eagerly fetched
        Room room = roomRepository.findByRoomCodeWithPlayers(roomCode)
                .orElseThrow(() -> new IllegalArgumentException("Room not found with code: " + roomCode));

        // Find the player
        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new IllegalArgumentException("Player not found with id: " + playerId));

        // Verify player belongs to the room
        if (!player.getRoom().getId().equals(room.getId())) {
            throw new IllegalStateException("Player does not belong to this room");
        }

        // Verify player is the creator
        if (!player.getIsCreator()) {
            throw new IllegalStateException("Only the room creator can start the game");
        }

        // Verify room is in WAITING state
        if (room.getStatus() != RoomStatus.WAITING) {
            throw new IllegalStateException("Game can only be started when room is in WAITING state");
        }

        // Verify room has at least 2 players (minimum requirement regardless of max room size)
        if (room.getPlayers().size() < 2) {
            throw new IllegalStateException("Minimum 2 players are required to start the game");
        }

        // Verify all players have selected tickets
        long playersWithTickets = room.getPlayers().stream()
                .filter(p -> p.getTicket() != null)
                .count();
        
        if (playersWithTickets != room.getPlayers().size()) {
            throw new IllegalStateException("All players must select a ticket before starting the game");
        }

        // Create or get the game
        Game game = room.getGame();
        if (game == null) {
            game = new Game();
            game.setRoom(room);
        }

        // Set game properties
        game.setStatus(GameStatus.IN_PROGRESS);
        game.setStartedAt(LocalDateTime.now());

        // Update room status
        room.setStatus(RoomStatus.IN_PROGRESS);

        // Save changes
        game = gameRepository.save(game);
        roomRepository.save(room);

        // Broadcast GAME_STARTED event to all players in the room
        GameStartedEvent event = new GameStartedEvent(
            room.getRoomCode(),
            game.getId(),
            game.getStatus(),
            game.getStartedAt()
        );
        eventBroadcaster.broadcastToRoom(room.getRoomCode(), event);

        return new StartGameResponse(
            game.getId(),
            room.getRoomCode(),
            game.getStatus(),
            room.getStatus(),
            game.getStartedAt()
        );
    }

    /**
     * Manual number calling endpoint - requires creator authorization
     */
    @Transactional
    public CallNumberResponse callNumber(String roomCode, Long playerId) {
        // Find the room with players and game eagerly fetched
        Room room = roomRepository.findByRoomCodeWithPlayersAndGame(roomCode)
                .orElseThrow(() -> new IllegalArgumentException("Room not found with code: " + roomCode));

        // Find the player
        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new IllegalArgumentException("Player not found with id: " + playerId));

        // Verify player belongs to the room
        if (!player.getRoom().getId().equals(room.getId())) {
            throw new IllegalStateException("Player does not belong to this room");
        }

        // Verify player is the creator
        if (!player.getIsCreator()) {
            throw new IllegalStateException("Only the room creator can call numbers");
        }

        // Find the active game
        Game game = room.getGame();
        if (game == null) {
            throw new IllegalStateException("No game found for this room");
        }

        // Call the next number using the core logic
        CalledNumber calledNumber = callNextNumber(game, room);

        return new CallNumberResponse(
            game.getId(),
            calledNumber.getNumber(),
            calledNumber.getSequenceNumber(),
            calledNumber.getCalledAt(),
            game.getStatus()
        );
    }

    /**
     * Core number calling logic - used by both manual and automatic calling.
     * This is the authoritative method for calling the next number.
     * 
     * @param game The game for which to call a number
     * @param room The room containing the game
     * @return The CalledNumber that was created
     * @throws IllegalStateException if game is not IN_PROGRESS or all numbers called
     */
    @Transactional
    public CalledNumber callNextNumber(Game game, Room room) {
        // Verify game is in progress
        if (game.getStatus() != GameStatus.IN_PROGRESS) {
            throw new IllegalStateException("Numbers can only be called when game is IN_PROGRESS");
        }

        // Get all called numbers for this game
        Set<Integer> calledNumbers = new HashSet<>();
        for (CalledNumber cn : game.getCalledNumbers()) {
            calledNumbers.add(cn.getNumber());
        }

        // Check if all 90 numbers have been called
        if (calledNumbers.size() >= 90) {
            completeGame(game, room);
            throw new IllegalStateException("All 90 numbers have been called. Game is complete.");
        }

        // Generate a random number that hasn't been called
        int number;
        int attempts = 0;
        int maxAttempts = 100;
        
        do {
            number = random.nextInt(90) + 1; // 1 through 90
            attempts++;
            
            if (attempts >= maxAttempts) {
                throw new RuntimeException("Failed to generate unique number after " + maxAttempts + " attempts");
            }
        } while (calledNumbers.contains(number));

        // Calculate sequence number
        int sequenceNumber = calledNumbers.size() + 1;

        // Create CalledNumber entity
        CalledNumber calledNumber = new CalledNumber();
        calledNumber.setNumber(number);
        calledNumber.setSequenceNumber(sequenceNumber);
        calledNumber.setGame(game);

        // Save called number
        calledNumber = calledNumberRepository.save(calledNumber);

        // Update game's current number
        game.setCurrentNumber(number);
        gameRepository.save(game);

        logger.info("Number called: {} (sequence: {}) for game {} in room {}", 
                    number, sequenceNumber, game.getId(), room.getRoomCode());

        // Broadcast NUMBER_CALLED event to all players in the room
        NumberCalledEvent event = new NumberCalledEvent(
            room.getRoomCode(),
            game.getId(),
            calledNumber.getNumber(),
            calledNumber.getSequenceNumber(),
            calledNumber.getCalledAt()
        );
        eventBroadcaster.broadcastToRoom(room.getRoomCode(), event);

        // Check if this was the last number
        if (sequenceNumber == 90) {
            completeGame(game, room);
        }

        return calledNumber;
    }

    /**
     * Marks the game and room as completed and broadcasts GAME_COMPLETED event
     */
    @Transactional
    public void completeGame(Game game, Room room) {
        // Mark game as completed
        game.setStatus(GameStatus.COMPLETED);
        game.setFinishedAt(LocalDateTime.now());
        gameRepository.save(game);

        // Mark room as completed
        room.setStatus(RoomStatus.COMPLETED);
        roomRepository.save(room);

        logger.info("Game {} in room {} completed", game.getId(), room.getRoomCode());

        // Broadcast GAME_COMPLETED event
        GameCompletedEvent event = new GameCompletedEvent(
            room.getRoomCode(),
            game.getId(),
            game.getStatus()
        );
        eventBroadcaster.broadcastToRoom(room.getRoomCode(), event);
    }
}
