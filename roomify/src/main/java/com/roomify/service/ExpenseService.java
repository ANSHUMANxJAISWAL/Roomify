package com.roomify.service;

import com.roomify.dto.ExpenseCreateRequest;
import com.roomify.dto.ExpenseResponse;

import java.util.List;

public interface ExpenseService {
    ExpenseResponse createExpense(ExpenseCreateRequest request);
    ExpenseResponse getExpenseById(String id);
    List<ExpenseResponse> getAllExpenses();
    List<ExpenseResponse> getExpensesByHouseholdId(String householdId);
    ExpenseResponse updateExpense(String id, ExpenseCreateRequest request);
    void deleteExpense(String id);
}
