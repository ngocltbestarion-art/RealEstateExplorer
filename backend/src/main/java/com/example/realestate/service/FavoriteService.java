package com.example.realestate.service;

import com.example.realestate.entity.Property;
import com.example.realestate.entity.User;
import com.example.realestate.entity.UserFavorite;
import com.example.realestate.repository.UserFavoriteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FavoriteService {
    
    private final UserFavoriteRepository favoriteRepository;
    private final PropertyService propertyService;
    
    public FavoriteService(UserFavoriteRepository favoriteRepository, PropertyService propertyService) {
        this.favoriteRepository = favoriteRepository;
        this.propertyService = propertyService;
    }
    
    public List<Long> getFavoritePropertyIds(Long userId) {
        return favoriteRepository.findPropertyIdsByUserId(userId);
    }
    
    public List<Property> getFavoriteProperties(Long userId) {
        List<Long> propertyIds = getFavoritePropertyIds(userId);
        return propertyService.getPropertiesByIds(propertyIds);
    }
    
    @Transactional
    public UserFavorite addFavorite(User user, Property property) {
        if (favoriteRepository.existsByUserIdAndPropertyId(user.getId(), property.getId())) {
            throw new RuntimeException("Property already in favorites");
        }
        
        UserFavorite favorite = new UserFavorite();
        favorite.setUser(user);
        favorite.setProperty(property);
        return favoriteRepository.save(favorite);
    }
    
    @Transactional
    public void removeFavorite(Long userId, Long propertyId) {
        favoriteRepository.deleteByUserIdAndPropertyId(userId, propertyId);
    }
    
    public boolean isFavorite(Long userId, Long propertyId) {
        return favoriteRepository.existsByUserIdAndPropertyId(userId, propertyId);
    }
}
