package com.roomify.dto;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateRequest {
    @Size(min = 2, max = 100)
    public String firstName;

    @Size(max = 100)
    public String lastName;
}
