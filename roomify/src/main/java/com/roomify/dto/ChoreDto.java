package com.roomify.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.roomify.entity.ChoreFrequency;
import com.roomify.entity.ChorePriority;
import com.roomify.entity.ChoreStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class ChoreDto {
    private String id;
    private String title;
    private String description;
    private ChorePriority priority;
    private ChoreStatus status;
    private ChoreFrequency frequency;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dueDate;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime completedAt;
    
    private String assignedToId;
    private String assignedToName;
    private String createdById;
    private String createdByName;
    private String householdId;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;
    
    public ChoreDto() {}
    
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public ChorePriority getPriority() { return priority; }
    public void setPriority(ChorePriority priority) { this.priority = priority; }
    
    public ChoreStatus getStatus() { return status; }
    public void setStatus(ChoreStatus status) { this.status = status; }
    
    public ChoreFrequency getFrequency() { return frequency; }
    public void setFrequency(ChoreFrequency frequency) { this.frequency = frequency; }
    
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
    
    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
    
    public String getAssignedToId() { return assignedToId; }
    public void setAssignedToId(String assignedToId) { this.assignedToId = assignedToId; }
    
    public String getAssignedToName() { return assignedToName; }
    public void setAssignedToName(String assignedToName) { this.assignedToName = assignedToName; }
    
    public String getCreatedById() { return createdById; }
    public void setCreatedById(String createdById) { this.createdById = createdById; }
    
    public String getCreatedByName() { return createdByName; }
    public void setCreatedByName(String createdByName) { this.createdByName = createdByName; }
    
    public String getHouseholdId() { return householdId; }
    public void setHouseholdId(String householdId) { this.householdId = householdId; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
