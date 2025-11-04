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
public class ReminderResponse {
    public String id;
    public String title;
    public String description;
    public String type;
    public String dueDate;
    public String dueTime;
    public String priority;
    public String status;
    public UserDto assignedTo;
    public String amount;
    public String category;
    public String tone;
    public boolean isAI;
    public UserDto user;
    public HouseholdResponse household;
    public String tags;
    public LocalDateTime createdAt;
    public LocalDateTime updatedAt;
}
