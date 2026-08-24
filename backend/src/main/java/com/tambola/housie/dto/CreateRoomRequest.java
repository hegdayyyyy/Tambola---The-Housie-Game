package com.tambola.housie.dto;

import com.tambola.housie.entity.enums.CallerMode;
import com.tambola.housie.entity.enums.WinningMethod;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class CreateRoomRequest {

    @NotBlank(message = "Player name is required")
    private String playerName;

    @NotNull(message = "Max players is required")
    @Positive(message = "Max players must be positive")
    private Integer maxPlayers;

    @NotNull(message = "Winning method is required")
    private WinningMethod winningMethod;

    @NotNull(message = "Caller mode is required")
    private CallerMode callerMode;

    @NotNull(message = "Calling speed is required")
    @Positive(message = "Calling speed must be positive")
    private Integer callingSpeed;

    // Constructors
    public CreateRoomRequest() {
    }

    public CreateRoomRequest(String playerName, Integer maxPlayers, WinningMethod winningMethod, 
                            CallerMode callerMode, Integer callingSpeed) {
        this.playerName = playerName;
        this.maxPlayers = maxPlayers;
        this.winningMethod = winningMethod;
        this.callerMode = callerMode;
        this.callingSpeed = callingSpeed;
    }

    // Getters and Setters
    public String getPlayerName() {
        return playerName;
    }

    public void setPlayerName(String playerName) {
        this.playerName = playerName;
    }

    public Integer getMaxPlayers() {
        return maxPlayers;
    }

    public void setMaxPlayers(Integer maxPlayers) {
        this.maxPlayers = maxPlayers;
    }

    public WinningMethod getWinningMethod() {
        return winningMethod;
    }

    public void setWinningMethod(WinningMethod winningMethod) {
        this.winningMethod = winningMethod;
    }

    public CallerMode getCallerMode() {
        return callerMode;
    }

    public void setCallerMode(CallerMode callerMode) {
        this.callerMode = callerMode;
    }

    public Integer getCallingSpeed() {
        return callingSpeed;
    }

    public void setCallingSpeed(Integer callingSpeed) {
        this.callingSpeed = callingSpeed;
    }
}
