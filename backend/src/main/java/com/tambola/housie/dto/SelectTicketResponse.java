package com.tambola.housie.dto;

public class SelectTicketResponse {

    private Long ticketId;
    private Long playerId;
    private int[][] ticketData;

    // Constructors
    public SelectTicketResponse() {
    }

    public SelectTicketResponse(Long ticketId, Long playerId, int[][] ticketData) {
        this.ticketId = ticketId;
        this.playerId = playerId;
        this.ticketData = ticketData;
    }

    // Getters and Setters
    public Long getTicketId() {
        return ticketId;
    }

    public void setTicketId(Long ticketId) {
        this.ticketId = ticketId;
    }

    public Long getPlayerId() {
        return playerId;
    }

    public void setPlayerId(Long playerId) {
        this.playerId = playerId;
    }

    public int[][] getTicketData() {
        return ticketData;
    }

    public void setTicketData(int[][] ticketData) {
        this.ticketData = ticketData;
    }
}
