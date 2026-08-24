package com.tambola.housie.dto;

import com.tambola.housie.entity.enums.GameStatus;
import com.tambola.housie.entity.enums.RoomStatus;

import java.time.LocalDateTime;

public class StartGameResponse {

    private Long gameId;
    private String roomCode;
    private GameStatus gameStatus;
    private RoomStatus roomStatus;
    private LocalDateTime startedAt;

    // Constructors
    public StartGameResponse() {
    }

    public StartGameResponse(Long gameId, String roomCode, GameStatus gameStatus, 
                            RoomStatus roomStatus, LocalDateTime startedAt) {
        this.gameId = gameId;
        this.roomCode = roomCode;
        this.gameStatus = gameStatus;
        this.roomStatus = roomStatus;
        this.startedAt = startedAt;
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

    public GameStatus getGameStatus() {
        return gameStatus;
    }

    public void setGameStatus(GameStatus gameStatus) {
        this.gameStatus = gameStatus;
    }

    public RoomStatus getRoomStatus() {
        return roomStatus;
    }

    public void setRoomStatus(RoomStatus roomStatus) {
        this.roomStatus = roomStatus;
    }

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(LocalDateTime startedAt) {
        this.startedAt = startedAt;
    }
}
