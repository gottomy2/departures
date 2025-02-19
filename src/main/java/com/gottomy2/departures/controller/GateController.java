package com.gottomy2.departures.controller;

import com.gottomy2.departures.model.Gate;
import com.gottomy2.departures.service.GateService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/gates")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Pozwala na dostęp do API z frontendu
public class GateController {

    private final GateService gateService;

    @GetMapping
    public ResponseEntity<PagedModel<EntityModel<Gate>>> getAllGates(
            Pageable pageable,
            PagedResourcesAssembler<Gate> pagedAssembler) {

        Page<Gate> gates = gateService.getAllGates(pageable);
        PagedModel<EntityModel<Gate>> model = pagedAssembler.toModel(gates, gate -> EntityModel.of(gate));

        return ResponseEntity.ok(model);
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

