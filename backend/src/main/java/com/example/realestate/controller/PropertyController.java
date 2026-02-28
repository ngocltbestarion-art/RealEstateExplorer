package com.example.realestate.controller;

import com.example.realestate.dto.GeometryFilterRequest;
import com.example.realestate.dto.PropertyFilterRequest;
import com.example.realestate.entity.Property;
import com.example.realestate.entity.PropertyImage;
import com.example.realestate.service.PropertyService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.StringWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/properties")
@CrossOrigin(origins = "http://localhost:5173")
public class PropertyController {

    private final PropertyService propertyService;
    private final ObjectMapper objectMapper;

    public PropertyController(PropertyService propertyService, ObjectMapper objectMapper) {
        this.propertyService = propertyService;
        this.objectMapper = objectMapper;
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> getAllAsGeoJson() {
        List<Property> properties = propertyService.getAll();
        Map<String, Object> fc = new HashMap<>();
        fc.put("type", "FeatureCollection");
        fc.put("features", properties.stream().map(this::toFeature).toList());
        return fc;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Property> getById(@PathVariable Long id) {
        return propertyService.getById(id)
            .map(property -> {
                propertyService.incrementViews(id);
                return ResponseEntity.ok(property);
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/featured")
    public Map<String, Object> getFeatured() {
        List<Property> properties = propertyService.getFeaturedProperties();
        Map<String, Object> fc = new HashMap<>();
        fc.put("type", "FeatureCollection");
        fc.put("features", properties.stream().map(this::toFeature).toList());
        return fc;
    }

    @PostMapping("/filter")
    public ResponseEntity<Map<String, Object>> filterProperties(@RequestBody PropertyFilterRequest filter) {
        Page<Property> page = propertyService.filterProperties(filter);
        
        Map<String, Object> response = new HashMap<>();
        response.put("content", page.getContent().stream().map(this::toFeature).toList());
        response.put("totalElements", page.getTotalElements());
        response.put("totalPages", page.getTotalPages());
        response.put("currentPage", page.getNumber());
        response.put("size", page.getSize());
        
        return ResponseEntity.ok(response);
    }

    @PostMapping(value = "/within", consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> getWithin(@RequestBody GeometryFilterRequest request) throws IOException {
        List<Property> properties = propertyService.findWithin(request);
        Map<String, Object> fc = new HashMap<>();
        fc.put("type", "FeatureCollection");
        fc.put("features", properties.stream().map(this::toFeature).toList());
        return fc;
    }

    @GetMapping("/search")
    public Map<String, Object> search(@RequestParam String q) {
        List<Property> properties = propertyService.searchByText(q);
        Map<String, Object> fc = new HashMap<>();
        fc.put("type", "FeatureCollection");
        fc.put("features", properties.stream().map(this::toFeature).toList());
        return fc;
    }

    @PostMapping
    public ResponseEntity<Property> create(@RequestBody Property property) {
        Property saved = propertyService.save(property);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Property> update(@PathVariable Long id, @RequestBody Property property) {
        return propertyService.getById(id)
            .map(existing -> {
                property.setId(id);
                Property updated = propertyService.save(property);
                return ResponseEntity.ok(updated);
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (propertyService.getById(id).isPresent()) {
            propertyService.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
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
                .map(PropertyImage::getImageUrl)
                .collect(Collectors.toList()));
            props.put("primary_image", p.getImages().stream()
                .filter(PropertyImage::getIsPrimary)
                .findFirst()
                .map(PropertyImage::getImageUrl)
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
