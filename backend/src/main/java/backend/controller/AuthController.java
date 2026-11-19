package backend.controller;

import backend.dto.*;
import backend.entity.User;
import backend.repository.UserRepository;
import backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@Valid @RequestBody RegisterRequest req) {
        authService.register(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Account created successfully"));
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest req) {
        return authService.login(req);
    }

    @PostMapping("/logout")
    public Map<String, String> logout(@RequestHeader("Authorization") String header) {
        authService.logout(header.substring(7));
        return Map.of("message", "Logged out successfully");
    }

    @GetMapping("/me")
    public UserResponse me(Authentication auth) {
        User u = userRepository.findByEmail(auth.getName()).orElseThrow();
        return new UserResponse(u.getId(), u.getName(), u.getEmail(), u.getRole());
    }
}