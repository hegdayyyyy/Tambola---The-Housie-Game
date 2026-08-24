package com.tambola.housie.dto;

import jakarta.validation.constraints.NotNull;

public class SelectTicketRequest {

    @NotNull(message = "Ticket data is required")
    private int[][] ticketData;

    // Constructors
    public SelectTicketRequest() {
    }

    public SelectTicketRequest(int[][] ticketData) {
        this.ticketData = ticketData;
    }

    // Getters and Setters
    public int[][] getTicketData() {
        return ticketData;
    }

    public void setTicketData(int[][] ticketData) {
        this.ticketData = ticketData;
    }
}
