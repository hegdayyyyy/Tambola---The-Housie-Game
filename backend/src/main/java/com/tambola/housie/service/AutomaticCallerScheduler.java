package com.tambola.housie.service;

import com.tambola.housie.entity.Game;
import com.tambola.housie.entity.Room;
import com.tambola.housie.entity.enums.CallerMode;
import com.tambola.housie.entity.enums.GameStatus;
import com.tambola.housie.repository.GameRepository;
import com.tambola.housie.repository.RoomRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Scheduler service for automatic number calling in Tambola games.
 * 
 * This service periodically checks for active automatic games and calls
 * numbers based on each room's configured calling speed.
 * 
 * Design principles:
 * - Single scheduler handles all automatic games
 * - Each game tracked with its own next-call timestamp
 * - Respects individual room calling speeds (3, 5, or 7 seconds)
 * - Only processes games with status IN_PROGRESS and callerMode AUTOMATIC
 */
@Service
public class AutomaticCallerScheduler {

    private static final Logger logger = LoggerFactory.getLogger(AutomaticCallerScheduler.class);

    private final GameRepository gameRepository;
    private final RoomRepository roomRepository;
    private final GameService gameService;

    // Track next call time for each active automatic game
    // Key: gameId, Value: next call timestamp
    private final Map<Long, LocalDateTime> nextCallTimes = new ConcurrentHashMap<>();
    
    // Track last DB check time to avoid excessive queries
    private long lastDbCheckTime = 0;
    private static final long DB_CHECK_INTERVAL_MS = 10000; // Check DB every 10 seconds when idle

    public AutomaticCallerScheduler(GameRepository gameRepository,
                                   RoomRepository roomRepository,
                                   GameService gameService) {
        this.gameRepository = gameRepository;
        this.roomRepository = roomRepository;
        this.gameService = gameService;
    }

    /**
     * Scheduled task that runs every second to check if any automatic games
     * need a number called.
     * 
     * This approach allows multiple games with different calling speeds to
     * run independently without creating separate threads per game.
     */
    @Scheduled(fixedRate = 1000) // Run every 1 second
    public void processAutomaticGames() {
        try {
            long currentTime = System.currentTimeMillis();
            
            // Early exit if no games are being tracked and we checked DB recently
            if (nextCallTimes.isEmpty() && (currentTime - lastDbCheckTime) < DB_CHECK_INTERVAL_MS) {
                return;
            }

            // Update last DB check time
            lastDbCheckTime = currentTime;

            // Find all games that are IN_PROGRESS with Room eagerly fetched
            List<Game> activeGames = gameRepository.findByStatusWithRoom(GameStatus.IN_PROGRESS);

            if (activeGames.isEmpty() && !nextCallTimes.isEmpty()) {
                logger.info("No active games found, clearing tracking map");
                nextCallTimes.clear();
                return;
            }

            processGames(activeGames);

        } catch (Exception e) {
            logger.error("Error in automatic caller scheduler: {}", e.getMessage(), e);
        }
    }
    
    @Transactional
    private void processGames(List<Game> activeGames) {
        LocalDateTime now = LocalDateTime.now();

        for (Game game : activeGames) {
            try {
                processGame(game, now);
            } catch (Exception e) {
                logger.error("Error processing automatic game {}: {}", game.getId(), e.getMessage(), e);
            }
        }

        // Cleanup: remove completed games from tracking
        cleanupCompletedGames();
    }

    /**
     * Process a single game for automatic calling
     */
    public void processGame(Game game, LocalDateTime now) {
        Room room = game.getRoom();

        // Only process automatic games
        if (room.getCallerMode() != CallerMode.AUTOMATIC) {
            // Remove from tracking if it was previously automatic
            nextCallTimes.remove(game.getId());
            return;
        }

        // Do NOT call numbers if game is PAUSED (claim validation in progress)
        if (game.getStatus() == GameStatus.PAUSED) {
            logger.debug("Game {} is PAUSED, skipping automatic call", game.getId());
            return;
        }

        // Only process IN_PROGRESS games
        if (game.getStatus() != GameStatus.IN_PROGRESS) {
            nextCallTimes.remove(game.getId());
            return;
        }

        // Check if it's time to call the next number
        LocalDateTime nextCallTime = nextCallTimes.get(game.getId());

        if (nextCallTime == null) {
            // First call for this game - schedule immediately
            logger.info("Starting automatic calling for game {} in room {} with {}s interval",
                       game.getId(), room.getRoomCode(), room.getCallingSpeed());
            scheduleNextCall(game, now);
        } else if (now.isAfter(nextCallTime) || now.isEqual(nextCallTime)) {
            // Time to call the next number
            try {
                logger.debug("Automatic call triggered for game {} in room {}", 
                           game.getId(), room.getRoomCode());
                
                gameService.callNextNumber(game, room);
                
                // Schedule the next call
                scheduleNextCall(game, now);
                
            } catch (IllegalStateException e) {
                // Game completed or other valid state change
                logger.info("Automatic calling stopped for game {}: {}", game.getId(), e.getMessage());
                nextCallTimes.remove(game.getId());
            }
        }
    }

    /**
     * Schedule the next call for a game based on its calling speed
     */
    private void scheduleNextCall(Game game, LocalDateTime now) {
        Room room = game.getRoom();
        int callingSpeedSeconds = room.getCallingSpeed();
        
        LocalDateTime nextCall = now.plusSeconds(callingSpeedSeconds);
        nextCallTimes.put(game.getId(), nextCall);
        
        logger.debug("Next automatic call for game {} scheduled at {}", game.getId(), nextCall);
    }

    /**
     * Remove games that are no longer IN_PROGRESS from tracking
     */
    private void cleanupCompletedGames() {
        nextCallTimes.keySet().removeIf(gameId -> {
            Game game = gameRepository.findById(gameId).orElse(null);
            if (game == null || game.getStatus() != GameStatus.IN_PROGRESS) {
                logger.debug("Removing completed/invalid game {} from automatic calling tracking", gameId);
                return true;
            }
            return false;
        });
    }

    /**
     * Manually register a game for automatic calling (called when game starts)
     */
    public void registerGame(Long gameId) {
        // The game will be picked up on the next scheduler cycle
        logger.info("Game {} registered for automatic calling", gameId);
    }

    /**
     * Manually unregister a game from automatic calling
     */
    public void unregisterGame(Long gameId) {
        nextCallTimes.remove(gameId);
        logger.info("Game {} unregistered from automatic calling", gameId);
    }
}
