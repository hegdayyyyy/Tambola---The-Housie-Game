package com.tambola.housie.dto;

import com.tambola.housie.entity.enums.CallerMode;
import com.tambola.housie.entity.enums.RoomStatus;
import com.tambola.housie.entity.enums.WinningMethod;

public class JoinRoomResponse {

    private Long roomId;
    private String roomCode;
    private Long playerId;
    private String playerName;
    private Integer maxPlayers;
    private Integer currentPlayerCount;
    private RoomStatus status;
    private WinningMethod winningMethod;
    private CallerMode callerMode;
    private Integer callingSpeed;

    // Constructors
    public JoinRoomResponse() {
    }

    public JoinRoomResponse(Long roomId, String roomCode, Long playerId, String playerName,
                           Integer maxPlayers, Integer currentPlayerCount, RoomStatus status,
                           WinningMethod winningMethod, CallerMode callerMode, Integer callingSpeed) {
        this.roomId = roomId;
        this.roomCode = roomCode;
        this.playerId = playerId;
        this.playerName = playerName;
        this.maxPlayers = maxPlayers;
        this.currentPlayerCount = currentPlayerCount;
        this.status = status;
        this.winningMethod = winningMethod;
        this.callerMode = callerMode;
        this.callingSpeed = callingSpeed;
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

    public Integer getMaxPlayers() {
        return maxPlayers;
    }

    public void setMaxPlayers(Integer maxPlayers) {
        this.maxPlayers = maxPlayers;
    }

    public Integer getCurrentPlayerCount() {
        return currentPlayerCount;
    }

    public void setCurrentPlayerCount(Integer currentPlayerCount) {
        this.currentPlayerCount = currentPlayerCount;
    }

    public RoomStatus getStatus() {
        return status;
    }

    public void setStatus(RoomStatus status) {
        this.status = status;
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
