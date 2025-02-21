package com.gottomy2.departures.service;

import com.gottomy2.departures.model.Flight;
import com.gottomy2.departures.model.FlightStatus;
import com.gottomy2.departures.model.FlightZone;
import com.gottomy2.departures.repository.FlightRepository;
import com.gottomy2.specification.FlightSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class FlightService {

    private final FlightRepository flightRepository;

    public Page<Flight> getAllFlights(Pageable pageable) {
        return flightRepository.findAll(pageable);
    }

    public Flight getFlightById(Long id) {
        return flightRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Flight not found with id: " + id));
    }

    public Page<Flight> getFlightsFiltered(String flightNumber, FlightStatus status, FlightZone zone, Pageable pageable) {
        Specification<Flight> spec = FlightSpecification.filterFlights(flightNumber, status, zone);
        return flightRepository.findAll(spec, pageable);
    }

    public Flight saveFlight(Flight flight) {
        return flightRepository.save(flight);
    }

    public Flight updateFlight(Long id, Flight updatedFlight) {
        Flight existingFlight = getFlightById(id);
        existingFlight.setFlightNumber(updatedFlight.getFlightNumber());
        existingFlight.setDestination(updatedFlight.getDestination());
        existingFlight.setStatus(updatedFlight.getStatus());
        existingFlight.setDepartureTime(updatedFlight.getDepartureTime());
        existingFlight.setZone(updatedFlight.getZone());
        existingFlight.setGate(updatedFlight.getGate());
        existingFlight.setTemperature(updatedFlight.getTemperature());
        return flightRepository.save(existingFlight);
    }

    public void deleteFlight(Long id) {
        if (!flightRepository.existsById(id)) {
            throw new RuntimeException("Flight not found with id: " + id);
        }
        flightRepository.deleteById(id);
    }
}
