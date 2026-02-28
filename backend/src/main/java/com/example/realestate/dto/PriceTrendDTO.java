package com.example.realestate.dto;

public class PriceTrendDTO {
    private String period;
    private Double averagePrice;
    private Long count;

    public PriceTrendDTO() {}

    public PriceTrendDTO(String period, Double averagePrice, Long count) {
        this.period = period;
        this.averagePrice = averagePrice;
        this.count = count;
    }

    public String getPeriod() { return period; }
    public void setPeriod(String period) { this.period = period; }

    public Double getAveragePrice() { return averagePrice; }
    public void setAveragePrice(Double averagePrice) { this.averagePrice = averagePrice; }

    public Long getCount() { return count; }
    public void setCount(Long count) { this.count = count; }
}
