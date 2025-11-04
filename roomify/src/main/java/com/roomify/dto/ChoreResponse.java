package com.roomify.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChoreResponse {
    public String id;
    public String title;
    public String description;
    public UserDto assignedTo;
    public String dueDate;
    public String status;
    public String priority;
    public String frequency;
    public HouseholdResponse household;
    public UserDto assignedBy;
    public LocalDateTime completedAt;
    public LocalDateTime createdAt;
    public LocalDateTime updatedAt;
    public String tags;
}
