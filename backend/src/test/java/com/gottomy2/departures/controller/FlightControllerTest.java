package com.gottomy2.departures.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gottomy2.departures.model.*;
import com.gottomy2.departures.repository.UserRepository;
import com.gottomy2.departures.security.JwtUtil;
import com.gottomy2.departures.service.FlightService;
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
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class FlightControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private FlightService flightService;

    @MockBean
    private UserRepository userRepository;

    private Flight testFlight;

    private User user;

    private Gate gate;

    private String token;

    @BeforeEach
    void setUp() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        testFlight = Flight.builder()
                .flightNumber("LO123")
                .destination("Warszawa")
                .status(FlightStatus.PLANOWANY)
                .departureTime(LocalDateTime.now().plusHours(2))
                .zone(FlightZone.SCHENGEN)
                .temperature(15.5)
                .gate(new Gate(500L, "G1238"))
                .build();

        user = User.builder()
                .username("test")
                .password(encoder.encode("test"))
                .build();

        // Mocking repository to return user:
        when(userRepository.findByUsername("test")).thenReturn(Optional.of(user));

        token = "Bearer " + jwtUtil.generateToken(
                new org.springframework.security.core.userdetails.User(
                        user.getUsername(),
                        user.getPassword(),
                        List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
                )
        );
    }

    @Test
    void shouldGetAllFlights() throws Exception {
        Flight testFlight = new Flight();
        testFlight.setFlightNumber("LO123");

        Page<Flight> page = new PageImpl<>(List.of(testFlight), PageRequest.of(0, 10), 1);

        when(flightService.getFlightsFiltered(any(), any(), any(), any())).thenReturn(page);

        mockMvc.perform(get("/api/flights")
                        .param("page", "0")
                        .param("size", "10")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$._embedded.flightList", hasSize(1)))
                .andExpect(jsonPath("$._embedded.flightList[0].flightNumber").value("LO123"));
    }

    @Test
    void shouldGetFlightById() throws Exception {
        when(flightService.getFlightById(1L)).thenReturn(testFlight);

        mockMvc.perform(get("/api/flights/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.flightNumber").value("LO123"));
    }

    @Test
    void shouldCreateFlight() throws Exception {
        when(flightService.saveFlight(any(Flight.class))).thenReturn(testFlight);

        mockMvc.perform(post("/api/flights")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testFlight))
                        .header("Authorization", token))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.flightNumber").value("LO123"));
    }

    @Test
    void shouldUpdateFlight() throws Exception {
        when(flightService.updateFlight(eq(1L), any(Flight.class))).thenReturn(testFlight);

        mockMvc.perform(put("/api/flights/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testFlight))
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.flightNumber").value("LO123"));
    }

    @Test
    void shouldDeleteFlight() throws Exception {
        doNothing().when(flightService).deleteFlight(1L);

        mockMvc.perform(delete("/api/flights/1")
                        .header("Authorization", token))
                .andExpect(status().isNoContent());
    }
}