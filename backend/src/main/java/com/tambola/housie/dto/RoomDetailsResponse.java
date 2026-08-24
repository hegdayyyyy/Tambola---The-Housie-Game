package com.tambola.housie.dto;

import com.tambola.housie.entity.enums.CallerMode;
import com.tambola.housie.entity.enums.GameStatus;
import com.tambola.housie.entity.enums.RoomStatus;
import com.tambola.housie.entity.enums.WinningMethod;

import java.util.List;

public class RoomDetailsResponse {
    private String roomCode;
    private Integer maxPlayers;
    private WinningMethod winningMethod;
    private CallerMode callerMode;
    private Integer callingSpeed;
    private RoomStatus roomStatus;
    private GameStatus gameStatus;
    private List<PlayerInfo> players;

    public static class PlayerInfo {
        private Long playerId;
        private String playerName;
        private Boolean isCreator;
        private Boolean isDisqualified;
        private int[][] ticketData;

        public PlayerInfo(Long playerId, String playerName, Boolean isCreator, Boolean isDisqualified) {
            this.playerId = playerId;
            this.playerName = playerName;
            this.isCreator = isCreator;
            this.isDisqualified = isDisqualified;
        }

        public PlayerInfo(Long playerId, String playerName, Boolean isCreator, Boolean isDisqualified, int[][] ticketData) {
            this.playerId = playerId;
            this.playerName = playerName;
            this.isCreator = isCreator;
            this.isDisqualified = isDisqualified;
            this.ticketData = ticketData;
        }

        // Getters and Setters
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

        public Boolean getIsCreator() {
            return isCreator;
        }

        public void setIsCreator(Boolean isCreator) {
            this.isCreator = isCreator;
        }

        public Boolean getIsDisqualified() {
            return isDisqualified;
        }

        public void setIsDisqualified(Boolean isDisqualified) {
            this.isDisqualified = isDisqualified;
        }

        public int[][] getTicketData() {
            return ticketData;
        }

        public void setTicketData(int[][] ticketData) {
            this.ticketData = ticketData;
        }
    }

    // Getters and Setters
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

    public RoomStatus getRoomStatus() {
        return roomStatus;
    }

    public void setRoomStatus(RoomStatus roomStatus) {
        this.roomStatus = roomStatus;
    }

    public GameStatus getGameStatus() {
        return gameStatus;
    }

    public void setGameStatus(GameStatus gameStatus) {
        this.gameStatus = gameStatus;
    }

    public List<PlayerInfo> getPlayers() {
        return players;
    }

    public void setPlayers(List<PlayerInfo> players) {
        this.players = players;
    }
}
