package com.example.realestate.controller;

import com.example.realestate.entity.Property;
import com.example.realestate.entity.User;
import com.example.realestate.service.FavoriteService;
import com.example.realestate.service.PropertyService;
import com.example.realestate.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
@CrossOrigin(origins = "http://localhost:5173")
public class FavoriteController {
    
    private final FavoriteService favoriteService;
    private final UserService userService;
    private final PropertyService propertyService;
    
    public FavoriteController(FavoriteService favoriteService, UserService userService, PropertyService propertyService) {
        this.favoriteService = favoriteService;
        this.userService = userService;
        this.propertyService = propertyService;
    }
    
    private Long getUserIdFromToken(String token) {
        if (token == null || !token.startsWith("Bearer demo-token-")) {
            throw new RuntimeException("Unauthorized");
        }
        return Long.parseLong(token.replace("Bearer demo-token-", ""));
    }
    
    @GetMapping
    public ResponseEntity<List<Long>> getFavoriteIds(@RequestHeader("Authorization") String token) {
        try {
            Long userId = getUserIdFromToken(token);
            List<Long> favoriteIds = favoriteService.getFavoritePropertyIds(userId);
            return ResponseEntity.ok(favoriteIds);
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }
    
    @GetMapping("/properties")
    public ResponseEntity<List<Property>> getFavoriteProperties(@RequestHeader("Authorization") String token) {
        try {
            Long userId = getUserIdFromToken(token);
            List<Property> properties = favoriteService.getFavoriteProperties(userId);
            return ResponseEntity.ok(properties);
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }
    
    @PostMapping("/{propertyId}")
    public ResponseEntity<?> addFavorite(
            @RequestHeader("Authorization") String token,
            @PathVariable Long propertyId) {
        try {
            Long userId = getUserIdFromToken(token);
            User user = userService.findById(userId).orElseThrow();
            Property property = propertyService.getById(propertyId).orElseThrow();
            
            favoriteService.addFavorite(user, property);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Added to favorites");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            if (e.getMessage().equals("Property already in favorites")) {
                Map<String, String> error = new HashMap<>();
                error.put("error", e.getMessage());
                return ResponseEntity.badRequest().body(error);
            }
            Map<String, String> error = new HashMap<>();
            error.put("error", "Unauthorized");
            return ResponseEntity.status(401).body(error);
        }
    }
    
    @DeleteMapping("/{propertyId}")
    public ResponseEntity<?> removeFavorite(
            @RequestHeader("Authorization") String token,
            @PathVariable Long propertyId) {
        try {
            Long userId = getUserIdFromToken(token);
            favoriteService.removeFavorite(userId, propertyId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Removed from favorites");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Unauthorized");
            return ResponseEntity.status(401).body(error);
        }
    }
    
    @GetMapping("/check/{propertyId}")
    public ResponseEntity<Map<String, Boolean>> checkFavorite(
            @RequestHeader("Authorization") String token,
            @PathVariable Long propertyId) {
        try {
            Long userId = getUserIdFromToken(token);
            boolean isFavorite = favoriteService.isFavorite(userId, propertyId);
            Map<String, Boolean> response = new HashMap<>();
            response.put("isFavorite", isFavorite);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }
}
