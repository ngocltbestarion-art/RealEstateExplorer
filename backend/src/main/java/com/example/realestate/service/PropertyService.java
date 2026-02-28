package com.example.realestate.service;

import com.example.realestate.dto.GeometryFilterRequest;
import com.example.realestate.dto.PropertyFilterRequest;
import com.example.realestate.entity.Property;
import com.example.realestate.repository.PropertyRepository;
import com.example.realestate.repository.PropertySpecification;
import com.example.realestate.util.GeoJsonWktConverter;
import com.fasterxml.jackson.databind.JsonNode;
import org.locationtech.jts.geom.Geometry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class PropertyService {

    private final PropertyRepository propertyRepository;

    public PropertyService(PropertyRepository propertyRepository) {
        this.propertyRepository = propertyRepository;
    }

    public List<Property> getAll() {
        return propertyRepository.findAll();
    }

    public Optional<Property> getById(Long id) {
        return propertyRepository.findById(id);
    }

    @Transactional
    public Property save(Property property) {
        return propertyRepository.save(property);
    }

    @Transactional
    public void deleteById(Long id) {
        propertyRepository.deleteById(id);
    }

    public Page<Property> filterProperties(PropertyFilterRequest filter) {
        Sort sort = Sort.by(
            filter.getSortDirection().equalsIgnoreCase("ASC") 
                ? Sort.Direction.ASC 
                : Sort.Direction.DESC,
            filter.getSortBy()
        );
        
        Pageable pageable = PageRequest.of(filter.getPage(), filter.getSize(), sort);
        
        return propertyRepository.findAll(
            PropertySpecification.filterProperties(filter), 
            pageable
        );
    }

    public List<Property> findWithin(GeometryFilterRequest request) throws IOException {
        JsonNode geometryNode = request.getGeometry();
        Geometry geom = GeoJsonWktConverter.geoJsonToGeometry(geometryNode);
        // Use ST_Intersects instead of ST_Within for better results
        return propertyRepository.findIntersecting(geom);
    }

    public List<Property> searchByText(String q) {
        return propertyRepository.searchByNameOrAddress(q);
    }

    public List<Property> getFeaturedProperties() {
        return propertyRepository.findByFeaturedTrue();
    }

    @Transactional
    public void incrementViews(Long id) {
        propertyRepository.incrementViews(id);
    }

    public List<Property> getPropertiesByIds(List<Long> ids) {
        return propertyRepository.findByIdIn(ids);
    }
}
