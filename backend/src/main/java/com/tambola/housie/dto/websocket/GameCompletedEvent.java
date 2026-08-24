package com.tambola.housie.dto.websocket;

import com.tambola.housie.entity.enums.ClaimResult;
import com.tambola.housie.entity.enums.GameStatus;

public class GameCompletedEvent extends GameEvent {
    
    private Long gameId;
    private GameStatus gameStatus;
    private Long winnerId;
    private String winnerName;
    private ClaimResult claimResult;

    public GameCompletedEvent(String roomCode, Long gameId, GameStatus gameStatus) {
        super("GAME_COMPLETED", roomCode);
        this.gameId = gameId;
        this.gameStatus = gameStatus;
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

    public ClaimResult getClaimResult() {
        return claimResult;
    }

    public void setClaimResult(ClaimResult claimResult) {
        this.claimResult = claimResult;
    }
}
