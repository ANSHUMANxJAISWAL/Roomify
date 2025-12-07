package com.roomify.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseSplitRequest {
    
    @NotBlank(message = "User ID is required")
    private String userId;
    
    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.00", message = "Amount must be greater than or equal to 0")
    private BigDecimal amount;
    
    @NotNull(message = "Percentage is required")
    @DecimalMin(value = "0.00", message = "Percentage must be greater than or equal to 0")
    @DecimalMax(value = "100.00", message = "Percentage must be less than or equal to 100")
    private BigDecimal percentage;
}
