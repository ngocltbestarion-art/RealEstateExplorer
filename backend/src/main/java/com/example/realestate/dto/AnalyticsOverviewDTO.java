package com.example.realestate.dto;

public class AnalyticsOverviewDTO {
    private Long totalProperties;
    private Double averagePrice;
    private Double maxPrice;
    private Double minPrice;
    private Long availableCount;
    private Long soldCount;
    private Long pendingCount;

    public AnalyticsOverviewDTO() {}

    public AnalyticsOverviewDTO(Long totalProperties, Double averagePrice, Double maxPrice, Double minPrice,
                                Long availableCount, Long soldCount, Long pendingCount) {
        this.totalProperties = totalProperties;
        this.averagePrice = averagePrice;
        this.maxPrice = maxPrice;
        this.minPrice = minPrice;
        this.availableCount = availableCount;
        this.soldCount = soldCount;
        this.pendingCount = pendingCount;
    }

    public Long getTotalProperties() { return totalProperties; }
    public void setTotalProperties(Long totalProperties) { this.totalProperties = totalProperties; }

    public Double getAveragePrice() { return averagePrice; }
    public void setAveragePrice(Double averagePrice) { this.averagePrice = averagePrice; }

    public Double getMaxPrice() { return maxPrice; }
    public void setMaxPrice(Double maxPrice) { this.maxPrice = maxPrice; }

    public Double getMinPrice() { return minPrice; }
    public void setMinPrice(Double minPrice) { this.minPrice = minPrice; }

    public Long getAvailableCount() { return availableCount; }
    public void setAvailableCount(Long availableCount) { this.availableCount = availableCount; }

    public Long getSoldCount() { return soldCount; }
    public void setSoldCount(Long soldCount) { this.soldCount = soldCount; }

    public Long getPendingCount() { return pendingCount; }
    public void setPendingCount(Long pendingCount) { this.pendingCount = pendingCount; }
}
