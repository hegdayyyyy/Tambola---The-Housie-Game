package com.tambola.housie.dto.websocket;

import com.tambola.housie.entity.enums.ClaimResult;

public class ClaimResultEvent extends GameEvent {
    
    private Long gameId;
    private Long playerId;
    private String playerName;
    private ClaimResult claimResult;
    private Long winnerId;
    private String winnerName;

    public ClaimResultEvent(String roomCode, Long gameId, Long playerId, 
                           String playerName, ClaimResult claimResult) {
        super("CLAIM_RESULT", roomCode);
        this.gameId = gameId;
        this.playerId = playerId;
        this.playerName = playerName;
        this.claimResult = claimResult;
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

    public ClaimResult getClaimResult() {
        return claimResult;
    }

    public void setClaimResult(ClaimResult claimResult) {
        this.claimResult = claimResult;
    }

    public Long getWinnerId() {
        return winnerId;
    }

    public void setWinnerId(Long winnerId) {
        this.winnerId = winnerId;
    }

    public String getWinnerName() {
        return winnerName;
    }

    public void setWinnerName(String winnerName) {
        this.winnerName = winnerName;
    }
}
