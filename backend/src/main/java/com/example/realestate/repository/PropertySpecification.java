package com.example.realestate.repository;

import com.example.realestate.dto.PropertyFilterRequest;
import com.example.realestate.entity.Property;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import java.util.ArrayList;
import java.util.List;

public class PropertySpecification {
    
    public static Specification<Property> filterProperties(PropertyFilterRequest filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            if (filter.getMinPrice() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), filter.getMinPrice()));
            }
            
            if (filter.getMaxPrice() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), filter.getMaxPrice()));
            }
            
            if (filter.getMinArea() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("areaSqft"), filter.getMinArea()));
            }
            
            if (filter.getMaxArea() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("areaSqft"), filter.getMaxArea()));
            }
            
            if (filter.getPropertyTypeId() != null) {
                predicates.add(cb.equal(root.get("propertyType").get("id"), filter.getPropertyTypeId()));
            }
            
            if (filter.getStatus() != null && !filter.getStatus().isEmpty()) {
                predicates.add(cb.equal(root.get("status"), filter.getStatus()));
            }
            
            if (filter.getMinBedrooms() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("bedrooms"), filter.getMinBedrooms()));
            }
            
            if (filter.getMaxBedrooms() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("bedrooms"), filter.getMaxBedrooms()));
            }
            
            if (filter.getMinBathrooms() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("bathrooms"), filter.getMinBathrooms()));
            }
            
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
