import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { FavoriteProvider } from './contexts/FavoriteContext';
import MapView from './components/MapView/MapView';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <FavoriteProvider>
        <MapView />
      </FavoriteProvider>
    </AuthProvider>
  );
};

export default App;
