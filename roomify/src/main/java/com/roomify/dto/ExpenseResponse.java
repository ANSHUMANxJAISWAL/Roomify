package com.roomify.dto;

import com.roomify.database.enums.ExpenseCategory;
import com.roomify.database.enums.ExpenseStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseResponse {
    public String id;
    public String title;
    public String description;
    public BigDecimal amount;
    public String currency;
    public LocalDate date;
    public ExpenseCategory category;
    public ExpenseStatus status;
    public UserDto paidBy;
    public HouseholdResponse household;
    public String receiptUrl;
    public List<String> tags;
    public LocalDateTime createdAt;
    public LocalDateTime updatedAt;
    public List<ExpenseSplitResponse> splits;
}
