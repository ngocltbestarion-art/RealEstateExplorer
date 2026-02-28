# 🏠 Real Estate Spatial Explorer

A full-stack GIS application for real estate property management with advanced spatial query capabilities, interactive mapping, and comprehensive property analysis tools.

## ✨ Features

### 🗺️ Interactive Mapping
- **OpenStreetMap Integration** - High-quality base map with street-level details
- **Property Visualization** - Display properties as colored polygons on the map
- **Auto-zoom & Fit Bounds** - Automatically zoom to property locations
- **Click Interaction** - Click properties to view detailed information

### 🔍 Search & Filter
- **Text Search** - Search properties by name or address with autocomplete
- **Advanced Filters** - Filter by:
  - Property type (Apartment, House, Villa, etc.)
  - Price range (min/max)
  - Area (sqft)
  - Number of bedrooms
  - Status (Available, Sold, Rented)
- **Sort Options** - Sort by newest, price, area, or views
- **Real-time Results** - Instant search with auto-zoom to results

### 📍 Spatial Query
- **Drawing Tools** - Draw shapes on the map:
  - Circle (radius search)
  - Rectangle (bounding box)
  - Polygon (custom area)
- **Spatial Intersection** - Find properties within drawn areas
- **PostGIS Integration** - Powered by ST_Intersects for accurate spatial queries

### 🔥 Price Heatmap
- **Color-coded Visualization** - See price distribution at a glance:
  - 🔴 Red: $2M+ (Most Expensive)
  - 🟠 Orange: $1.5M-$2M (Very High)
  - 🟡 Yellow: $1M-$1.5M (High)
  - 🟢 Green: $500K-$1M (Medium)
  - 🔵 Cyan: $200K-$500K (Low)
  - 🔵 Blue: <$200K (Most Affordable)

### 📊 Property Details
- **Full Details Modal** - Comprehensive property information:
  - Image gallery with navigation
  - Price and price per sqft
  - Bedrooms, bathrooms, area, floors
  - Year built, direction, legal status
  - Property type and status
  - View counter
- **Image Gallery** - Multiple property images with slider
- **Featured Badge** - Highlight premium listings

### ⚖️ Property Comparison
- **Side-by-side Comparison** - Compare 2-3 properties simultaneously
- **Detailed Metrics** - Compare all property attributes
- **Quick Stats** - Instant highlights:
  - Lowest/highest price
  - Largest area
  - Most bedrooms
- **Visual Indicators** - Color-coded status and features

### 👤 User Management
- **Authentication** - Secure login/logout system
- **User Roles** - Admin and regular user support
- **Favorites Management** - Save and manage favorite properties
- **Personalized Views** - Filter by saved properties

### 🎨 Modern UI/UX
- **Gradient Design** - Beautiful purple gradient theme
- **Smooth Animations** - Slide-up, fade-in effects
- **Hover Effects** - Interactive button states
- **Responsive Layout** - Grid-based responsive design
- **Modal Dialogs** - Clean, centered modals with backdrop blur

## 🛠️ Tech Stack

### Frontend
- **React 18.2** - UI framework
- **TypeScript** - Type-safe development
- **Leaflet.js** - Interactive mapping library
- **React-Leaflet** - React bindings for Leaflet
- **Leaflet.heat** - Heatmap visualization
- **Leaflet-draw** - Drawing tools
- **Vite** - Fast build tool and dev server

### Backend
- **Spring Boot 3.2** - Java framework
- **Spring Data JPA** - Database ORM
- **Hibernate Spatial** - Spatial data support
- **GeoTools** - Geospatial library
- **PostgreSQL 15** - Relational database
- **PostGIS 3.4** - Spatial database extension

### Additional Tools
- **GeoServer** (Optional) - WMS layer server
- **Maven** - Java dependency management
- **npm** - JavaScript package manager

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│  React + TypeScript + Leaflet + Vite                        │
│  - MapView (Main component)                                 │
│  - PropertyDetailsModal                                     │
│  - ComparisonModal                                          │
│  - FilterPanel, SearchBar                                   │
│  - HeatmapLayer                                             │
└─────────────────┬───────────────────────────────────────────┘
                  │ REST API (JSON/GeoJSON)
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                         Backend                              │
│  Spring Boot + JPA + Hibernate Spatial                      │
│  - Controllers (REST endpoints)                             │
│  - Services (Business logic)                                │
│  - Repositories (Data access)                               │
│  - DTOs (Data transfer objects)                             │
└─────────────────┬───────────────────────────────────────────┘
                  │ JDBC + PostGIS functions
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                        Database                              │
│  PostgreSQL 15 + PostGIS 3.4                                │
│  - properties (with geometry column)                        │
│  - users, property_types                                    │
│  - property_images, user_favorites                          │
│  - Spatial indexes (GIST)                                   │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Prerequisites

