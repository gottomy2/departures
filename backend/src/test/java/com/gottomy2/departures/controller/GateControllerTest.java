package com.gottomy2.departures.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gottomy2.departures.model.Gate;
import com.gottomy2.departures.model.User;
import com.gottomy2.departures.repository.UserRepository;
import com.gottomy2.departures.security.JwtUtil;
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
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
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

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private GateService gateService;

    @MockBean
    private UserRepository userRepository;

    private Gate testGate;

    private User user;

    private String token;

    @BeforeEach
    void setUp() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        testGate = Gate.builder()
                .id(1L)
                .gateNumber("B3")
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
    void shouldGetAllGates() throws Exception {
        Page<Gate> page = new PageImpl<>(List.of(testGate), PageRequest.of(0, 10), 1);
        when(gateService.getAllGates(any(Pageable.class))).thenReturn(page);

        mockMvc.perform(get("/api/gates")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$._embedded.gateList", hasSize(1)))
                .andExpect(jsonPath("$._embedded.gateList[0].gateNumber").value("B3"));
    }

    @Test
    void shouldGetGateById() throws Exception {
        when(gateService.getGateById(1L)).thenReturn(testGate);

        mockMvc.perform(get("/api/gates/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.gateNumber").value("B3"));
    }

    @Test
    void shouldGetGateByNumber() throws Exception {
        when(gateService.getGateByNumber("B3")).thenReturn(Optional.of(testGate));

        mockMvc.perform(get("/api/gates/search")
                        .param("gateNumber", "B3")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.gateNumber").value("B3"));
    }

    @Test
    void shouldCreateGate() throws Exception {
        when(gateService.saveGate(any(Gate.class))).thenReturn(testGate);

        mockMvc.perform(post("/api/gates")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", token)
                        .content(objectMapper.writeValueAsString(testGate)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.gateNumber").value("B3"));
    }

    @Test
    void shouldDeleteGate() throws Exception {
        doNothing().when(gateService).deleteGate(1L);

        mockMvc.perform(delete("/api/gates/1")
                        .header("Authorization", token))
                .andExpect(status().isNoContent());
    }
}
