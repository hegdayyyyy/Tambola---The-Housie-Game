package com.tambola.housie.controller;

import com.tambola.housie.dto.CreateRoomRequest;
import com.tambola.housie.dto.CreateRoomResponse;
import com.tambola.housie.dto.JoinRoomRequest;
import com.tambola.housie.dto.JoinRoomResponse;
import com.tambola.housie.dto.RoomDetailsResponse;
import com.tambola.housie.service.RoomService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @PostMapping
    public ResponseEntity<CreateRoomResponse> createRoom(@Valid @RequestBody CreateRoomRequest request) {
        CreateRoomResponse response = roomService.createRoom(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/{roomCode}/join")
    public ResponseEntity<JoinRoomResponse> joinRoom(
            @PathVariable String roomCode,
            @Valid @RequestBody JoinRoomRequest request) {
        JoinRoomResponse response = roomService.joinRoom(roomCode, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{roomCode}")
    public ResponseEntity<RoomDetailsResponse> getRoomDetails(@PathVariable String roomCode) {
        RoomDetailsResponse response = roomService.getRoomDetails(roomCode);
        return ResponseEntity.ok(response);
    }
}
