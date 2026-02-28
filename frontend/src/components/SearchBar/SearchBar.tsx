import React, { useState } from 'react';
import { searchProperties } from '../../api/propertyApi';
import { PropertyFeature } from '../../types/property';

type Props = {
  onSelectProperty: (property: PropertyFeature) => void;
  onSearch: (results: PropertyFeature[]) => void;
};

const SearchBar: React.FC<Props> = ({ onSelectProperty, onSearch }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PropertyFeature[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setQuery(q);
    if (q.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await searchProperties(q);
      setResults(res);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (query.length < 2) return;
    
    setLoading(true);
    try {
      const res = await searchProperties(query);
      setResults([]);
      onSearch(res);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSelect = (property: PropertyFeature) => {
    onSelectProperty(property);
    setQuery(property.properties.name);
    setResults([]);
  };

  return (
    <div style={{ position: 'relative', display: 'flex', gap: '8px', width: '420px' }}>
      <div style={{ position: 'relative', flex: 1 }}>
        <input
          type="text"
          placeholder="Search properties..."
          value={query}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          style={{
            width: '100%',
            padding: '8px 12px 8px 36px',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '6px',
            fontSize: '14px',
            outline: 'none',
            transition: 'all 0.2s',
            backgroundColor: 'rgba(255,255,255,0.95)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
          onFocus={(e) => {
            e.target.style.backgroundColor = 'white';
            e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
          }}
          onBlur={(e) => {
            e.target.style.backgroundColor = 'rgba(255,255,255,0.95)';
            e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
          }}
        />
        <div style={{
          position: 'absolute',
          left: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: '16px',
          color: '#9ca3af',
          pointerEvents: 'none'
        }}>
          🔍
        </div>
        {loading && (
          <div style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '12px',
            color: '#6b7280'
          }}>
            ⏳
          </div>
        )}
        {results.length > 0 && (
          <ul style={{
            position: 'absolute',
            marginTop: '8px',
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            width: '100%',
            maxHeight: '320px',
            overflowY: 'auto',
            zIndex: 1000,
            listStyle: 'none',
            padding: '4px',
            margin: 0
          }}>
            {results.map((property) => (
              <li
                key={property.properties.id}
                onClick={() => handleSelect(property)}
                style={{
                  padding: '12px',
                  cursor: 'pointer',
                  borderRadius: '6px',
                  fontSize: '14px',
                  transition: 'all 0.15s',
                  marginBottom: '2px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <div style={{ fontWeight: 600, marginBottom: '4px', color: '#111827' }}>
                  {property.properties.name}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                  📍 {property.properties.address}
                </div>
                <div style={{ fontSize: '13px', color: '#2563eb', fontWeight: 600 }}>
                  ${property.properties.price?.toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <button
        onClick={handleSearch}
        disabled={query.length < 2}
        style={{
          padding: '8px 16px',
          border: 'none',
          borderRadius: '6px',
          backgroundColor: query.length < 2 ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.95)',
          color: query.length < 2 ? 'rgba(255,255,255,0.5)' : '#667eea',
          cursor: query.length < 2 ? 'not-allowed' : 'pointer',
          fontSize: '14px',
          fontWeight: 600,
          whiteSpace: 'nowrap',
          transition: 'all 0.2s',
          boxShadow: query.length < 2 ? 'none' : '0 2px 4px rgba(0,0,0,0.1)'
        }}
        onMouseEnter={(e) => {
          if (query.length >= 2) {
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
          }
        }}
        onMouseLeave={(e) => {
          if (query.length >= 2) {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.95)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
          }
        }}
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
