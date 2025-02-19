package com.gottomy2.departures.repository;

import com.gottomy2.departures.model.Flight;
import com.gottomy2.departures.model.FlightStatus;
import com.gottomy2.departures.model.FlightZone;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FlightRepository extends JpaRepository<Flight, Long> {

    Page<Flight> findByStatus(FlightStatus status, Pageable pageable);

    Page<Flight> findByZone(FlightZone zone, Pageable pageable);

    Page<Flight> findByStatusAndZone(FlightStatus status, FlightZone zone, Pageable pageable);
}
