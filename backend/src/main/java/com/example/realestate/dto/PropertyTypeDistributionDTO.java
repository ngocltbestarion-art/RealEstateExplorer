package com.example.realestate.dto;

public class PropertyTypeDistributionDTO {
    private String typeName;
    private Long count;
    private Double percentage;

    public PropertyTypeDistributionDTO() {}

    public PropertyTypeDistributionDTO(String typeName, Long count) {
        this.typeName = typeName;
        this.count = count;
    }

    public String getTypeName() { return typeName; }
    public void setTypeName(String typeName) { this.typeName = typeName; }

    public Long getCount() { return count; }
    public void setCount(Long count) { this.count = count; }

    public Double getPercentage() { return percentage; }
    public void setPercentage(Double percentage) { this.percentage = percentage; }
}
