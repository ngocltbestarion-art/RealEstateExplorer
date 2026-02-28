package com.example.realestate.dto;

public class GeographicDistributionDTO {
    private String region;
    private Long count;
    private Double averagePrice;

    public GeographicDistributionDTO() {}

    public GeographicDistributionDTO(String region, Long count, Double averagePrice) {
        this.region = region;
        this.count = count;
        this.averagePrice = averagePrice;
    }

    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }

    public Long getCount() { return count; }
    public void setCount(Long count) { this.count = count; }

    public Double getAveragePrice() { return averagePrice; }
    public void setAveragePrice(Double averagePrice) { this.averagePrice = averagePrice; }
}
