package com.tambola.housie.dto;

import com.tambola.housie.entity.enums.CallerMode;
import com.tambola.housie.entity.enums.RoomStatus;
import com.tambola.housie.entity.enums.WinningMethod;

public class CreateRoomResponse {

    private Long roomId;
    private String roomCode;
    private Integer maxPlayers;
    private WinningMethod winningMethod;
    private CallerMode callerMode;
    private Integer callingSpeed;
    private RoomStatus status;
    private Long playerId;
    private String playerName;

    // Constructors
    public CreateRoomResponse() {
    }

    public CreateRoomResponse(Long roomId, String roomCode, Integer maxPlayers, 
                             WinningMethod winningMethod, CallerMode callerMode, 
                             Integer callingSpeed, RoomStatus status, 
                             Long playerId, String playerName) {
        this.roomId = roomId;
        this.roomCode = roomCode;
        this.maxPlayers = maxPlayers;
        this.winningMethod = winningMethod;
        this.callerMode = callerMode;
        this.callingSpeed = callingSpeed;
        this.status = status;
        this.playerId = playerId;
        this.playerName = playerName;
    }

    // Getters and Setters
    public Long getRoomId() {
        return roomId;
    }

    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }

    public String getRoomCode() {
        return roomCode;
    }

    public void setRoomCode(String roomCode) {
        this.roomCode = roomCode;
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

    public RoomStatus getStatus() {
        return status;
    }

    public void setStatus(RoomStatus status) {
        this.status = status;
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
}
