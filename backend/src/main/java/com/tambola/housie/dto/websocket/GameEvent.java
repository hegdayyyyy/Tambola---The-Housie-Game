package com.tambola.housie.dto.websocket;

public abstract class GameEvent {
    
    private String type;
    private String roomCode;

    public GameEvent(String type, String roomCode) {
        this.type = type;
        this.roomCode = roomCode;
    }

    // Getters and Setters
    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getRoomCode() {
        return roomCode;
    }

    public void setRoomCode(String roomCode) {
        this.roomCode = roomCode;
    }
}
