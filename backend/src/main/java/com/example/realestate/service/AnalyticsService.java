package com.example.realestate.service;

import com.example.realestate.dto.*;
import com.example.realestate.entity.Property;
import com.example.realestate.repository.PropertyRepository;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final PropertyRepository propertyRepository;

    public AnalyticsService(PropertyRepository propertyRepository) {
        this.propertyRepository = propertyRepository;
    }

    public AnalyticsOverviewDTO getOverview() {
        List<Property> allProperties = propertyRepository.findAll();
        
        if (allProperties.isEmpty()) {
            return new AnalyticsOverviewDTO(0L, 0.0, 0.0, 0.0, 0L, 0L, 0L);
        }

        long total = allProperties.size();
        double avgPrice = allProperties.stream()
            .mapToDouble(Property::getPrice)
            .average()
            .orElse(0.0);
        double maxPrice = allProperties.stream()
            .mapToDouble(Property::getPrice)
            .max()
            .orElse(0.0);
        double minPrice = allProperties.stream()
            .mapToDouble(Property::getPrice)
            .min()
            .orElse(0.0);

        long available = allProperties.stream()
            .filter(p -> "AVAILABLE".equalsIgnoreCase(p.getStatus()))
            .count();
        long sold = allProperties.stream()
            .filter(p -> "SOLD".equalsIgnoreCase(p.getStatus()))
            .count();
        long pending = allProperties.stream()
            .filter(p -> "PENDING".equalsIgnoreCase(p.getStatus()))
            .count();

        return new AnalyticsOverviewDTO(total, avgPrice, maxPrice, minPrice, available, sold, pending);
    }

    public List<PropertyTypeDistributionDTO> getTypeDistribution() {
        List<Property> allProperties = propertyRepository.findAll();
        long total = allProperties.size();

        Map<String, Long> typeCount = allProperties.stream()
            .filter(p -> p.getPropertyType() != null)
            .collect(Collectors.groupingBy(
                p -> p.getPropertyType().getName(),
                Collectors.counting()
            ));

        return typeCount.entrySet().stream()
            .map(entry -> {
                PropertyTypeDistributionDTO dto = new PropertyTypeDistributionDTO(entry.getKey(), entry.getValue());
                dto.setPercentage(total > 0 ? (entry.getValue() * 100.0 / total) : 0.0);
                return dto;
            })
            .sorted(Comparator.comparing(PropertyTypeDistributionDTO::getCount).reversed())
            .collect(Collectors.toList());
    }

    public List<PriceTrendDTO> getPriceTrends() {
        List<Property> allProperties = propertyRepository.findAll();
        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");
        
        Map<String, List<Property>> byMonth = allProperties.stream()
            .collect(Collectors.groupingBy(
                p -> p.getCreatedAt().format(formatter)
            ));

        return byMonth.entrySet().stream()
            .map(entry -> {
                double avgPrice = entry.getValue().stream()
                    .mapToDouble(Property::getPrice)
                    .average()
                    .orElse(0.0);
                return new PriceTrendDTO(entry.getKey(), avgPrice, (long) entry.getValue().size());
            })
            .sorted(Comparator.comparing(PriceTrendDTO::getPeriod))
            .collect(Collectors.toList());
    }

    public List<GeographicDistributionDTO> getGeographicDistribution() {
        List<Property> allProperties = propertyRepository.findAll();

        Map<String, List<Property>> byRegion = allProperties.stream()
            .collect(Collectors.groupingBy(p -> {
                String address = p.getAddress();
                if (address.contains("Manhattan")) return "Manhattan";
                if (address.contains("Brooklyn")) return "Brooklyn";
                if (address.contains("Queens")) return "Queens";
                if (address.contains("Bronx")) return "Bronx";
                if (address.contains("Staten Island")) return "Staten Island";
                return "Other";
            }));

        return byRegion.entrySet().stream()
            .map(entry -> {
                long count = entry.getValue().size();
                double avgPrice = entry.getValue().stream()
                    .mapToDouble(Property::getPrice)
                    .average()
                    .orElse(0.0);
                return new GeographicDistributionDTO(entry.getKey(), count, avgPrice);
            })
            .sorted(Comparator.comparing(GeographicDistributionDTO::getCount).reversed())
            .collect(Collectors.toList());
    }
}
