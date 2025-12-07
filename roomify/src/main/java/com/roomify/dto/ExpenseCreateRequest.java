package com.roomify.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseCreateRequest {
    
    @NotBlank(message = "Title is required")
    private String title;
    
    private String description;
    
    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private BigDecimal amount;
    
    @NotBlank(message = "Currency is required")
    private String currency = "USD";
    
    @NotNull(message = "Date is required")
    private LocalDate date;
    
    @NotBlank(message = "Category is required")
    private String category;
    
    @NotBlank(message = "Status is required")
    private String status = "PENDING";
    
    @NotBlank(message = "Paid by user ID is required")
    private String paidById;
    
    @NotBlank(message = "Household ID is required")
    private String householdId;
    
    private String receiptUrl;
    
    private List<String> tags;
    
    @NotNull(message = "Split members are required")
    private List<ExpenseSplitRequest> splits;
}
