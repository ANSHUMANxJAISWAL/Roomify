package com.roomify.service.impl;

import com.roomify.dto.ExpenseDto;
import com.roomify.database.entities.Expense;
import com.roomify.database.entities.ExpenseStatus;
import com.roomify.database.entities.User;
import com.roomify.exception.ResourceNotFoundException;
import com.roomify.database.repositories.ExpenseRepository;
import com.roomify.database.repositories.UserRepository;
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
        com.roomify.database.entities.Expense expense = new Expense();
        expense.setId(UUID.randomUUID().toString());
        expense.setTitle(expenseDto.getTitle());
        expense.setDescription(expenseDto.getDescription());
        expense.setAmount(expenseDto.getAmount());
        expense.setCategory(expenseDto.getCategory());
        expense.setStatus(com.roomify.database.entities.ExpenseStatus.PENDING);
        expense.setDate(expenseDto.getDate());  // Fixed: was getDueDate(), now getDate()
        expense.setCreatedAt(LocalDateTime.now());
        expense.setUpdatedAt(LocalDateTime.now());
        
        if (expenseDto.getPaidById() != null) {
            User paidByUser = userRepository.findById(expenseDto.getPaidById())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", expenseDto.getPaidById()));
            expense.setPaidBy(paidByUser);
        }
        
        if (expenseDto.getHouseholdId() != null) {
            // Set household if needed - for now, we'll handle this in the controller
        }
        
        Expense savedExpense = expenseRepository.save(expense);
        return convertToDto(savedExpense);
    }

    @Override
    public ExpenseDto getExpenseById(String id) {
        com.roomify.database.entities.Expense expense = expenseRepository.findById(id)
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
        com.roomify.database.entities.Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense", "id", id));
        
        expense.setTitle(expenseDto.getTitle());
        expense.setDescription(expenseDto.getDescription());
        expense.setAmount(expenseDto.getAmount());
        expense.setCategory(expenseDto.getCategory());
        expense.setDate(expenseDto.getDate());
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
        com.roomify.database.entities.Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense", "id", expenseId));
        
        User paidByUser = userRepository.findById(paidById)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", paidById));
        
        expense.setStatus(com.roomify.database.entities.ExpenseStatus.SETTLED);
        expense.setPaidBy(paidByUser);
        expense.setUpdatedAt(LocalDateTime.now());
        
        Expense updatedExpense = expenseRepository.save(expense);
        return convertToDto(updatedExpense);
    }

    private ExpenseDto convertToDto(com.roomify.database.entities.Expense expense) {
        ExpenseDto dto = new ExpenseDto();
        dto.setId(expense.getId());
        dto.setTitle(expense.getTitle());
        dto.setDescription(expense.getDescription());
        dto.setAmount(expense.getAmount());
        dto.setCategory(expense.getCategory());
        dto.setStatus(expense.getStatus());
        dto.setDate(expense.getDate());
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

