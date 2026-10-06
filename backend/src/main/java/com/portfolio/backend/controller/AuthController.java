package com.portfolio.backend.controller;

import com.portfolio.backend.dto.AuthRequest;
import com.portfolio.backend.dto.AuthResponse;
import com.portfolio.backend.dto.ChangePasswordRequest;
import com.portfolio.backend.model.User;
import com.portfolio.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        try {
            User user = authService.getCurrentUser();
            return ResponseEntity.ok(Map.of(
                    "id", user.getId(),
                    "username", user.getUsername(),
                    "role", user.getRole(),
                    "email", user.getEmail() != null ? user.getEmail() : ""
            ));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        try {
            authService.changePassword(request);
            return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
