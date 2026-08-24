package com.tambola.housie.repository;

import com.tambola.housie.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    
    Optional<Room> findByRoomCode(String roomCode);
    
    @Query("SELECT r FROM Room r LEFT JOIN FETCH r.players WHERE r.roomCode = :roomCode")
    Optional<Room> findByRoomCodeWithPlayers(@Param("roomCode") String roomCode);
    
    @Query("SELECT DISTINCT r FROM Room r LEFT JOIN FETCH r.players p LEFT JOIN FETCH p.ticket LEFT JOIN FETCH r.game WHERE r.roomCode = :roomCode")
    Optional<Room> findByRoomCodeWithPlayersAndGame(@Param("roomCode") String roomCode);
}
