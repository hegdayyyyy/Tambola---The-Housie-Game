package com.tambola.housie.repository;

import com.tambola.housie.entity.Game;
import com.tambola.housie.entity.enums.GameStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GameRepository extends JpaRepository<Game, Long> {
    
    List<Game> findByStatus(GameStatus status);
    
    @Query("SELECT g FROM Game g LEFT JOIN FETCH g.calledNumbers WHERE g.id = :gameId")
    Optional<Game> findByIdWithCalledNumbers(@Param("gameId") Long gameId);
    
    @Query("SELECT DISTINCT g FROM Game g LEFT JOIN FETCH g.room LEFT JOIN FETCH g.calledNumbers WHERE g.status = :status")
    List<Game> findByStatusWithRoom(@Param("status") GameStatus status);
}
