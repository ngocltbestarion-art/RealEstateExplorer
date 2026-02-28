package com.example.realestate.controller;

import com.example.realestate.dto.AuthResponse;
import com.example.realestate.dto.LoginRequest;
import com.example.realestate.entity.User;
import com.example.realestate.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    
    private final UserService userService;
    
    public AuthController(UserService userService) {
        this.userService = userService;
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        return userService.findByUsername(request.getUsername())
            .map(user -> {
                // Simple password check (in production, use BCrypt)
                // For demo, we accept any password
                String token = "demo-token-" + user.getId();
                AuthResponse response = new AuthResponse(
                    token, 
                    user.getUsername(), 
                    user.getEmail(), 
                    user.getRole()
                );
                return ResponseEntity.ok((Object) response);
            })
            .orElseGet(() -> {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Invalid credentials");
                return ResponseEntity.status(401).body(error);
            });
    }
    
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader(value = "Authorization", required = false) String token) {
        if (token == null || !token.startsWith("Bearer demo-token-")) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Unauthorized");
            return ResponseEntity.status(401).body(error);
        }
        
        try {
            Long userId = Long.parseLong(token.replace("Bearer demo-token-", ""));
            return userService.findById(userId)
                .map(user -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("id", user.getId());
                    response.put("username", user.getUsername());
                    response.put("email", user.getEmail());
                    response.put("fullName", user.getFullName());
                    response.put("role", user.getRole());
                    return ResponseEntity.ok((Object) response);
                })
                .orElseGet(() -> {
                    Map<String, String> error = new HashMap<>();
                    error.put("error", "User not found");
                    return ResponseEntity.status(404).body(error);
                });
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid token");
            return ResponseEntity.status(401).body(error);
        }
    }
}
