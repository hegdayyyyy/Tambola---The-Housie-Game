package com.tambola.housie.dto.websocket;

public class PlayerJoinedEvent extends GameEvent {
    
    private Long playerId;
    private String playerName;
    private Integer currentPlayerCount;

    public PlayerJoinedEvent(String roomCode, Long playerId, String playerName, 
                            Integer currentPlayerCount) {
        super("PLAYER_JOINED", roomCode);
        this.playerId = playerId;
        this.playerName = playerName;
        this.currentPlayerCount = currentPlayerCount;
    }

    // Getters and Setters
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

    public Integer getCurrentPlayerCount() {
        return currentPlayerCount;
    }

    public void setCurrentPlayerCount(Integer currentPlayerCount) {
        this.currentPlayerCount = currentPlayerCount;
    }
}
