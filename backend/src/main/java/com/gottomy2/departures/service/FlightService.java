package com.gottomy2.departures.service;

import com.gottomy2.departures.model.Flight;
import com.gottomy2.departures.model.FlightStatus;
import com.gottomy2.departures.model.FlightZone;
import com.gottomy2.departures.model.Gate;
import com.gottomy2.departures.repository.FlightRepository;
import com.gottomy2.departures.repository.GateRepository;
import com.gottomy2.specification.FlightSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class FlightService {

    private final FlightRepository flightRepository;
    private final GateRepository gateRepository;
    private final WeatherService weatherService;

    public Page<Flight> getAllFlights(Pageable pageable) {
        return flightRepository.findAll(pageable);
    }

    public Flight getFlightById(Long id) {
        return flightRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Flight not found with id: " + id));
    }

    private final Map<String, Double> weatherCache = new HashMap<>();

    public Page<Flight> getFlightsFiltered(String flightNumber, FlightStatus status, FlightZone zone, Pageable pageable) {
        Specification<Flight> spec = FlightSpecification.filterFlights(flightNumber, status, zone);
        Page<Flight> flights = flightRepository.findAll(spec, pageable);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        flights.forEach(flight -> {
            String city = flight.getDestination();
            String departureDate = flight.getDepartureTime().toLocalDate().format(formatter);

            String cacheKey = city + "-" + departureDate;

            if (weatherCache.containsKey(cacheKey)) {
                flight.setTemperature(weatherCache.get(cacheKey));
            } else {
                Double temperature = weatherService.getTemperature(city, departureDate);
                if (temperature != null) {
                    weatherCache.put(cacheKey, temperature);
                    flight.setTemperature(temperature);
                }
            }
        });

        return flights;
    }

    public Flight saveFlight(Flight flight) {
        // Obsługa gate'ów podczas tworzenia nowego lotu
        if (flight.getGate() != null && flight.getGate().getGateNumber() != null) {
            flight.setGate(getOrCreateGate(flight.getGate().getGateNumber()));
        }
        return flightRepository.save(flight);
    }

    public Flight updateFlight(Long id, Flight updatedFlight) {
        Flight existingFlight = getFlightById(id);

        existingFlight.setFlightNumber(updatedFlight.getFlightNumber());
        existingFlight.setDestination(updatedFlight.getDestination());
        existingFlight.setStatus(updatedFlight.getStatus());
        existingFlight.setDepartureTime(updatedFlight.getDepartureTime());
        existingFlight.setZone(updatedFlight.getZone());
        existingFlight.setTemperature(updatedFlight.getTemperature());

        // Obsługa gate'ów w aktualizacji
        if (updatedFlight.getGate() != null && updatedFlight.getGate().getGateNumber() != null) {
            existingFlight.setGate(getOrCreateGate(updatedFlight.getGate().getGateNumber()));
        } else {
            existingFlight.setGate(null);
        }

        return flightRepository.save(existingFlight);
    }

    private Gate getOrCreateGate(String gateNumber) {
        return gateRepository.findByGateNumber(gateNumber)
                .orElseGet(() -> gateRepository.save(new Gate(gateNumber)));
    }

    public void deleteFlight(Long id) {
        if (!flightRepository.existsById(id)) {
            throw new RuntimeException("Flight not found with id: " + id);
        }
        flightRepository.deleteById(id);
    }
}
