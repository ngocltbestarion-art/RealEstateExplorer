CREATE DATABASE realestate;
CREATE USER realestate WITH PASSWORD 'realestate';
GRANT ALL PRIVILEGES ON DATABASE realestate TO realestate;

\c realestate;

CREATE EXTENSION IF NOT EXISTS postgis;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Property types
CREATE TABLE IF NOT EXISTS property_types (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

-- Properties table (enhanced)
CREATE TABLE IF NOT EXISTS properties (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    area_sqft DOUBLE PRECISION,
    address VARCHAR(255) NOT NULL,
    description TEXT,
    property_type_id BIGINT REFERENCES property_types(id),
    status VARCHAR(20) DEFAULT 'AVAILABLE',
    bedrooms INT,
    bathrooms INT,
    floors INT,
    year_built INT,
    direction VARCHAR(20),
    legal_status VARCHAR(50),
    owner_id BIGINT REFERENCES users(id),
    views INT DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    geom geometry(Polygon, 4326)
);

-- Property images
CREATE TABLE IF NOT EXISTS property_images (
    id BIGSERIAL PRIMARY KEY,
    property_id BIGINT REFERENCES properties(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User favorites
CREATE TABLE IF NOT EXISTS user_favorites (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    property_id BIGINT REFERENCES properties(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, property_id)
);

-- Search history
CREATE TABLE IF NOT EXISTS search_history (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    search_params JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_properties_geom ON properties USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_area ON properties(area_sqft);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(property_type_id);
CREATE INDEX IF NOT EXISTS idx_property_images_property ON property_images(property_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_property ON user_favorites(property_id);

-- Insert property types
INSERT INTO property_types (name, description) VALUES
('APARTMENT', 'Căn hộ chung cư'),
('HOUSE', 'Nhà riêng'),
('VILLA', 'Biệt thự'),
('LAND', 'Đất nền'),
('OFFICE', 'Văn phòng'),
('COMMERCIAL', 'Thương mại');

-- Insert demo users
INSERT INTO users (username, email, password, full_name, phone, role) VALUES
('admin', 'admin@realestate.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Admin User', '0901234567', 'ADMIN'),
('john_doe', 'john@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'John Doe', '0912345678', 'USER'),
('jane_smith', 'jane@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Jane Smith', '0923456789', 'USER');
-- Password for all users: password123

-- Insert demo properties (New York area)
INSERT INTO properties (name, price, area_sqft, address, description, property_type_id, status, bedrooms, bathrooms, floors, year_built, direction, legal_status, owner_id, views, featured, geom) VALUES
('Luxury Manhattan Penthouse', 2500000, 2800, '123 5th Avenue, Manhattan, NY 10011', 'Stunning penthouse with panoramic city views, modern finishes, and premium amenities. Located in the heart of Manhattan with easy access to Central Park.', 1, 'AVAILABLE', 4, 3, 2, 2018, 'South', 'Full ownership', 1, 245, true, 
ST_GeomFromText('POLYGON((-73.9935 40.7410, -73.9930 40.7410, -73.9930 40.7405, -73.9935 40.7405, -73.9935 40.7410))', 4326)),

('Brooklyn Brownstone', 1850000, 3200, '456 Park Slope, Brooklyn, NY 11215', 'Classic Brooklyn brownstone with original details, spacious rooms, and private garden. Perfect for families seeking charm and character.', 2, 'AVAILABLE', 5, 4, 3, 1920, 'East', 'Full ownership', 1, 189, true,
ST_GeomFromText('POLYGON((-73.9800 40.6650, -73.9795 40.6650, -73.9795 40.6645, -73.9800 40.6645, -73.9800 40.6650))', 4326)),

('Modern Queens Apartment', 650000, 1100, '789 Astoria Blvd, Queens, NY 11102', 'Contemporary 2-bedroom apartment with open floor plan, stainless steel appliances, and in-unit washer/dryer. Close to subway.', 1, 'AVAILABLE', 2, 2, 1, 2020, 'West', 'Full ownership', 2, 156, false,
ST_GeomFromText('POLYGON((-73.9200 40.7650, -73.9195 40.7650, -73.9195 40.7645, -73.9200 40.7645, -73.9200 40.7650))', 4326)),

('Tribeca Loft', 3200000, 2400, '321 Greenwich St, Tribeca, NY 10013', 'Converted warehouse loft with soaring ceilings, exposed brick, and floor-to-ceiling windows. True New York living experience.', 1, 'AVAILABLE', 3, 2, 1, 2015, 'North', 'Full ownership', 1, 312, true,
ST_GeomFromText('POLYGON((-74.0100 40.7180, -74.0095 40.7180, -74.0095 40.7175, -74.0100 40.7175, -74.0100 40.7180))', 4326)),

('Upper East Side Condo', 1200000, 1600, '555 Park Ave, Manhattan, NY 10065', 'Elegant pre-war condo with high ceilings, hardwood floors, and marble bathrooms. Doorman building with gym and roof deck.', 1, 'AVAILABLE', 3, 2, 1, 1935, 'South', 'Full ownership', 2, 198, false,
ST_GeomFromText('POLYGON((-73.9650 40.7700, -73.9645 40.7700, -73.9645 40.7695, -73.9650 40.7695, -73.9650 40.7700))', 4326)),

('Williamsburg Waterfront', 980000, 1350, '888 Kent Ave, Brooklyn, NY 11249', 'Modern waterfront apartment with stunning Manhattan skyline views. Building features pool, gym, and concierge service.', 1, 'AVAILABLE', 2, 2, 1, 2019, 'West', 'Full ownership', 2, 223, true,
ST_GeomFromText('POLYGON((-73.9630 40.7210, -73.9625 40.7210, -73.9625 40.7205, -73.9630 40.7205, -73.9630 40.7210))', 4326)),

('Chelsea Townhouse', 4500000, 4200, '234 W 20th St, Chelsea, NY 10011', 'Rare 4-story townhouse with private elevator, chef kitchen, and rooftop terrace. Perfect for entertaining and family living.', 2, 'AVAILABLE', 6, 5, 4, 2010, 'South', 'Full ownership', 1, 287, true,
ST_GeomFromText('POLYGON((-74.0020 40.7430, -74.0015 40.7430, -74.0015 40.7425, -74.0020 40.7425, -74.0020 40.7430))', 4326)),

('Financial District Studio', 425000, 550, '100 Wall St, Manhattan, NY 10005', 'Efficient studio apartment perfect for young professionals. Building amenities include gym, lounge, and business center.', 1, 'AVAILABLE', 1, 1, 1, 2017, 'East', 'Full ownership', 2, 134, false,
ST_GeomFromText('POLYGON((-74.0090 40.7050, -74.0085 40.7050, -74.0085 40.7045, -74.0090 40.7045, -74.0090 40.7050))', 4326)),

('Harlem Renovated Apartment', 580000, 950, '456 W 125th St, Harlem, NY 10027', 'Fully renovated 2-bedroom with modern kitchen, new bathrooms, and original hardwood floors. Great neighborhood with culture and dining.', 1, 'AVAILABLE', 2, 1, 1, 1940, 'North', 'Full ownership', 2, 167, false,
ST_GeomFromText('POLYGON((-73.9550 40.8100, -73.9545 40.8100, -73.9545 40.8095, -73.9550 40.8095, -73.9550 40.8100))', 4326)),

('SoHo Commercial Loft', 2800000, 3000, '567 Broadway, SoHo, NY 10012', 'Flexible live/work loft space in prime SoHo location. High ceilings, open layout, perfect for creative professionals.', 5, 'AVAILABLE', 2, 2, 1, 2005, 'East', 'Commercial/Residential', 1, 201, true,
ST_GeomFromText('POLYGON((-74.0000 40.7230, -73.9995 40.7230, -73.9995 40.7225, -74.0000 40.7225, -74.0000 40.7230))', 4326)),

('Battery Park City Family Home', 1650000, 2100, '789 South End Ave, Battery Park, NY 10280', 'Spacious 3-bedroom with river views, modern kitchen, and access to waterfront parks. Family-friendly building with playground.', 1, 'SOLD', 3, 2, 1, 2016, 'West', 'Full ownership', 1, 298, false,
ST_GeomFromText('POLYGON((-74.0150 40.7100, -74.0145 40.7100, -74.0145 40.7095, -74.0150 40.7095, -74.0150 40.7100))', 4326)),

('East Village Walk-up', 725000, 850, '123 E 7th St, East Village, NY 10009', 'Charming 1-bedroom in vibrant East Village. Close to restaurants, bars, and nightlife. Perfect for city lovers.', 1, 'AVAILABLE', 1, 1, 1, 1950, 'South', 'Full ownership', 2, 145, false,
ST_GeomFromText('POLYGON((-73.9850 40.7260, -73.9845 40.7260, -73.9845 40.7255, -73.9850 40.7255, -73.9850 40.7260))', 4326)),

('Long Island City New Development', 890000, 1250, '321 Queens Plaza, LIC, NY 11101', 'Brand new construction with luxury finishes, floor-to-ceiling windows, and Manhattan views. Building has rooftop pool and lounge.', 1, 'AVAILABLE', 2, 2, 1, 2023, 'West', 'Full ownership', 1, 178, true,
ST_GeomFromText('POLYGON((-73.9400 40.7500, -73.9395 40.7500, -73.9395 40.7495, -73.9400 40.7495, -73.9400 40.7500))', 4326)),

('West Village Charmer', 1950000, 1800, '234 Bleecker St, West Village, NY 10014', 'Quintessential West Village apartment with exposed brick, working fireplace, and tree-lined street views. Walk to everything.', 1, 'AVAILABLE', 2, 2, 1, 1925, 'North', 'Full ownership', 1, 267, true,
ST_GeomFromText('POLYGON((-74.0050 40.7350, -74.0045 40.7350, -74.0045 40.7345, -74.0050 40.7345, -74.0050 40.7350))', 4326)),

('Midtown Office Space', 3500000, 2500, '456 Madison Ave, Midtown, NY 10022', 'Prime office space in prestigious Midtown location. Recently renovated with modern systems and finishes.', 5, 'AVAILABLE', 0, 2, 1, 2012, 'South', 'Commercial', 1, 156, false,
ST_GeomFromText('POLYGON((-73.9750 40.7580, -73.9745 40.7580, -73.9745 40.7575, -73.9750 40.7575, -73.9750 40.7580))', 4326));

-- Insert demo property images
INSERT INTO property_images (property_id, image_url, is_primary, display_order) VALUES
(1, 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800', true, 1),
(1, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', false, 2),
(1, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', false, 3),
(2, 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800', true, 1),
(2, 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', false, 2),
(3, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', true, 1),
(3, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', false, 2),
(4, 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800', true, 1),
(4, 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', false, 2),
(5, 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800', true, 1),
(6, 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800', true, 1),
(7, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', true, 1),
(8, 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800', true, 1),
(9, 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800', true, 1),
(10, 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800', true, 1),
(11, 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800', true, 1),
(12, 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800', true, 1),
(13, 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', true, 1),
(14, 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800', true, 1),
(15, 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800', true, 1);

-- Insert some favorites
INSERT INTO user_favorites (user_id, property_id) VALUES
(2, 1), (2, 4), (2, 7),
(3, 2), (3, 6), (3, 14);

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO realestate;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO realestate;

