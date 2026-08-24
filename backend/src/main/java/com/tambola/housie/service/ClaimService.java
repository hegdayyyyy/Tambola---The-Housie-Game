package com.tambola.housie.service;

import com.tambola.housie.dto.ClaimResponse;
import com.tambola.housie.dto.websocket.ClaimResultEvent;
import com.tambola.housie.dto.websocket.GameCompletedEvent;
import com.tambola.housie.dto.websocket.GamePausedEvent;
import com.tambola.housie.dto.websocket.GameResumedEvent;
import com.tambola.housie.entity.*;
import com.tambola.housie.entity.enums.ClaimResult;
import com.tambola.housie.entity.enums.GameStatus;
import com.tambola.housie.entity.enums.RoomStatus;
import com.tambola.housie.entity.enums.WinningMethod;
import com.tambola.housie.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Service
public class ClaimService {

    private static final Logger logger = LoggerFactory.getLogger(ClaimService.class);

    private final RoomRepository roomRepository;
    private final PlayerRepository playerRepository;
    private final GameRepository gameRepository;
    private final ClaimRepository claimRepository;
    private final CalledNumberRepository calledNumberRepository;
    private final WebSocketEventBroadcaster eventBroadcaster;

    public ClaimService(RoomRepository roomRepository,
                       PlayerRepository playerRepository,
                       GameRepository gameRepository,
                       ClaimRepository claimRepository,
                       CalledNumberRepository calledNumberRepository,
                       WebSocketEventBroadcaster eventBroadcaster) {
        this.roomRepository = roomRepository;
        this.playerRepository = playerRepository;
        this.gameRepository = gameRepository;
        this.claimRepository = claimRepository;
        this.calledNumberRepository = calledNumberRepository;
        this.eventBroadcaster = eventBroadcaster;
    }

    @Transactional
    public ClaimResponse processClaim(String roomCode, Long playerId) {
        // 1. Find the room with players and game eagerly fetched
        Room room = roomRepository.findByRoomCodeWithPlayersAndGame(roomCode)
                .orElseThrow(() -> new IllegalArgumentException("Room not found with code: " + roomCode));

        // 2. Find the player with ticket eagerly fetched
        Player player = playerRepository.findByIdWithTicket(playerId)
                .orElseThrow(() -> new IllegalArgumentException("Player not found with id: " + playerId));

        // 3. Verify player belongs to the room
        if (!player.getRoom().getId().equals(room.getId())) {
            throw new IllegalStateException("Player does not belong to this room");
        }

        // 4. Verify player is not disqualified
        if (player.getIsDisqualified()) {
            throw new IllegalStateException("Disqualified players cannot make claims");
        }

        // 5. Find the active game
        Game game = room.getGame();
        if (game == null) {
            throw new IllegalStateException("No game found for this room");
        }

        // 6. Verify game is IN_PROGRESS (not PAUSED, not COMPLETED)
        if (game.getStatus() != GameStatus.IN_PROGRESS) {
            throw new IllegalStateException("Claims can only be made when game is IN_PROGRESS");
        }

        // 7. Verify player has a ticket
        Ticket ticket = player.getTicket();
        if (ticket == null) {
            throw new IllegalStateException("Player does not have a ticket");
        }

        // 8. Verify room has a valid winning method
        WinningMethod winningMethod = room.getWinningMethod();
        if (winningMethod == null) {
            throw new IllegalStateException("Room does not have a winning method configured");
        }

        // PAUSE THE GAME
        game.setStatus(GameStatus.PAUSED);
        gameRepository.save(game);

        logger.info("Game {} paused for claim validation by player {} in room {}", 
                   game.getId(), player.getId(), room.getRoomCode());

        // Broadcast GAME_PAUSED event with player info
        GamePausedEvent pausedEvent = new GamePausedEvent(
            room.getRoomCode(), 
            game.getId(), 
            player.getId(), 
            player.getName()
        );
        eventBroadcaster.broadcastToRoom(room.getRoomCode(), pausedEvent);

        // Load called numbers
        Set<Integer> calledNumbers = new HashSet<>();
        for (CalledNumber cn : game.getCalledNumbers()) {
            calledNumbers.add(cn.getNumber());
        }

        // Validate the claim
        boolean isValid = validateClaim(ticket.getTicketData(), calledNumbers, winningMethod);

        ClaimResponse response;

        if (isValid) {
            response = handleValidClaim(game, room, player);
        } else {
            response = handleInvalidClaim(game, room, player);
        }

        return response;
    }

