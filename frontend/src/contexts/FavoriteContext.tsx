import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as favoriteApi from '../api/favoriteApi';
import { useAuth } from './AuthContext';

interface FavoriteContextType {
  favoriteIds: number[];
  loading: boolean;
  toggleFavorite: (propertyId: number) => Promise<void>;
  isFavorite: (propertyId: number) => boolean;
  refreshFavorites: () => Promise<void>;
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

export const FavoriteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const loadFavorites = async () => {
    if (!isAuthenticated) {
      setFavoriteIds([]);
      return;
    }
    
    try {
      setLoading(true);
      const ids = await favoriteApi.getFavoriteIds();
      setFavoriteIds(ids);
    } catch (error) {
      console.error('Failed to load favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, [isAuthenticated]);

  const toggleFavorite = async (propertyId: number) => {
    if (!isAuthenticated) {
      alert('Please login to save favorites');
      return;
    }

    try {
      if (favoriteIds.includes(propertyId)) {
        await favoriteApi.removeFavorite(propertyId);
        setFavoriteIds(prev => prev.filter(id => id !== propertyId));
      } else {
        await favoriteApi.addFavorite(propertyId);
        setFavoriteIds(prev => [...prev, propertyId]);
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const isFavorite = (propertyId: number) => {
    return favoriteIds.includes(propertyId);
  };

  return (
    <FavoriteContext.Provider
      value={{
        favoriteIds,
        loading,
        toggleFavorite,
        isFavorite,
        refreshFavorites: loadFavorites
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoriteProvider');
  }
  return context;
};
