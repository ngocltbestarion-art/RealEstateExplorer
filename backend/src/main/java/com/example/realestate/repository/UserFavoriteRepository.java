package com.example.realestate.repository;

import com.example.realestate.entity.UserFavorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserFavoriteRepository extends JpaRepository<UserFavorite, Long> {
    List<UserFavorite> findByUserId(Long userId);
    
    @Query("SELECT uf.property.id FROM UserFavorite uf WHERE uf.user.id = :userId")
    List<Long> findPropertyIdsByUserId(Long userId);
    
    Optional<UserFavorite> findByUserIdAndPropertyId(Long userId, Long propertyId);
    
    boolean existsByUserIdAndPropertyId(Long userId, Long propertyId);
    
    void deleteByUserIdAndPropertyId(Long userId, Long propertyId);
}
