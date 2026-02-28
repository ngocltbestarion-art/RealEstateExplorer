package com.example.realestate.dto;

public class PropertyFilterRequest {
    private Double minPrice;
    private Double maxPrice;
    private Double minArea;
    private Double maxArea;
    private Long propertyTypeId;
    private String status;
    private Integer minBedrooms;
    private Integer maxBedrooms;
    private Integer minBathrooms;
    private String sortBy = "createdAt";
    private String sortDirection = "DESC";
    private Integer page = 0;
    private Integer size = 20;

    // Getters and Setters
    public Double getMinPrice() { return minPrice; }
    public void setMinPrice(Double minPrice) { this.minPrice = minPrice; }

    public Double getMaxPrice() { return maxPrice; }
    public void setMaxPrice(Double maxPrice) { this.maxPrice = maxPrice; }

    public Double getMinArea() { return minArea; }
    public void setMinArea(Double minArea) { this.minArea = minArea; }

    public Double getMaxArea() { return maxArea; }
    public void setMaxArea(Double maxArea) { this.maxArea = maxArea; }

    public Long getPropertyTypeId() { return propertyTypeId; }
    public void setPropertyTypeId(Long propertyTypeId) { this.propertyTypeId = propertyTypeId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getMinBedrooms() { return minBedrooms; }
    public void setMinBedrooms(Integer minBedrooms) { this.minBedrooms = minBedrooms; }

    public Integer getMaxBedrooms() { return maxBedrooms; }
    public void setMaxBedrooms(Integer maxBedrooms) { this.maxBedrooms = maxBedrooms; }

    public Integer getMinBathrooms() { return minBathrooms; }
    public void setMinBathrooms(Integer minBathrooms) { this.minBathrooms = minBathrooms; }

    public String getSortBy() { return sortBy; }
    public void setSortBy(String sortBy) { this.sortBy = sortBy; }

    public String getSortDirection() { return sortDirection; }
    public void setSortDirection(String sortDirection) { this.sortDirection = sortDirection; }

    public Integer getPage() { return page; }
    public void setPage(Integer page) { this.page = page; }

    public Integer getSize() { return size; }
    public void setSize(Integer size) { this.size = size; }
}
