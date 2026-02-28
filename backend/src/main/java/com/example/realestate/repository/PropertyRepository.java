package com.example.realestate.repository;

import com.example.realestate.entity.Property;
import org.locationtech.jts.geom.Geometry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long>, JpaSpecificationExecutor<Property> {

    @Query("""
            SELECT p FROM Property p
            WHERE ST_Within(p.geom, :filterGeom) = true
            """)
    List<Property> findWithin(Geometry filterGeom);

    @Query("""
            SELECT p FROM Property p
            WHERE ST_Intersects(p.geom, :filterGeom) = true
            """)
    List<Property> findIntersecting(Geometry filterGeom);

    @Query("""
            SELECT p FROM Property p
            WHERE ST_Distance(p.geom, :center) <= :distanceMeters
            """)
    List<Property> findWithinDistance(Geometry center, double distanceMeters);

    @Query("""
            SELECT p FROM Property p
            WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :q, '%'))
               OR LOWER(p.address) LIKE LOWER(CONCAT('%', :q, '%'))
            """)
    List<Property> searchByNameOrAddress(String q);
    
    List<Property> findByFeaturedTrue();
    
    Page<Property> findByStatus(String status, Pageable pageable);
    
    @Modifying
    @Query("UPDATE Property p SET p.views = p.views + 1 WHERE p.id = :id")
    void incrementViews(Long id);
    
    @Query("SELECT p FROM Property p WHERE p.id IN :ids")
    List<Property> findByIdIn(List<Long> ids);
}
