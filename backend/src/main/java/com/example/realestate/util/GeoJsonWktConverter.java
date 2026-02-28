package com.example.realestate.util;

import com.fasterxml.jackson.databind.JsonNode;
import org.geotools.geojson.geom.GeometryJSON;
import org.locationtech.jts.geom.Geometry;
import org.locationtech.jts.io.WKTWriter;

import java.io.IOException;
import java.io.StringReader;

public class GeoJsonWktConverter {

    private static final GeometryJSON GEOMETRY_JSON = new GeometryJSON();

    public static Geometry geoJsonToGeometry(JsonNode geoJsonNode) throws IOException {
        String json = geoJsonNode.toString();
        try (StringReader reader = new StringReader(json)) {
            Geometry geometry = GEOMETRY_JSON.read(reader);
            // Set SRID to 4326 (WGS84) to match database
            geometry.setSRID(4326);
            return geometry;
        }
    }

    public static String geometryToWkt(Geometry geometry) {
        WKTWriter wktWriter = new WKTWriter();
        return wktWriter.write(geometry);
    }
}

