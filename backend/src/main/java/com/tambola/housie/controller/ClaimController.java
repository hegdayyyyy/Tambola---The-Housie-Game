package com.tambola.housie.controller;

import com.tambola.housie.dto.ClaimResponse;
import com.tambola.housie.service.ClaimService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rooms")
public class ClaimController {

    private final ClaimService claimService;

    public ClaimController(ClaimService claimService) {
        this.claimService = claimService;
    }

    @PostMapping("/{roomCode}/players/{playerId}/claim")
    public ResponseEntity<ClaimResponse> processClaim(
            @PathVariable String roomCode,
            @PathVariable Long playerId) {
        
        ClaimResponse response = claimService.processClaim(roomCode, playerId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{roomCode}/resume-game")
    public ResponseEntity<Void> resumeGame(@PathVariable String roomCode) {
        claimService.resumeGame(roomCode);
        return ResponseEntity.ok().build();
    }
}
