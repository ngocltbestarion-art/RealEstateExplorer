package com.example.realestate.dto;

import com.fasterxml.jackson.databind.JsonNode;

public class GeometryFilterRequest {

    private JsonNode geometry;

    public JsonNode getGeometry() {
        return geometry;
    }

    public void setGeometry(JsonNode geometry) {
        this.geometry = geometry;
    }
}

