package com.tambola.housie.service;

import com.tambola.housie.dto.GenerateTicketsResponse;
import com.tambola.housie.dto.SelectTicketRequest;
import com.tambola.housie.dto.SelectTicketResponse;
import com.tambola.housie.entity.Player;
import com.tambola.housie.entity.Room;
import com.tambola.housie.entity.Ticket;
import com.tambola.housie.entity.enums.RoomStatus;
import com.tambola.housie.repository.PlayerRepository;
import com.tambola.housie.repository.RoomRepository;
import com.tambola.housie.repository.TicketRepository;
import com.tambola.housie.util.TicketGenerator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class TicketService {

    private final RoomRepository roomRepository;
    private final PlayerRepository playerRepository;
    private final TicketRepository ticketRepository;
    private final TicketGenerator ticketGenerator;

    public TicketService(RoomRepository roomRepository, 
                        PlayerRepository playerRepository,
                        TicketRepository ticketRepository,
                        TicketGenerator ticketGenerator) {
        this.roomRepository = roomRepository;
        this.playerRepository = playerRepository;
        this.ticketRepository = ticketRepository;
        this.ticketGenerator = ticketGenerator;
    }

    @Transactional(readOnly = true)
    public GenerateTicketsResponse generateTicketChoices(String roomCode, Long playerId) {
        // Find the room with players eagerly fetched
        Room room = roomRepository.findByRoomCodeWithPlayers(roomCode)
                .orElseThrow(() -> new IllegalArgumentException("Room not found with code: " + roomCode));

        // Find the player
        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new IllegalArgumentException("Player not found with id: " + playerId));

        // Verify player belongs to the room
        if (!player.getRoom().getId().equals(room.getId())) {
            throw new IllegalStateException("Player does not belong to this room");
        }

        // Verify room is in WAITING state
        if (room.getStatus() != RoomStatus.WAITING) {
            throw new IllegalStateException("Tickets can only be generated when room is in WAITING state");
        }

        // Generate 3 tickets
        List<int[][]> tickets = new ArrayList<>();
        for (int i = 0; i < 3; i++) {
            tickets.add(ticketGenerator.generateTicket());
        }

        return new GenerateTicketsResponse(tickets);
    }

    @Transactional
    public SelectTicketResponse selectTicket(String roomCode, Long playerId, SelectTicketRequest request) {
        // Find the room with players eagerly fetched
        Room room = roomRepository.findByRoomCodeWithPlayers(roomCode)
                .orElseThrow(() -> new IllegalArgumentException("Room not found with code: " + roomCode));

        // Find the player
        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new IllegalArgumentException("Player not found with id: " + playerId));

        // Verify player belongs to the room
        if (!player.getRoom().getId().equals(room.getId())) {
            throw new IllegalStateException("Player does not belong to this room");
        }

        // Verify room is in WAITING state
        if (room.getStatus() != RoomStatus.WAITING) {
            throw new IllegalStateException("Tickets can only be selected when room is in WAITING state");
        }

        // Check if player already has a ticket
        if (player.getTicket() != null) {
            throw new IllegalStateException("Player already has a ticket");
        }

        // Create and save the ticket
        Ticket ticket = new Ticket();
        ticket.setTicketData(request.getTicketData());
        ticket.setPlayer(player);

        ticket = ticketRepository.save(ticket);

        return new SelectTicketResponse(
            ticket.getId(),
            player.getId(),
            ticket.getTicketData()
        );
    }
}
