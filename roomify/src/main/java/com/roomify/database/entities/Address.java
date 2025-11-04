package com.roomify.database.entities;

import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Address {

    @NotBlank
    @Size(max = 255)
    private String street;

    @NotBlank
    @Size(max = 100)
    private String city;

    @NotBlank
    @Size(max = 100)
    private String state;

    @NotBlank
    @Size(max = 20)
    private String zipCode;

    @NotBlank
    @Size(max = 100)
    private String country;
}
