package com.roomify.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddressDto {
    @Size(max = 255)
    public String street;

    @Size(max = 100)
    public String city;

    @Size(max = 100)
    public String state;

    @Size(max = 20)
    public String zipCode;

    @Size(max = 100)
    public String country;
}
