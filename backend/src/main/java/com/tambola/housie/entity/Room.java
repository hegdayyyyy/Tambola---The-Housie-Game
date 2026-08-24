package com.tambola.housie.entity;

import com.tambola.housie.entity.enums.CallerMode;
import com.tambola.housie.entity.enums.RoomStatus;
import com.tambola.housie.entity.enums.WinningMethod;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "rooms")
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 10)
    private String roomCode;

    @Column(nullable = false)
    private Integer maxPlayers;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WinningMethod winningMethod;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CallerMode callerMode;

    @Column(nullable = false)
    private Integer callingSpeed;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RoomStatus status = RoomStatus.WAITING;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Player> players = new ArrayList<>();

    @OneToOne(mappedBy = "room", cascade = CascadeType.ALL, orphanRemoval = true)
    private Game game;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public RoomStatus getStatus() {
        return status;
    }

    public void setStatus(RoomStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<Player> getPlayers() {
        return players;
    }

    public void setPlayers(List<Player> players) {
        this.players = players;
    }

    public Game getGame() {
        return game;
    }

    public void setGame(Game game) {
        this.game = game;
    }
}