    /**
     * Validates a claim based on the winning method
     */
    private boolean validateClaim(int[][] ticketData, Set<Integer> calledNumbers, WinningMethod winningMethod) {
        switch (winningMethod) {
            case EARLY_FIVE:
                return validateEarlyFive(ticketData, calledNumbers);
            case TOP_LINE:
                return validateTopLine(ticketData, calledNumbers);
            case MIDDLE_LINE:
                return validateMiddleLine(ticketData, calledNumbers);
            case BOTTOM_LINE:
                return validateBottomLine(ticketData, calledNumbers);
            case FULL_HOUSE:
                return validateFullHouse(ticketData, calledNumbers);
            default:
                logger.error("Unknown winning method: {}", winningMethod);
                return false;
        }
    }

    /**
     * EARLY_FIVE: At least 5 numbers from the ticket must have been called
     */
    private boolean validateEarlyFive(int[][] ticketData, Set<Integer> calledNumbers) {
        int matchedCount = 0;
        
        for (int row = 0; row < 3; row++) {
            for (int col = 0; col < 9; col++) {
                int number = ticketData[row][col];
                if (number != 0 && calledNumbers.contains(number)) {
                    matchedCount++;
                    if (matchedCount >= 5) {
                        return true;
                    }
                }
            }
        }
        
        return false;
    }

    /**
     * TOP_LINE: All 5 numbers in row 0 must have been called
     */
    private boolean validateTopLine(int[][] ticketData, Set<Integer> calledNumbers) {
        return validateLine(ticketData, calledNumbers, 0);
    }

    /**
     * MIDDLE_LINE: All 5 numbers in row 1 must have been called
     */
    private boolean validateMiddleLine(int[][] ticketData, Set<Integer> calledNumbers) {
        return validateLine(ticketData, calledNumbers, 1);
    }

    /**
     * BOTTOM_LINE: All 5 numbers in row 2 must have been called
     */
    private boolean validateBottomLine(int[][] ticketData, Set<Integer> calledNumbers) {
        return validateLine(ticketData, calledNumbers, 2);
    }

    /**
     * Helper to validate a specific line
     */
    private boolean validateLine(int[][] ticketData, Set<Integer> calledNumbers, int row) {
        int matchedCount = 0;
        int numbersInRow = 0;

        for (int col = 0; col < 9; col++) {
            int number = ticketData[row][col];
            if (number != 0) {
                numbersInRow++;
                if (calledNumbers.contains(number)) {
                    matchedCount++;
                }
            }
        }

        // Each row has exactly 5 numbers
        return numbersInRow == 5 && matchedCount == 5;
    }

    /**
     * FULL_HOUSE: All 15 numbers in the ticket must have been called
     */
    private boolean validateFullHouse(int[][] ticketData, Set<Integer> calledNumbers) {
        int totalNumbers = 0;
        int matchedNumbers = 0;

        for (int row = 0; row < 3; row++) {
            for (int col = 0; col < 9; col++) {
                int number = ticketData[row][col];
                if (number != 0) {
                    totalNumbers++;
                    if (calledNumbers.contains(number)) {
                        matchedNumbers++;
                    }
                }
            }
        }

        // Ticket has exactly 15 numbers
        return totalNumbers == 15 && matchedNumbers == 15;
    }

    /**
     * Handle a valid claim - player wins
     */
    @Transactional
    public ClaimResponse handleValidClaim(Game game, Room room, Player player) {
        // Create claim record
        Claim claim = new Claim();
        claim.setResult(ClaimResult.VALID);
        claim.setGame(game);
        claim.setPlayer(player);
        claimRepository.save(claim);

        // Set winner
        game.setWinner(player);
        game.setStatus(GameStatus.COMPLETED);
        game.setFinishedAt(LocalDateTime.now());
        gameRepository.save(game);

        // Complete room
        room.setStatus(RoomStatus.COMPLETED);
        roomRepository.save(room);

        logger.info("Valid claim by player {} in game {}. Game completed.", player.getId(), game.getId());

        // Broadcast CLAIM_RESULT event for valid claim
        ClaimResultEvent claimEvent = new ClaimResultEvent(
            room.getRoomCode(),
            game.getId(),
            player.getId(),
            player.getName(),
            ClaimResult.VALID
        );
        claimEvent.setWinnerId(player.getId());
        claimEvent.setWinnerName(player.getName());
        eventBroadcaster.broadcastToRoom(room.getRoomCode(), claimEvent);

        // Broadcast GAME_COMPLETED event with winner info
        GameCompletedEvent completedEvent = new GameCompletedEvent(
            room.getRoomCode(),
            game.getId(),
            game.getStatus()
        );
        completedEvent.setWinnerId(player.getId());
        completedEvent.setWinnerName(player.getName());
        completedEvent.setClaimResult(ClaimResult.VALID);
        eventBroadcaster.broadcastToRoom(room.getRoomCode(), completedEvent);

        // Build response
        ClaimResponse response = new ClaimResponse(
            game.getId(),
            room.getRoomCode(),
            player.getId(),
            player.getName(),
            ClaimResult.VALID,
            game.getStatus()
        );
        response.setWinnerId(player.getId());
        response.setWinnerName(player.getName());
        response.setDisqualified(false);

        return response;
    }

