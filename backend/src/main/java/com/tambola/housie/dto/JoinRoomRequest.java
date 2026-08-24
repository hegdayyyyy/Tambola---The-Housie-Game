package com.tambola.housie.dto;

import jakarta.validation.constraints.NotBlank;

public class JoinRoomRequest {

    @NotBlank(message = "Player name is required")
    private String playerName;

    // Constructors
    public JoinRoomRequest() {
    }

    public JoinRoomRequest(String playerName) {
        this.playerName = playerName;
    }

    // Getters and Setters
    public String getPlayerName() {
        return playerName;
    }

    public void setPlayerName(String playerName) {
        this.playerName = playerName;
    }
}
