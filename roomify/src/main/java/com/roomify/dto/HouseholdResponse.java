package com.roomify.dto;

import com.roomify.database.entities.HouseholdStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HouseholdResponse {
    public String id;
    public String name;
    public String description;
    public AddressDto address;
    public String inviteCode;
    public Integer maxMembers;
    public HouseholdStatus status;
    public List<String> rules;
    public LocalDateTime createdAt;
    public LocalDateTime updatedAt;
}
