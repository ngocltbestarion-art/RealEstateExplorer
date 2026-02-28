import React, { useState, useEffect } from 'react';
import { PropertyFilter, PropertyType } from '../../types/property';
import { getPropertyTypes } from '../../api/propertyApi';

interface FilterPanelProps {
  onFilterChange: (filter: PropertyFilter) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ onFilterChange }) => {
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [filter, setFilter] = useState<PropertyFilter>({
    sortBy: 'createdAt',
    sortDirection: 'DESC',
    page: 0,
    size: 20
  });
  const [tempFilter, setTempFilter] = useState<PropertyFilter>(filter);

  useEffect(() => {
    getPropertyTypes().then(setPropertyTypes).catch(console.error);
  }, []);

  const handleChange = (updates: Partial<PropertyFilter>) => {
    setTempFilter(prev => ({ ...prev, ...updates }));
  };

  const handleApply = () => {
    const newFilter = { ...tempFilter, page: 0 };
    setFilter(newFilter);
    onFilterChange(newFilter);
  };

  const handleReset = () => {
    const resetFilter: PropertyFilter = {
      sortBy: 'createdAt',
      sortDirection: 'DESC',
      page: 0,
      size: 20
    };
    setFilter(resetFilter);
    setTempFilter(resetFilter);
    onFilterChange(resetFilter);
  };

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '16px' }}>Filters</h3>
        <button
          onClick={handleReset}
          style={{
            padding: '4px 12px',
            fontSize: '12px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            backgroundColor: 'white',
            cursor: 'pointer'
          }}
        >
          Reset
        </button>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
          Property Type
        </label>
        <select
          value={tempFilter.propertyTypeId || ''}
          onChange={(e) => handleChange({ propertyTypeId: e.target.value ? Number(e.target.value) : undefined })}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        >
          <option value="">All Types</option>
          {propertyTypes.map(type => (
            <option key={type.id} value={type.id}>{type.name}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
          Price Range
        </label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="number"
            placeholder="Min"
            value={tempFilter.minPrice || ''}
            onChange={(e) => handleChange({ minPrice: e.target.value ? Number(e.target.value) : undefined })}
            style={{
              flex: 1,
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
          <input
            type="number"
            placeholder="Max"
            value={tempFilter.maxPrice || ''}
            onChange={(e) => handleChange({ maxPrice: e.target.value ? Number(e.target.value) : undefined })}
            style={{
              flex: 1,
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
          Area (sqft)
        </label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="number"
            placeholder="Min"
            value={tempFilter.minArea || ''}
            onChange={(e) => handleChange({ minArea: e.target.value ? Number(e.target.value) : undefined })}
            style={{
              flex: 1,
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
          <input
            type="number"
            placeholder="Max"
            value={tempFilter.maxArea || ''}
            onChange={(e) => handleChange({ maxArea: e.target.value ? Number(e.target.value) : undefined })}
            style={{
              flex: 1,
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
          Bedrooms
        </label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="number"
            placeholder="Min"
            value={tempFilter.minBedrooms || ''}
            onChange={(e) => handleChange({ minBedrooms: e.target.value ? Number(e.target.value) : undefined })}
            style={{
              flex: 1,
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
          <input
            type="number"
            placeholder="Max"
            value={tempFilter.maxBedrooms || ''}
            onChange={(e) => handleChange({ maxBedrooms: e.target.value ? Number(e.target.value) : undefined })}
            style={{
              flex: 1,
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
          Status
        </label>
        <select
          value={tempFilter.status || ''}
          onChange={(e) => handleChange({ status: e.target.value || undefined })}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        >
          <option value="">All Status</option>
          <option value="AVAILABLE">Available</option>
          <option value="SOLD">Sold</option>
          <option value="RENTED">Rented</option>
        </select>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
          Sort By
        </label>
        <select
          value={tempFilter.sortBy}
          onChange={(e) => handleChange({ sortBy: e.target.value })}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px',
            marginBottom: '8px'
          }}
        >
          <option value="createdAt">Newest</option>
          <option value="price">Price</option>
          <option value="areaSqft">Area</option>
          <option value="views">Most Viewed</option>
        </select>
        <select
          value={tempFilter.sortDirection}
          onChange={(e) => handleChange({ sortDirection: e.target.value as 'ASC' | 'DESC' })}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        >
          <option value="DESC">Descending</option>
          <option value="ASC">Ascending</option>
        </select>
      </div>

      <button
        onClick={handleApply}
        style={{
          width: '100%',
          padding: '12px',
          border: 'none',
          borderRadius: '4px',
          backgroundColor: '#1d4ed8',
          color: 'white',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
          marginBottom: '8px'
        }}
      >
        🔍 Apply Filters
      </button>
    </div>
  );
};

export default FilterPanel;
