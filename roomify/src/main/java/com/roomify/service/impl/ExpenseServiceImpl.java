package com.roomify.service.impl;

import com.roomify.database.entities.*;
import com.roomify.database.enums.ExpenseCategory;
import com.roomify.database.enums.ExpenseStatus;
import com.roomify.database.enums.ExpenseSplitStatus;
import com.roomify.database.repositories.ExpenseRepository;
import com.roomify.database.repositories.ExpenseSplitRepository;
import com.roomify.database.repositories.HouseholdRepository;
import com.roomify.database.repositories.UserRepository;
import com.roomify.dto.*;
import com.roomify.exception.ResourceNotFoundException;
import com.roomify.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final ExpenseSplitRepository expenseSplitRepository;
    private final UserRepository userRepository;
    private final HouseholdRepository householdRepository;

    @Override
    @Transactional
    public ExpenseResponse createExpense(ExpenseCreateRequest request) {
        // Validate user exists
        User paidByUser = userRepository.findById(request.getPaidById())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getPaidById()));

        // Validate household exists
        Household household = householdRepository.findById(request.getHouseholdId())
                .orElseThrow(() -> new ResourceNotFoundException("Household not found with id: " + request.getHouseholdId()));

        // Create expense
        Expense expense = new Expense();
        expense.setTitle(request.getTitle());
        expense.setDescription(request.getDescription());
        expense.setAmount(request.getAmount());
        expense.setCurrency(request.getCurrency());
        expense.setDate(request.getDate());
        expense.setCategory(ExpenseCategory.valueOf(request.getCategory()));
        expense.setStatus(ExpenseStatus.valueOf(request.getStatus()));
        expense.setPaidBy(paidByUser);
        expense.setHousehold(household);
        expense.setReceiptUrl(request.getReceiptUrl());
        expense.setTags(request.getTags() != null ? request.getTags() : new ArrayList<>());

        // Save expense first
        Expense savedExpense = expenseRepository.save(expense);

        // Create expense splits
        List<ExpenseSplit> splits = new ArrayList<>();
        if (request.getSplits() != null && !request.getSplits().isEmpty()) {
            for (ExpenseSplitRequest splitRequest : request.getSplits()) {
                User splitUser = userRepository.findById(splitRequest.getUserId())
                        .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + splitRequest.getUserId()));

                ExpenseSplit split = new ExpenseSplit();
                split.setExpense(savedExpense);
                split.setUser(splitUser);
                split.setAmount(splitRequest.getAmount());
                split.setPercentage(splitRequest.getPercentage());
                split.setStatus(ExpenseSplitStatus.PENDING);
                splits.add(split);
            }
            expenseSplitRepository.saveAll(splits);
        }

        savedExpense.setSplits(splits);
        return mapToResponse(savedExpense);
    }

    @Override
    @Transactional(readOnly = true)
    public ExpenseResponse getExpenseById(String id) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + id));
        return mapToResponse(expense);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExpenseResponse> getAllExpenses() {
        return expenseRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExpenseResponse> getExpensesByHouseholdId(String householdId) {
        return expenseRepository.findByHouseholdId(householdId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ExpenseResponse updateExpense(String id, ExpenseCreateRequest request) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + id));

        expense.setTitle(request.getTitle());
        expense.setDescription(request.getDescription());
        expense.setAmount(request.getAmount());
        expense.setCurrency(request.getCurrency());
        expense.setDate(request.getDate());
        expense.setCategory(ExpenseCategory.valueOf(request.getCategory()));
        expense.setStatus(ExpenseStatus.valueOf(request.getStatus()));
        expense.setReceiptUrl(request.getReceiptUrl());
        expense.setTags(request.getTags() != null ? request.getTags() : new ArrayList<>());

        Expense updatedExpense = expenseRepository.save(expense);
        return mapToResponse(updatedExpense);
    }

    @Override
    @Transactional
    public void deleteExpense(String id) {
        if (!expenseRepository.existsById(id)) {
            throw new ResourceNotFoundException("Expense not found with id: " + id);
        }
        expenseRepository.deleteById(id);
    }

    private ExpenseResponse mapToResponse(Expense expense) {
        ExpenseResponse response = new ExpenseResponse();
        response.id = expense.getId();
        response.title = expense.getTitle();
        response.description = expense.getDescription();
        response.amount = expense.getAmount();
        response.currency = expense.getCurrency();
        response.date = expense.getDate();
        response.category = expense.getCategory().name();
        response.status = expense.getStatus().name();
        
        // Map paid by user
        UserDto paidByDto = new UserDto();
        paidByDto.id = expense.getPaidBy().getId();
        paidByDto.email = expense.getPaidBy().getEmail();
        paidByDto.firstName = expense.getPaidBy().getFirstName();
        paidByDto.lastName = expense.getPaidBy().getLastName();
        response.paidBy = paidByDto;

        // Map household
        HouseholdResponse householdResponse = new HouseholdResponse();
        householdResponse.id = expense.getHousehold().getId();
        householdResponse.name = expense.getHousehold().getName();
        response.household = householdResponse;

        response.receiptUrl = expense.getReceiptUrl();
        response.tags = expense.getTags();
        response.createdAt = expense.getCreatedAt();
        response.updatedAt = expense.getUpdatedAt();

        // Map splits
        if (expense.getSplits() != null) {
            response.splits = expense.getSplits().stream()
                    .map(this::mapSplitToResponse)
                    .collect(Collectors.toList());
        }

        return response;
    }

    private ExpenseSplitResponse mapSplitToResponse(ExpenseSplit split) {
        ExpenseSplitResponse response = new ExpenseSplitResponse();
        response.id = split.getId();
        response.amount = split.getAmount();
        response.percentage = split.getPercentage();
        
        UserDto userDto = new UserDto();
        userDto.id = split.getUser().getId();
        userDto.email = split.getUser().getEmail();
        userDto.firstName = split.getUser().getFirstName();
        userDto.lastName = split.getUser().getLastName();
        response.user = userDto;
        
        response.status = split.getStatus().name();
        return response;
    }
}
