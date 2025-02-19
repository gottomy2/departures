package com.gottomy2.departures.repository;

import com.gottomy2.departures.model.Gate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GateRepository extends JpaRepository<Gate, Long> {

    Page<Gate> findAll(Pageable pageable);

    Optional<Gate> findByGateNumber(String gateNumber);
}