- **Java 17+** - [Download](https://adoptium.net/)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **PostgreSQL 15+** - [Download](https://www.postgresql.org/download/)
- **PostGIS 3.4+** - [Installation Guide](https://postgis.net/install/)
- **Maven 3.8+** - [Download](https://maven.apache.org/download.cgi)
- **Git** - [Download](https://git-scm.com/)

## 🚀 Installation

### 1. Clone Repository

```bash
git clone <repository-url>
cd real-estate-spatial-explorer
```

### 2. Database Setup

```bash
# Create database
psql -U postgres
CREATE DATABASE realestate_db;
\c realestate_db
CREATE EXTENSION postgis;
\q

# Import schema and data
psql -U postgres -d realestate_db -f db/init_postgis.sql
```

### 3. Backend Setup

```bash
cd backend

# Update application.yml with your database credentials
# Edit: src/main/resources/application.yml

# Install dependencies and build
mvn clean install

# Run application
mvn spring-boot:run
```

Backend will start on `http://localhost:8080`

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will start on `http://localhost:5173`

## ⚙️ Configuration

### Backend Configuration

Edit `backend/src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/realestate_db
    username: postgres
    password: your_password
  jpa:
    properties:
      hibernate:
        dialect: org.hibernate.spatial.dialect.postgis.PostgisDialect
    show-sql: true

server:
  port: 8080
```

### Frontend Configuration

Edit `frontend/src/api/apiClient.ts` if backend URL changes:

```typescript
const API_BASE_URL = 'http://localhost:8080';
```

## 🎮 Running the Application

### Development Mode

1. **Start PostgreSQL** (if not running as service)
2. **Start Backend**:
   ```bash
   cd backend
   mvn spring-boot:run
   ```
3. **Start Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```
4. **Open Browser**: Navigate to `http://localhost:5173`

### Production Build

```bash
# Frontend
cd frontend
npm run build
# Output: frontend/dist

# Backend
cd backend
mvn clean package
# Output: backend/target/realestate-*.jar

# Run production
java -jar backend/target/realestate-*.jar
```

## 👥 Demo Accounts

| Username  | Password     | Role  |
|-----------|--------------|-------|
| admin     | password123  | Admin |
| john_doe  | password123  | User  |
| jane_smith| password123  | User  |

## 📡 API Documentation

### Properties

- `GET /api/properties` - Get all properties (GeoJSON)
- `GET /api/properties/{id}` - Get property by ID
- `GET /api/properties/featured` - Get featured properties
- `POST /api/properties/filter` - Filter properties with pagination
- `POST /api/properties/within` - Spatial query (properties within geometry)
- `GET /api/properties/search?q={query}` - Text search

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Favorites

- `GET /api/favorites` - Get user's favorite properties
- `POST /api/favorites/{propertyId}` - Add to favorites
- `DELETE /api/favorites/{propertyId}` - Remove from favorites

### Property Types

- `GET /api/property-types` - Get all property types

## 📁 Project Structure

```
real-estate-spatial-explorer/
├── backend/
│   ├── src/main/java/com/example/realestate/
│   │   ├── controller/          # REST controllers
│   │   ├── service/             # Business logic
│   │   ├── repository/          # Data access layer
│   │   ├── entity/              # JPA entities
│   │   ├── dto/                 # Data transfer objects
│   │   └── util/                # Utility classes
│   ├── src/main/resources/
│   │   └── application.yml      # Configuration
│   └── pom.xml                  # Maven dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── MapView/         # Main map component
│   │   │   ├── PropertyDetailsModal/
│   │   │   ├── ComparisonModal/
│   │   │   ├── FilterPanel/
│   │   │   ├── SearchBar/
│   │   │   ├── HeatmapLayer/
│   │   │   └── ...
│   │   ├── contexts/            # React contexts
│   │   ├── api/                 # API client
│   │   ├── types/               # TypeScript types
│   │   └── styles/              # CSS styles
│   ├── package.json             # npm dependencies
│   └── vite.config.ts           # Vite configuration
│
├── db/
│   └── init_postgis.sql         # Database schema & data
│
├── README.md                    # This file
└── SETUP_AND_TEST_GUIDE.md     # Detailed setup guide
```

## 📸 Screenshots

### Main Map View
Interactive map with property polygons and search functionality.

### Property Details Modal
Full property information with image gallery and actions.

### Comparison View
Side-by-side comparison of multiple properties.

### Price Heatmap
Color-coded visualization of property price distribution.

## 🐛 Troubleshooting

### Backend Issues

**Problem**: `Cannot connect to database`
```bash
# Solution: Check PostgreSQL is running
sudo systemctl status postgresql
# Or on Windows: Check Services

# Verify connection
psql -U postgres -d realestate_db
```

**Problem**: `PostGIS extension not found`
```bash
# Solution: Install PostGIS
# Ubuntu/Debian
sudo apt-get install postgresql-15-postgis-3

# Then in psql:
CREATE EXTENSION postgis;
```

**Problem**: `Port 8080 already in use`
```bash
# Solution: Change port in application.yml
server:
  port: 8081
```

### Frontend Issues

**Problem**: `Module not found: leaflet.heat`
```bash
# Solution: Install missing dependency
npm install leaflet.heat @types/leaflet.heat
```

**Problem**: `CORS error`
```bash
# Solution: Check @CrossOrigin annotation in controllers
@CrossOrigin(origins = "http://localhost:5173")
```

**Problem**: `Map not displaying`
```bash
# Solution: Check Leaflet CSS is imported
import 'leaflet/dist/leaflet.css';
```

### Database Issues

**Problem**: `Geometry SRID mismatch`
```sql
-- Solution: Ensure all geometries use SRID 4326
SELECT ST_SRID(geom) FROM properties;
-- Should return 4326
```

**Problem**: `Slow spatial queries`
```sql
-- Solution: Create spatial index
CREATE INDEX idx_properties_geom ON properties USING GIST(geom);
```

## 📝 License

This project is for educational and demonstration purposes.

## 👨‍💻 Author

Built with ❤️ using React, Spring Boot, and PostGIS

## 🙏 Acknowledgments

- OpenStreetMap for base map tiles
- Leaflet.js for mapping library
- Unsplash for demo property images
- PostGIS for spatial database capabilities

---

**Happy Mapping! 🗺️**
