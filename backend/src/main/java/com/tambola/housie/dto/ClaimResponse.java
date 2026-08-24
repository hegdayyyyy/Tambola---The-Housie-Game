package com.tambola.housie.dto;

import com.tambola.housie.entity.enums.ClaimResult;
import com.tambola.housie.entity.enums.GameStatus;

public class ClaimResponse {
    
    private Long gameId;
    private String roomCode;
    private Long playerId;
    private String playerName;
    private ClaimResult claimResult;
    private GameStatus gameStatus;
    private Boolean disqualified;
    private Long winnerId;
    private String winnerName;

    public ClaimResponse(Long gameId, String roomCode, Long playerId, String playerName,
                        ClaimResult claimResult, GameStatus gameStatus) {
        this.gameId = gameId;
        this.roomCode = roomCode;
        this.playerId = playerId;
        this.playerName = playerName;
        this.claimResult = claimResult;
        this.gameStatus = gameStatus;
    }

    // Getters and Setters
    public Long getGameId() {
        return gameId;
    }

    public void setGameId(Long gameId) {
        this.gameId = gameId;
    }

    public String getRoomCode() {
        return roomCode;
    }

    public void setRoomCode(String roomCode) {
        this.roomCode = roomCode;
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

    public GameStatus getGameStatus() {
        return gameStatus;
    }

    public void setGameStatus(GameStatus gameStatus) {
        this.gameStatus = gameStatus;
    }

    public Boolean getDisqualified() {
        return disqualified;
    }

    public void setDisqualified(Boolean disqualified) {
        this.disqualified = disqualified;
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
