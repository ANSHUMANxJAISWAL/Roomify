package com.roomify.dto;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HouseholdUpdateRequest {
    public String name;
    public String description;
    @Valid
    public AddressDto address;
    public Integer maxMembers;
    public List<String> rules;
}
