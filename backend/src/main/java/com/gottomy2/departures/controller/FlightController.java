package com.gottomy2.departures.controller;
import com.gottomy2.departures.model.Flight;
import com.gottomy2.departures.model.FlightStatus;
import com.gottomy2.departures.model.FlightZone;
import com.gottomy2.departures.service.FlightService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/flights")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FlightController {

    private final FlightService flightService;

    @GetMapping
    public ResponseEntity<PagedModel<EntityModel<Flight>>> getFlights(
            @RequestParam(required = false) String flightNumber,
            @RequestParam(required = false) FlightStatus status,
            @RequestParam(required = false) FlightZone zone,
            Pageable pageable,
            PagedResourcesAssembler<Flight> pagedAssembler) {

        Page<Flight> flights = flightService.getFlightsFiltered(flightNumber, status, zone, pageable);

        PagedModel<EntityModel<Flight>> model = pagedAssembler.toModel(flights, flight -> EntityModel.of(flight));
        return ResponseEntity.ok(model);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Flight> getFlightById(@PathVariable Long id) {
        return ResponseEntity.ok(flightService.getFlightById(id));
    }

    @PostMapping
    public ResponseEntity<Flight> createFlight(@RequestBody Flight flight) {
        return ResponseEntity.ok(flightService.saveFlight(flight));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Flight> updateFlight(@PathVariable Long id, @RequestBody Flight updatedFlight) {
        return ResponseEntity.ok(flightService.updateFlight(id, updatedFlight));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFlight(@PathVariable Long id) {
        flightService.deleteFlight(id);
        return ResponseEntity.noContent().build();
    }
}

