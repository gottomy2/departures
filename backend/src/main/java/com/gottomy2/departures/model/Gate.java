package com.gottomy2.departures.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "gates")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Gate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "gate_number", nullable = false, unique = true)
    private String gateNumber;

    public Gate(String gateNumber) {
        this.gateNumber = gateNumber;
    }
}

