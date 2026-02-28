package com.example.realestate.controller;

import com.example.realestate.dto.*;
import com.example.realestate.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "http://localhost:5173")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/overview")
    public ResponseEntity<AnalyticsOverviewDTO> getOverview() {
        return ResponseEntity.ok(analyticsService.getOverview());
    }

    @GetMapping("/distribution-by-type")
    public ResponseEntity<List<PropertyTypeDistributionDTO>> getTypeDistribution() {
        return ResponseEntity.ok(analyticsService.getTypeDistribution());
    }

    @GetMapping("/price-trends")
    public ResponseEntity<List<PriceTrendDTO>> getPriceTrends() {
        return ResponseEntity.ok(analyticsService.getPriceTrends());
    }

    @GetMapping("/geographic-distribution")
    public ResponseEntity<List<GeographicDistributionDTO>> getGeographicDistribution() {
        return ResponseEntity.ok(analyticsService.getGeographicDistribution());
    }
}
