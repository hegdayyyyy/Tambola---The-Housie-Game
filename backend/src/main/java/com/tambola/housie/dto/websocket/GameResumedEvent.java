package com.tambola.housie.dto.websocket;

public class GameResumedEvent extends GameEvent {
    
    private Long gameId;

    public GameResumedEvent(String roomCode, Long gameId) {
        super("GAME_RESUMED", roomCode);
        this.gameId = gameId;
    }

    // Getters and Setters
    public Long getGameId() {
        return gameId;
    }

    public void setGameId(Long gameId) {
        this.gameId = gameId;
    }
}
