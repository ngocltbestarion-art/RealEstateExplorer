package com.example.realestate.service;

import com.example.realestate.entity.Property;
import com.example.realestate.repository.PropertyRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    private final PropertyRepository propertyRepository;

    public RecommendationService(PropertyRepository propertyRepository) {
        this.propertyRepository = propertyRepository;
    }

    public List<Property> findSimilarProperties(Long propertyId, int limit) {
        Optional<Property> targetPropertyOpt = propertyRepository.findById(propertyId);
        if (targetPropertyOpt.isEmpty()) {
            return new ArrayList<>();
        }

        Property targetProperty = targetPropertyOpt.get();
        List<Property> allProperties = propertyRepository.findAll();

        // Remove the target property itself
        allProperties = allProperties.stream()
            .filter(p -> !p.getId().equals(propertyId))
            .collect(Collectors.toList());

        // Calculate similarity score for each property
        List<PropertyScore> scoredProperties = allProperties.stream()
            .map(p -> new PropertyScore(p, calculateSimilarityScore(targetProperty, p)))
            .sorted(Comparator.comparing(PropertyScore::getScore).reversed())
            .limit(limit)
            .collect(Collectors.toList());

        return scoredProperties.stream()
            .map(PropertyScore::getProperty)
            .collect(Collectors.toList());
    }

    private double calculateSimilarityScore(Property target, Property candidate) {
        double score = 0.0;

        // 1. Property Type Match (30 points)
        if (target.getPropertyType() != null && candidate.getPropertyType() != null) {
            if (target.getPropertyType().getId().equals(candidate.getPropertyType().getId())) {
                score += 30.0;
            }
        }

        // 2. Price Similarity (25 points)
        if (target.getPrice() != null && candidate.getPrice() != null) {
            double priceDiff = Math.abs(target.getPrice() - candidate.getPrice());
            double priceRatio = priceDiff / target.getPrice();
            if (priceRatio <= 0.2) { // Within 20%
                score += 25.0;
            } else if (priceRatio <= 0.4) { // Within 40%
                score += 15.0;
            } else if (priceRatio <= 0.6) { // Within 60%
                score += 5.0;
            }
        }

        // 3. Area Similarity (20 points)
        if (target.getAreaSqft() != null && candidate.getAreaSqft() != null) {
            double areaDiff = Math.abs(target.getAreaSqft() - candidate.getAreaSqft());
            double areaRatio = areaDiff / target.getAreaSqft();
            if (areaRatio <= 0.2) { // Within 20%
                score += 20.0;
            } else if (areaRatio <= 0.4) { // Within 40%
                score += 10.0;
            } else if (areaRatio <= 0.6) { // Within 60%
                score += 5.0;
            }
        }

        // 4. Bedrooms Match (10 points)
        if (target.getBedrooms() != null && candidate.getBedrooms() != null) {
            if (target.getBedrooms().equals(candidate.getBedrooms())) {
                score += 10.0;
            } else if (Math.abs(target.getBedrooms() - candidate.getBedrooms()) == 1) {
                score += 5.0;
            }
        }

        // 5. Bathrooms Match (10 points)
        if (target.getBathrooms() != null && candidate.getBathrooms() != null) {
            if (target.getBathrooms().equals(candidate.getBathrooms())) {
                score += 10.0;
            } else if (Math.abs(target.getBathrooms() - candidate.getBathrooms()) == 1) {
                score += 5.0;
            }
        }

        // 6. Status Match (5 points)
        if (target.getStatus() != null && candidate.getStatus() != null) {
            if (target.getStatus().equals(candidate.getStatus())) {
                score += 5.0;
            }
        }

        return score;
    }

    private static class PropertyScore {
        private final Property property;
        private final double score;

        public PropertyScore(Property property, double score) {
            this.property = property;
            this.score = score;
        }

        public Property getProperty() {
            return property;
        }

        public double getScore() {
            return score;
        }
    }
}
