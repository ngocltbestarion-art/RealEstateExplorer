package com.example.realestate.controller;

import com.example.realestate.entity.PropertyType;
import com.example.realestate.repository.PropertyTypeRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/property-types")
@CrossOrigin(origins = "http://localhost:5173")
public class PropertyTypeController {
    
    private final PropertyTypeRepository propertyTypeRepository;
    
    public PropertyTypeController(PropertyTypeRepository propertyTypeRepository) {
        this.propertyTypeRepository = propertyTypeRepository;
    }
    
    @GetMapping
    public List<PropertyType> getAll() {
        return propertyTypeRepository.findAll();
    }
}
