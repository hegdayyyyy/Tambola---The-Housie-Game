package com.tambola.housie.dto.websocket;

import com.tambola.housie.entity.enums.GameStatus;

import java.time.LocalDateTime;

public class GameStartedEvent extends GameEvent {
    
    private Long gameId;
    private GameStatus gameStatus;
    private LocalDateTime startedAt;

    public GameStartedEvent(String roomCode, Long gameId, GameStatus gameStatus, 
                           LocalDateTime startedAt) {
        super("GAME_STARTED", roomCode);
        this.gameId = gameId;
        this.gameStatus = gameStatus;
        this.startedAt = startedAt;
    }

    // Getters and Setters
    public Long getGameId() {
        return gameId;
    }

    public void setGameId(Long gameId) {
        this.gameId = gameId;
    }

    public GameStatus getGameStatus() {
        return gameStatus;
    }

    public void setGameStatus(GameStatus gameStatus) {
        this.gameStatus = gameStatus;
    }

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(LocalDateTime startedAt) {
        this.startedAt = startedAt;
    }
}
