package com.tambola.housie.dto.websocket;

import java.time.LocalDateTime;

public class NumberCalledEvent extends GameEvent {
    
    private Long gameId;
    private Integer number;
    private Integer sequenceNumber;
    private LocalDateTime calledAt;

    public NumberCalledEvent(String roomCode, Long gameId, Integer number, 
                            Integer sequenceNumber, LocalDateTime calledAt) {
        super("NUMBER_CALLED", roomCode);
        this.gameId = gameId;
        this.number = number;
        this.sequenceNumber = sequenceNumber;
        this.calledAt = calledAt;
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
}
