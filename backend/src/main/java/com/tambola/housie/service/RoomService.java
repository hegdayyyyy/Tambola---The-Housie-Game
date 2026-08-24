package com.tambola.housie.service;

import com.tambola.housie.dto.CreateRoomRequest;
import com.tambola.housie.dto.CreateRoomResponse;
import com.tambola.housie.dto.JoinRoomRequest;
import com.tambola.housie.dto.JoinRoomResponse;
import com.tambola.housie.dto.RoomDetailsResponse;
import com.tambola.housie.dto.websocket.PlayerJoinedEvent;
import com.tambola.housie.entity.Player;
import com.tambola.housie.entity.Room;
import com.tambola.housie.entity.enums.GameStatus;
import com.tambola.housie.entity.enums.RoomStatus;
import com.tambola.housie.repository.PlayerRepository;
import com.tambola.housie.repository.RoomRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class RoomService {

    private final RoomRepository roomRepository;
    private final PlayerRepository playerRepository;
    private final WebSocketEventBroadcaster eventBroadcaster;
    private final Random random;

    public RoomService(RoomRepository roomRepository, 
                      PlayerRepository playerRepository,
                      WebSocketEventBroadcaster eventBroadcaster) {
        this.roomRepository = roomRepository;
        this.playerRepository = playerRepository;
        this.eventBroadcaster = eventBroadcaster;
        this.random = new Random();
    }

    @Transactional
    public CreateRoomResponse createRoom(CreateRoomRequest request) {
        // Validate maxPlayers
        if (!isValidMaxPlayers(request.getMaxPlayers())) {
            throw new IllegalArgumentException("Max players must be 2, 3, or 4");
        }

        // Validate callingSpeed
        if (!isValidCallingSpeed(request.getCallingSpeed())) {
            throw new IllegalArgumentException("Calling speed must be 3, 5, or 7 seconds");
        }

        // Generate unique room code
        String roomCode = generateUniqueRoomCode();

        // Create Room
        Room room = new Room();
        room.setRoomCode(roomCode);
        room.setMaxPlayers(request.getMaxPlayers());
        room.setWinningMethod(request.getWinningMethod());
        room.setCallerMode(request.getCallerMode());
        room.setCallingSpeed(request.getCallingSpeed());
        room.setStatus(RoomStatus.WAITING);

        // Save room
        room = roomRepository.save(room);

        // Create Player (room creator)
        Player player = new Player();
        player.setName(request.getPlayerName());
        player.setIsCreator(true);
        player.setIsDisqualified(false);
        player.setRoom(room);

        // Save player
        player = playerRepository.save(player);

        // Build response
        return new CreateRoomResponse(
            room.getId(),
            room.getRoomCode(),
            room.getMaxPlayers(),
            room.getWinningMethod(),
            room.getCallerMode(),
            room.getCallingSpeed(),
            room.getStatus(),
            player.getId(),
            player.getName()
        );
    }

    private boolean isValidMaxPlayers(Integer maxPlayers) {
        return maxPlayers != null && (maxPlayers == 2 || maxPlayers == 3 || maxPlayers == 4);
    }

    private boolean isValidCallingSpeed(Integer callingSpeed) {
        return callingSpeed != null && (callingSpeed == 3 || callingSpeed == 5 || callingSpeed == 7);
    }

    private String generateUniqueRoomCode() {
        String roomCode;
        int attempts = 0;
        int maxAttempts = 10;

        do {
            roomCode = generateRoomCode();
            attempts++;
            
            if (attempts >= maxAttempts) {
                throw new RuntimeException("Failed to generate unique room code after " + maxAttempts + " attempts");
            }
        } while (roomRepository.findByRoomCode(roomCode).isPresent());

        return roomCode;
    }

    private String generateRoomCode() {
        // Generate 6-character alphanumeric code
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder code = new StringBuilder(6);
        
        for (int i = 0; i < 6; i++) {
            code.append(characters.charAt(random.nextInt(characters.length())));
        }
        
        return code.toString();
    }

    @Transactional
    public JoinRoomResponse joinRoom(String roomCode, JoinRoomRequest request) {
        // Find the room with players eagerly fetched
        Room room = roomRepository.findByRoomCodeWithPlayers(roomCode)
                .orElseThrow(() -> new IllegalArgumentException("Room not found with code: " + roomCode));

        // Check if room is in WAITING status
        if (room.getStatus() != RoomStatus.WAITING) {
            throw new IllegalStateException("Room is not accepting new players");
        }

        // Check if room is full
        int currentPlayerCount = room.getPlayers().size();
        if (currentPlayerCount >= room.getMaxPlayers()) {
            throw new IllegalStateException("Room is full");
        }

        // Create new player
        Player player = new Player();
        player.setName(request.getPlayerName());
        player.setIsCreator(false);
        player.setIsDisqualified(false);
        player.setRoom(room);

        // Save player
        player = playerRepository.save(player);

        // Calculate updated player count
        int updatedPlayerCount = currentPlayerCount + 1;

        // Broadcast PLAYER_JOINED event to all players in the room
        PlayerJoinedEvent event = new PlayerJoinedEvent(
            room.getRoomCode(),
            player.getId(),
            player.getName(),
            updatedPlayerCount
        );
        eventBroadcaster.broadcastToRoom(room.getRoomCode(), event);

        // Build response
        return new JoinRoomResponse(
            room.getId(),
            room.getRoomCode(),
            player.getId(),
            player.getName(),
            room.getMaxPlayers(),
            updatedPlayerCount,
            room.getStatus(),
            room.getWinningMethod(),
            room.getCallerMode(),
            room.getCallingSpeed()
        );
    }

    @Transactional(readOnly = true)
    public RoomDetailsResponse getRoomDetails(String roomCode) {
        // Find the room with players and game eagerly fetched to avoid N+1 queries
        Room room = roomRepository.findByRoomCodeWithPlayersAndGame(roomCode)
                .orElseThrow(() -> new IllegalArgumentException("Room not found with code: " + roomCode));

        // Build player list
        List<RoomDetailsResponse.PlayerInfo> playerInfoList = room.getPlayers().stream()
                .map(player -> new RoomDetailsResponse.PlayerInfo(
                        player.getId(),
                        player.getName(),
                        player.getIsCreator(),
                        player.getIsDisqualified(),
                        player.getTicket() != null ? player.getTicket().getTicketData() : null
                ))
                .collect(Collectors.toList());

        // Build response
        RoomDetailsResponse response = new RoomDetailsResponse();
        response.setRoomCode(room.getRoomCode());
        response.setMaxPlayers(room.getMaxPlayers());
        response.setWinningMethod(room.getWinningMethod());
        response.setCallerMode(room.getCallerMode());
        response.setCallingSpeed(room.getCallingSpeed());
        response.setRoomStatus(room.getStatus());
        response.setGameStatus(room.getGame() != null ? room.getGame().getStatus() : null);
        response.setPlayers(playerInfoList);

        return response;
    }
}
