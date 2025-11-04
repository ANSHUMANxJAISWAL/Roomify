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
public class NotificationResponse {
    public String id;
    public String title;
    public String message;
    public String type;
    public String priority;
    public LocalDateTime readAt;
    public String actionUrl;
    public UserDto user;
    public HouseholdResponse household;
    public LocalDateTime createdAt;
}
