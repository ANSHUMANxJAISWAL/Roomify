package com.roomify.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HouseholdCreateRequest {
    @NotBlank
    @Size(max = 100)
    public String name;

    @Size(max = 500)
    public String description;

    @Valid
    public AddressDto address;

    public Integer maxMembers = 10;

    public List<String> rules;
}
