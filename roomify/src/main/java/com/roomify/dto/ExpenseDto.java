package com.roomify.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.roomify.database.entities.ExpenseCategory;
import com.roomify.database.entities.ExpenseStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class ExpenseDto {
    private String id;
    private String title;
    private String description;
    private BigDecimal amount;
    private ExpenseCategory category;
    private ExpenseStatus status;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate paidDate;
    
    private String paidById;
    private String paidByName;
    private String createdById;
    private String createdByName;
    private String householdId;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;
    
    public ExpenseDto() {}
    
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    
    public ExpenseCategory getCategory() { return category; }
    public void setCategory(ExpenseCategory category) { this.category = category; }
    
    public ExpenseStatus getStatus() { return status; }
    public void setStatus(ExpenseStatus status) { this.status = status; }
    
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    
    public LocalDate getPaidDate() { return paidDate; }
    public void setPaidDate(LocalDate paidDate) { this.paidDate = paidDate; }
    
    public String getPaidById() { return paidById; }
    public void setPaidById(String paidById) { this.paidById = paidById; }
    
    public String getPaidByName() { return paidByName; }
    public void setPaidByName(String paidByName) { this.paidByName = paidByName; }
    
    public String getCreatedById() { return createdById; }
    public void setCreatedById(String createdById) { this.createdById = createdById; }
    
    public String getCreatedByName() { return createdByName; }
    public void setCreatedByName(String createdByName) { this.createdByName = createdByName; }
    
    public String getHouseholdId() { return householdId; }
    public void setHouseholdId(String householdId) { this.householdId = householdId; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
