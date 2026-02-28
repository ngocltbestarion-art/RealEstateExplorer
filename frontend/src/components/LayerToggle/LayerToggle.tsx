import React from 'react';

type Visibility = {
  parcels: boolean;
  schools: boolean;
  amenities: boolean;
};

type Props = {
  visibility: Visibility;
  onChange: (v: Visibility) => void;
};

const LayerToggle: React.FC<Props> = ({ visibility, onChange }) => {
  const handleToggle = (key: keyof Visibility) => {
    onChange({ ...visibility, [key]: !visibility[key] });
  };

  return (
    <div>
      <h2 className="font-semibold mb-2">Layers</h2>
      <div className="space-y-2 text-sm">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={visibility.parcels}
            onChange={() => handleToggle('parcels')}
          />
          <span>Parcels</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={visibility.schools}
            onChange={() => handleToggle('schools')}
          />
          <span>Schools</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={visibility.amenities}
            onChange={() => handleToggle('amenities')}
          />
          <span>Amenities</span>
        </label>
      </div>
    </div>
  );
};

export default LayerToggle;

