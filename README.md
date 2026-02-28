# Real Estate Spatial Explorer

Demo GIS application for real estate parcels using React + Leaflet frontend, Spring Boot backend, PostGIS database and GeoServer WMS/WFS.

## Project structure

- `backend/` - Spring Boot REST API (PostGIS queries, GeoJSON)
- `frontend/` - React + Vite + Leaflet map viewer
- `db/init_postgis.sql` - PostgreSQL + PostGIS schema and sample data

## Prerequisites

- Java 17, Maven 3.8+
- Node.js 18+
- PostgreSQL 14+ with PostGIS extension
- GeoServer 2.21+ running on `http://localhost:8081/geoserver`

## Setup database

1. Start PostgreSQL.
2. Run `db/init_postgis.sql` in a superuser session (for example `psql` or pgAdmin) to:
   - create database `realestate`
   - create user `realestate` / password `realestate`
   - enable PostGIS
   - create `properties` table and insert sample polygon.

## Configure GeoServer

1. Create workspace `realestate`.
2. Create PostGIS store pointing to database `realestate` (user `realestate`).
3. Publish table `properties` as layer name `parcels` with EPSG:4326.
4. Ensure WMS/WFS enabled; base URL like:
   - WMS: `http://localhost:8081/geoserver/realestate/wms`

The frontend is configured to hit the WMS endpoint above.

## Run backend

```bash
cd backend
mvn spring-boot:run
```

Backend runs on `http://localhost:8080`.

## Run frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Demo flow

1. Open `http://localhost:5173`.
2. Parcels layer is loaded from:
   - GeoJSON vector via `/api/properties`
   - WMS overlay from GeoServer.
3. Use the search bar (Nominatim) to look up an address.
4. Draw a polygon or circle on the map:
   - Frontend sends GeoJSON geometry to `/api/properties/within`.
   - Backend converts GeoJSON → JTS Geometry and queries PostGIS with `ST_Within`.
   - Matching properties are returned as GeoJSON and rendered on the map.
5. Click a parcel polygon to see details (price, area, address, description).

