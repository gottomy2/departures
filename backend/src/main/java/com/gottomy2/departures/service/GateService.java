package com.gottomy2.departures.service;

import com.gottomy2.departures.model.Gate;
import com.gottomy2.departures.repository.GateRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class GateService {

    private final GateRepository gateRepository;

    public Page<Gate> getAllGates(Pageable pageable) {
        return gateRepository.findAll(pageable);
    }

    public Gate getGateById(Long id) {
        return gateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Gate not found with id: " + id));
    }

    public Optional<Gate> getGateByNumber(String gateNumber) {
        return gateRepository.findByGateNumber(gateNumber);
    }

    public Gate saveGate(Gate gate) {
        return gateRepository.save(gate);
    }

    public Gate updateGate(Long id, Gate gate) {
        Gate existingGate = getGateById(id);
        existingGate.setGateNumber(gate.getGateNumber());
        return gateRepository.save(existingGate);
    }

    public void deleteGate(Long id) {
        if (!gateRepository.existsById(id)) {
            throw new RuntimeException("Gate not found with id: " + id);
        }
        gateRepository.deleteById(id);
    }
}
