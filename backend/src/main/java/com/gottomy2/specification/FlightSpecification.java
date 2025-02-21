package com.gottomy2.specification;

import com.gottomy2.departures.model.Flight;
import com.gottomy2.departures.model.FlightStatus;
import com.gottomy2.departures.model.FlightZone;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

public class FlightSpecification {
    public static Specification<Flight> filterFlights(String flightNumber, FlightStatus status, FlightZone zone) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (flightNumber != null && !flightNumber.isEmpty()) {
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("flightNumber")), "%" + flightNumber.toLowerCase() + "%"));
            }
            if (status != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), status));
            }
            if (zone != null) {
                predicates.add(criteriaBuilder.equal(root.get("zone"), zone));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}