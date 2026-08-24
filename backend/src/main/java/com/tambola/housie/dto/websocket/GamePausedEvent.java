package com.tambola.housie.dto.websocket;

public class GamePausedEvent extends GameEvent {
    
    private Long gameId;
    private Long playerId;
    private String playerName;

    public GamePausedEvent(String roomCode, Long gameId) {
        super("GAME_PAUSED", roomCode);
        this.gameId = gameId;
    }

    public GamePausedEvent(String roomCode, Long gameId, Long playerId, String playerName) {
        super("GAME_PAUSED", roomCode);
        this.gameId = gameId;
        this.playerId = playerId;
        this.playerName = playerName;
    }

    // Getters and Setters
    public Long getGameId() {
        return gameId;
    }

    public void setGameId(Long gameId) {
        this.gameId = gameId;
    }

    public Long getPlayerId() {
        return playerId;
    }

    public void setPlayerId(Long playerId) {
        this.playerId = playerId;
    }

    public String getPlayerName() {
        return playerName;
    }

    public void setPlayerName(String playerName) {
        this.playerName = playerName;
    }
}
