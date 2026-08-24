package com.tambola.housie.controller;

import com.tambola.housie.dto.CallNumberResponse;
import com.tambola.housie.dto.StartGameResponse;
import com.tambola.housie.service.GameService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rooms")
public class GameController {

    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @PostMapping("/{roomCode}/start")
    public ResponseEntity<StartGameResponse> startGame(
            @PathVariable String roomCode,
            @RequestParam Long playerId) {
        StartGameResponse response = gameService.startGame(roomCode, playerId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/{roomCode}/call")
    public ResponseEntity<CallNumberResponse> callNumber(
            @PathVariable String roomCode,
            @RequestParam Long playerId) {
        CallNumberResponse response = gameService.callNumber(roomCode, playerId);
        return ResponseEntity.ok(response);
    }
}
