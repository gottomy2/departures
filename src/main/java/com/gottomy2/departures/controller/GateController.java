package com.gottomy2.departures.controller;

import com.gottomy2.departures.model.Gate;
import com.gottomy2.departures.service.GateService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/gates")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Pozwala na dostęp do API z frontendu
public class GateController {

    private final GateService gateService;

    @GetMapping
    public ResponseEntity<Page<Gate>> getAllGates(Pageable pageable) {
        return ResponseEntity.ok(gateService.getAllGates(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Gate> getGateById(@PathVariable Long id) {
        return ResponseEntity.ok(gateService.getGateById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<Gate> getGateByNumber(@RequestParam String gateNumber) {
        return gateService.getGateByNumber(gateNumber)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Gate> createGate(@RequestBody Gate gate) {
        return ResponseEntity.ok(gateService.saveGate(gate));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGate(@PathVariable Long id) {
        gateService.deleteGate(id);
        return ResponseEntity.noContent().build();
    }
}

