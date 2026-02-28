package com.example.realestate.controller;

import com.example.realestate.entity.Property;
import com.example.realestate.service.RecommendationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.io.StringWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = "http://localhost:5173")
public class RecommendationController {

    private final RecommendationService recommendationService;
    private final ObjectMapper objectMapper;

    public RecommendationController(RecommendationService recommendationService, ObjectMapper objectMapper) {
        this.recommendationService = recommendationService;
        this.objectMapper = objectMapper;
    }

    @GetMapping(value = "/similar/{propertyId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> getSimilarProperties(@PathVariable Long propertyId) {
        List<Property> properties = recommendationService.findSimilarProperties(propertyId, 6);
        Map<String, Object> fc = new HashMap<>();
        fc.put("type", "FeatureCollection");
        fc.put("features", properties.stream().map(this::toFeature).toList());
        return fc;
    }

    private Map<String, Object> toFeature(Property p) {
        Map<String, Object> feature = new HashMap<>();
        feature.put("type", "Feature");

        Map<String, Object> props = new HashMap<>();
        props.put("id", p.getId());
        props.put("name", p.getName());
        props.put("price", p.getPrice());
        props.put("area_sqft", p.getAreaSqft());
        props.put("address", p.getAddress());
        props.put("description", p.getDescription());
        props.put("status", p.getStatus());
        props.put("bedrooms", p.getBedrooms());
        props.put("bathrooms", p.getBathrooms());
        props.put("floors", p.getFloors());
        props.put("year_built", p.getYearBuilt());
        props.put("direction", p.getDirection());
        props.put("legal_status", p.getLegalStatus());
        props.put("views", p.getViews());
        props.put("featured", p.getFeatured());
        
        if (p.getPropertyType() != null) {
            props.put("property_type", p.getPropertyType().getName());
            props.put("property_type_id", p.getPropertyType().getId());
        }
        
        if (p.getImages() != null && !p.getImages().isEmpty()) {
            props.put("images", p.getImages().stream()
                .map(img -> img.getImageUrl())
                .toList());
            props.put("primary_image", p.getImages().stream()
                .filter(img -> img.getIsPrimary())
                .findFirst()
                .map(img -> img.getImageUrl())
                .orElse(p.getImages().get(0).getImageUrl()));
        }
        
        feature.put("properties", props);

        if (p.getGeom() != null) {
            org.geotools.geojson.geom.GeometryJSON gjson = new org.geotools.geojson.geom.GeometryJSON();
            try (StringWriter writer = new StringWriter()) {
                gjson.write(p.getGeom(), writer);
                feature.put("geometry", objectMapper.readTree(writer.toString()));
            } catch (Exception e) {
                feature.put("geometry", null);
            }
        }

        return feature;
    }
}
