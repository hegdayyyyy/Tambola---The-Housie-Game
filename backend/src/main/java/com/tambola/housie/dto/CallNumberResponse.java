package com.tambola.housie.dto;

import com.tambola.housie.entity.enums.GameStatus;

import java.time.LocalDateTime;

public class CallNumberResponse {

    private Long gameId;
    private Integer number;
    private Integer sequenceNumber;
    private LocalDateTime calledAt;
    private GameStatus gameStatus;

    // Constructors
    public CallNumberResponse() {
    }

    public CallNumberResponse(Long gameId, Integer number, Integer sequenceNumber, 
                             LocalDateTime calledAt, GameStatus gameStatus) {
        this.gameId = gameId;
        this.number = number;
        this.sequenceNumber = sequenceNumber;
        this.calledAt = calledAt;
        this.gameStatus = gameStatus;
    }

    // Getters and Setters
    public Long getGameId() {
        return gameId;
    }

    public void setGameId(Long gameId) {
        this.gameId = gameId;
    }

    public Integer getNumber() {
        return number;
    }

    public void setNumber(Integer number) {
        this.number = number;
    }

    public Integer getSequenceNumber() {
        return sequenceNumber;
    }

    public void setSequenceNumber(Integer sequenceNumber) {
        this.sequenceNumber = sequenceNumber;
    }

    public LocalDateTime getCalledAt() {
        return calledAt;
    }

    public void setCalledAt(LocalDateTime calledAt) {
        this.calledAt = calledAt;
    }

    public GameStatus getGameStatus() {
        return gameStatus;
    }

    public void setGameStatus(GameStatus gameStatus) {
        this.gameStatus = gameStatus;
    }
}
