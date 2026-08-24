package com.tambola.housie.dto;

import java.util.List;

public class GenerateTicketsResponse {

    private List<int[][]> tickets;

    // Constructors
    public GenerateTicketsResponse() {
    }

    public GenerateTicketsResponse(List<int[][]> tickets) {
        this.tickets = tickets;
    }

    // Getters and Setters
    public List<int[][]> getTickets() {
        return tickets;
    }

    public void setTickets(List<int[][]> tickets) {
        this.tickets = tickets;
    }
}