    /**
     * Handle an invalid claim - disqualify player and check if game should end
     */
    @Transactional
    public ClaimResponse handleInvalidClaim(Game game, Room room, Player player) {
        // Create claim record
        Claim claim = new Claim();
        claim.setResult(ClaimResult.INVALID);
        claim.setGame(game);
        claim.setPlayer(player);
        claimRepository.save(claim);

        // Disqualify player
        player.setIsDisqualified(true);
        playerRepository.save(player);

        logger.info("Invalid claim by player {} in game {}. Player disqualified.", 
                   player.getId(), game.getId());

        // Broadcast CLAIM_RESULT event
        ClaimResultEvent claimEvent = new ClaimResultEvent(
            room.getRoomCode(),
            game.getId(),
            player.getId(),
            player.getName(),
            ClaimResult.INVALID
        );
        eventBroadcaster.broadcastToRoom(room.getRoomCode(), claimEvent);

        // Check if all players are now disqualified
        java.util.List<Player> roomPlayers = room.getPlayers();
        boolean allDisqualified = roomPlayers.stream()
                .allMatch(Player::getIsDisqualified);

        if (allDisqualified) {
            // All players disqualified - no winner scenario
            game.setStatus(GameStatus.COMPLETED);
            game.setFinishedAt(LocalDateTime.now());
            gameRepository.save(game);

            // Complete room
            room.setStatus(RoomStatus.COMPLETED);
            roomRepository.save(room);

            logger.info("All players in room {} disqualified. Game {} ended with no winner.", 
                       room.getRoomCode(), game.getId());

            // Broadcast GAME_COMPLETED event with no winner
            GameCompletedEvent completedEvent = new GameCompletedEvent(
                room.getRoomCode(),
                game.getId(),
                game.getStatus()
            );
            completedEvent.setClaimResult(ClaimResult.INVALID);
            eventBroadcaster.broadcastToRoom(room.getRoomCode(), completedEvent);
        } else {
            // Some players still active - keep game paused
            // Frontend will manually resume when player clicks "Continue Game" or after timeout
            game.setStatus(GameStatus.PAUSED);
            gameRepository.save(game);

            logger.info("Game {} remains paused after invalid claim. {} active players remaining.", 
                       game.getId(), 
                       roomPlayers.stream().filter(p -> !p.getIsDisqualified()).count());

            // Do NOT broadcast GAME_RESUMED here - let frontend control when to resume
        }

        // Build response
        ClaimResponse response = new ClaimResponse(
            game.getId(),
            room.getRoomCode(),
            player.getId(),
            player.getName(),
            ClaimResult.INVALID,
            game.getStatus()
        );
        response.setDisqualified(true);

        return response;
    }

    /**
     * Resume game after invalid claim - called when player clicks "Continue Game"
     */
    @Transactional
    public void resumeGame(String roomCode) {
        Room room = roomRepository.findByRoomCode(roomCode)
                .orElseThrow(() -> new IllegalArgumentException("Room not found with code: " + roomCode));

        Game game = room.getGame();
        if (game == null) {
            throw new IllegalStateException("No game found for this room");
        }

        if (game.getStatus() == GameStatus.PAUSED) {
            game.setStatus(GameStatus.IN_PROGRESS);
            gameRepository.save(game);

            logger.info("Game {} resumed after player dismissed invalid claim.", game.getId());

            // Broadcast GAME_RESUMED event to all players
            GameResumedEvent resumedEvent = new GameResumedEvent(room.getRoomCode(), game.getId());
            eventBroadcaster.broadcastToRoom(room.getRoomCode(), resumedEvent);
        }
    }
}
