package com.tambola.housie.repository;

import com.tambola.housie.entity.CalledNumber;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CalledNumberRepository extends JpaRepository<CalledNumber, Long> {
}
