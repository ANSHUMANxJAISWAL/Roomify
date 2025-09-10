package com.roomify.service;

import com.roomify.dto.ExpenseDto;
import java.util.List;

public interface ExpenseService {
    ExpenseDto createExpense(ExpenseDto expenseDto);
    ExpenseDto getExpenseById(String id);
    List<ExpenseDto> getAllExpensesByHousehold(String householdId);
    List<ExpenseDto> getExpensesByUser(String userId);
    ExpenseDto updateExpense(String id, ExpenseDto expenseDto);
    void deleteExpense(String id);
    ExpenseDto markAsPaid(String expenseId, String paidById);
}
