package com.roomify.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserCreateRequest {
    @NotBlank
    @Email
    public String email;

    @NotBlank
    @Size(min = 6)
    public String password;

    @NotBlank
    public String firstName;

    public String lastName;
}