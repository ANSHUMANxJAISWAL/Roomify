package com.roomify.service.impl;

import com.roomify.database.entities.ExpenseCategory;
import com.roomify.database.entities.ExpenseStatus;
import com.roomify.dto.ExpenseDto;
import com.roomify.service.ExpenseService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Test class to verify expense functionality works correctly
 */
@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class ExpenseServiceTest {

    @Autowired
    private ExpenseService expenseService;

    @Test
    public void testCreateAndRetrieveExpense() {
        // Create a test expense
        ExpenseDto expenseDto = new ExpenseDto();
        expenseDto.setTitle("Test Expense");
        expenseDto.setDescription("Test Description");
        expenseDto.setAmount(new BigDecimal("100.00"));
        expenseDto.setCategory(ExpenseCategory.FOOD);
        expenseDto.setDate(LocalDate.now());
        expenseDto.setPaidById("test-user-id");
        expenseDto.setHouseholdId("test-household-id");

        // Create the expense
        ExpenseDto createdExpense = expenseService.createExpense(expenseDto);

        // Verify the expense was created correctly
        assertNotNull(createdExpense.getId());
        assertEquals("Test Expense", createdExpense.getTitle());
        assertEquals("Test Description", createdExpense.getDescription());
        assertEquals(new BigDecimal("100.00"), createdExpense.getAmount());
        assertEquals(ExpenseCategory.FOOD, createdExpense.getCategory());
        assertEquals(ExpenseStatus.PENDING, createdExpense.getStatus());
        assertEquals(LocalDate.now(), createdExpense.getDate());
        assertEquals("test-user-id", createdExpense.getPaidById());
        assertEquals("test-household-id", createdExpense.getHouseholdId());

        // Retrieve the expense by ID
        ExpenseDto retrievedExpense = expenseService.getExpenseById(createdExpense.getId());
        assertNotNull(retrievedExpense);
        assertEquals(createdExpense.getId(), retrievedExpense.getId());
        assertEquals("Test Expense", retrievedExpense.getTitle());

        // Retrieve expenses by household
        List<ExpenseDto> householdExpenses = expenseService.getAllExpensesByHousehold("test-household-id");
        assertFalse(householdExpenses.isEmpty());
        assertEquals(1, householdExpenses.size());

        // Verify the expense is in the list
        ExpenseDto householdExpense = householdExpenses.get(0);
        assertEquals(createdExpense.getId(), householdExpense.getId());

        System.out.println("✅ Expense creation and retrieval test passed!");
        System.out.println("   Created expense ID: " + createdExpense.getId());
        System.out.println("   Retrieved expense: " + retrievedExpense.getTitle());
    }
}
