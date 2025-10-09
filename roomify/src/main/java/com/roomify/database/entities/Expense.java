package com.roomify.database.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Index;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.CascadeType;
import jakarta.persistence.FetchType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "expenses", indexes = {
    @Index(name = "idx_expense_household", columnList = "household_id"),
    @Index(name = "idx_expense_date", columnList = "date"),
    @Index(name = "idx_expense_category", columnList = "category")
})
public class Expense {
    
    @Id
    @Column(name = "id", nullable = false)
    private String id;
    
    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    @Column(nullable = false, length = 200)
    private String title;
    
    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    @Column(length = 1000)
    private String description;
    
    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;
    
    @NotNull(message = "Date is required")
    @Column(nullable = false)
    private LocalDate date;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ExpenseCategory category;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "paid_by", nullable = false)
    private User paidBy;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "household_id", nullable = false)
    private Household household;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ExpenseStatus status = ExpenseStatus.PENDING;
    
    @Column(name = "receipt_url")
    private String receiptUrl;
    
    @Column(name = "notes")
    private String notes;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at", nullable = false)
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    // Removed complex relationships for now
    
    // Constructors
    public Expense() {}
    
    public Expense(String title, BigDecimal amount, LocalDate date, ExpenseCategory category, User paidBy, Household household) {
        this.title = title;
        this.amount = amount;
        this.date = date;
        this.category = category;
        this.paidBy = paidBy;
        this.household = household;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    
    public ExpenseCategory getCategory() { return category; }
    public void setCategory(ExpenseCategory category) { this.category = category; }
    
    public User getPaidBy() { return paidBy; }
    public void setPaidBy(User paidBy) { this.paidBy = paidBy; }
    
    public Household getHousehold() { return household; }
    public void setHousehold(Household household) { this.household = household; }
    
    public ExpenseStatus getStatus() { return status; }
    public void setStatus(ExpenseStatus status) { this.status = status; }
    
    public String getReceiptUrl() { return receiptUrl; }
    public void setReceiptUrl(String receiptUrl) { this.receiptUrl = receiptUrl; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    // Helper methods
    public boolean isSettled() {
        return status == ExpenseStatus.SETTLED;
    }
    
    public boolean isPending() {
        return status == ExpenseStatus.PENDING;
    }
    
    // toString, equals, hashCode
    @Override
    public String toString() {
        return "Expense{" +
                "id='" + id + '\'' +
                ", title='" + title + '\'' +
                ", amount=" + amount +
                ", date=" + date +
                ", category=" + category +
                ", status=" + status +
                ", paidBy=" + (paidBy != null ? paidBy.getUsername() : "null") +
                '}';
    }
}

