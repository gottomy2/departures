package com.gottomy2.departures.security;

import com.gottomy2.departures.service.JpaUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final JpaUserDetailsService userDetailsService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> loginData) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginData.get("username"), loginData.get("password"))
            );

            UserDetails user = userDetailsService.loadUserByUsername(loginData.get("username"));
            String token = jwtUtil.generateToken(user);

            return ResponseEntity.ok(Map.of("token", token));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", "Niepoprawne dane uwierzytelniające", "details", e.getMessage()));
        }
    }
}
