package com.roomify.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseSplitResponse {
    public String id;
    public UserDto user;
    public BigDecimal amount;
    public BigDecimal percentage;
    public String status;
}
