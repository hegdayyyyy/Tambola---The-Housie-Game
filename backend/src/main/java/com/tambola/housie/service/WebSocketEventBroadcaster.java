package com.tambola.housie.service;

import com.tambola.housie.dto.websocket.GameEvent;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class WebSocketEventBroadcaster {

    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketEventBroadcaster(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * Broadcasts a game event to all clients subscribed to a specific room.
     * Clients should subscribe to: /topic/rooms/{roomCode}
     * 
     * @param roomCode the room code to broadcast to
     * @param event the event to broadcast
     */
    public void broadcastToRoom(String roomCode, GameEvent event) {
        String destination = "/topic/rooms/" + roomCode;
        messagingTemplate.convertAndSend(destination, event);
    }
}
