package com.roomify.controller;

import com.roomify.dto.ExpenseDto;
import com.roomify.service.ExpenseService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/expenses")
@CrossOrigin(origins = "*")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ExpenseDto> createExpense(@RequestBody ExpenseDto expenseDto) {
        ExpenseDto createdExpense = expenseService.createExpense(expenseDto);
        return ResponseEntity.ok(createdExpense);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ExpenseDto> getExpenseById(@PathVariable String id) {
        ExpenseDto expense = expenseService.getExpenseById(id);
        return ResponseEntity.ok(expense);
    }

    @GetMapping("/household/{householdId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<ExpenseDto>> getExpensesByHousehold(@PathVariable String householdId) {
        List<ExpenseDto> expenses = expenseService.getAllExpensesByHousehold(householdId);
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<ExpenseDto>> getExpensesByUser(@PathVariable String userId) {
        List<ExpenseDto> expenses = expenseService.getExpensesByUser(userId);
        return ResponseEntity.ok(expenses);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ExpenseDto> updateExpense(@PathVariable String id, @RequestBody ExpenseDto expenseDto) {
        ExpenseDto updatedExpense = expenseService.updateExpense(id, expenseDto);
        return ResponseEntity.ok(updatedExpense);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> deleteExpense(@PathVariable String id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/mark-paid/{paidById}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ExpenseDto> markAsPaid(@PathVariable String id, @PathVariable String paidById) {
        ExpenseDto paidExpense = expenseService.markAsPaid(id, paidById);
        return ResponseEntity.ok(paidExpense);
    }
}
