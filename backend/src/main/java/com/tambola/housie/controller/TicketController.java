package com.tambola.housie.controller;

import com.tambola.housie.dto.GenerateTicketsResponse;
import com.tambola.housie.dto.SelectTicketRequest;
import com.tambola.housie.dto.SelectTicketResponse;
import com.tambola.housie.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rooms")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @GetMapping("/{roomCode}/players/{playerId}/tickets")
    public ResponseEntity<GenerateTicketsResponse> generateTickets(
            @PathVariable String roomCode,
            @PathVariable Long playerId) {
        GenerateTicketsResponse response = ticketService.generateTicketChoices(roomCode, playerId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{roomCode}/players/{playerId}/ticket")
    public ResponseEntity<SelectTicketResponse> selectTicket(
            @PathVariable String roomCode,
            @PathVariable Long playerId,
            @Valid @RequestBody SelectTicketRequest request) {
        SelectTicketResponse response = ticketService.selectTicket(roomCode, playerId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
