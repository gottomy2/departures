package com.gottomy2.departures.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gottomy2.departures.model.Gate;
import com.gottomy2.departures.service.GateService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class GateControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private GateService gateService;

    @Autowired
    private ObjectMapper objectMapper;

    private Gate testGate;

    @BeforeEach
    void setUp() {
        testGate = Gate.builder()
                .id(1L)
                .gateNumber("B3")
                .build();
    }

    @Test
    void shouldGetAllGates() throws Exception {
        Page<Gate> page = new PageImpl<>(List.of(testGate), PageRequest.of(0, 10), 1);
        when(gateService.getAllGates(any(Pageable.class))).thenReturn(page);

        mockMvc.perform(get("/api/gates")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$._embedded.gateList", hasSize(1)))
                .andExpect(jsonPath("$._embedded.gateList[0].gateNumber").value("B3"));
    }

    @Test
    void shouldGetGateById() throws Exception {
        when(gateService.getGateById(1L)).thenReturn(testGate);

        mockMvc.perform(get("/api/gates/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.gateNumber").value("B3"));
    }

    @Test
    void shouldGetGateByNumber() throws Exception {
        when(gateService.getGateByNumber("B3")).thenReturn(Optional.of(testGate));

        mockMvc.perform(get("/api/gates/search")
                        .param("gateNumber", "B3")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.gateNumber").value("B3"));
    }

    @Test
    void shouldCreateGate() throws Exception {
        when(gateService.saveGate(any(Gate.class))).thenReturn(testGate);

        mockMvc.perform(post("/api/gates")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testGate)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.gateNumber").value("B3"));
    }

    @Test
    void shouldDeleteGate() throws Exception {
        doNothing().when(gateService).deleteGate(1L);

        mockMvc.perform(delete("/api/gates/1"))
                .andExpect(status().isNoContent());
    }
}
