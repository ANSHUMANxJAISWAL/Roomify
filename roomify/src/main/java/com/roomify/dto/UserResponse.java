package com.roomify.dto;

import com.roomify.database.entities.UserRole;
import com.roomify.database.entities.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    public String id;
    public String email;
    public String firstName;
    public String lastName;
    public UserRole role;
    public UserStatus status;
    public LocalDateTime createdAt;
    public LocalDateTime updatedAt;
}
