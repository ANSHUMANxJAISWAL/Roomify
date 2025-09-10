package com.roomify.service.impl;

import com.roomify.dto.ExpenseDto;
import com.roomify.entity.Expense;
import com.roomify.entity.ExpenseStatus;
import com.roomify.entity.User;
import com.roomify.exception.ResourceNotFoundException;
import com.roomify.repository.ExpenseRepository;
import com.roomify.repository.UserRepository;
import com.roomify.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ExpenseServiceImpl implements ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;
    
    @Autowired
    private UserRepository userRepository;

    @Override
    public ExpenseDto createExpense(ExpenseDto expenseDto) {
        Expense expense = new Expense();
        expense.setId(UUID.randomUUID().toString());
        expense.setTitle(expenseDto.getTitle());
        expense.setDescription(expenseDto.getDescription());
        expense.setAmount(expenseDto.getAmount());
        expense.setCategory(expenseDto.getCategory());
        expense.setStatus(ExpenseStatus.PENDING);
        expense.setDate(expenseDto.getDueDate());
        expense.setCreatedAt(LocalDateTime.now());
        expense.setUpdatedAt(LocalDateTime.now());
        
        if (expenseDto.getPaidById() != null) {
            User paidByUser = userRepository.findById(expenseDto.getPaidById())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", expenseDto.getPaidById()));
            expense.setPaidBy(paidByUser);
        }
        
        if (expenseDto.getHouseholdId() != null) {
            // Set household if needed
        }
        
        Expense savedExpense = expenseRepository.save(expense);
        return convertToDto(savedExpense);
    }

    @Override
    public ExpenseDto getExpenseById(String id) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense", "id", id));
        return convertToDto(expense);
    }

    @Override
    public List<ExpenseDto> getAllExpensesByHousehold(String householdId) {
        return expenseRepository.findByHouseholdId(householdId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ExpenseDto> getExpensesByUser(String userId) {
        return expenseRepository.findByPaidById(userId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public ExpenseDto updateExpense(String id, ExpenseDto expenseDto) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense", "id", id));
        
        expense.setTitle(expenseDto.getTitle());
        expense.setDescription(expenseDto.getDescription());
        expense.setAmount(expenseDto.getAmount());
        expense.setCategory(expenseDto.getCategory());
        expense.setDate(expenseDto.getDueDate());
        expense.setUpdatedAt(LocalDateTime.now());
        
        Expense updatedExpense = expenseRepository.save(expense);
        return convertToDto(updatedExpense);
    }

    @Override
    public void deleteExpense(String id) {
        if (!expenseRepository.existsById(id)) {
            throw new ResourceNotFoundException("Expense", "id", id);
        }
        expenseRepository.deleteById(id);
    }

    @Override
    public ExpenseDto markAsPaid(String expenseId, String paidById) {
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense", "id", expenseId));
        
        User paidByUser = userRepository.findById(paidById)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", paidById));
        
        expense.setStatus(ExpenseStatus.SETTLED);
        expense.setPaidBy(paidByUser);
        expense.setUpdatedAt(LocalDateTime.now());
        
        Expense updatedExpense = expenseRepository.save(expense);
        return convertToDto(updatedExpense);
    }

    private ExpenseDto convertToDto(Expense expense) {
        ExpenseDto dto = new ExpenseDto();
        dto.setId(expense.getId());
        dto.setTitle(expense.getTitle());
        dto.setDescription(expense.getDescription());
        dto.setAmount(expense.getAmount());
        dto.setCategory(expense.getCategory());
        dto.setStatus(expense.getStatus());
        dto.setDueDate(expense.getDate());
        dto.setCreatedAt(expense.getCreatedAt());
        dto.setUpdatedAt(expense.getUpdatedAt());
        
        if (expense.getPaidBy() != null) {
            dto.setPaidById(expense.getPaidBy().getId());
            dto.setPaidByName(expense.getPaidBy().getDisplayName());
        }
        
        if (expense.getHousehold() != null) {
            dto.setHouseholdId(expense.getHousehold().getId());
        }
        
        return dto;
    }
}
