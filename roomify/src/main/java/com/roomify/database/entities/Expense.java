package com.roomify.database.entities;

import com.roomify.database.enums.ExpenseCategory;
import com.roomify.database.enums.ExpenseStatus;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "expenses", indexes = {
    @Index(name = "idx_expense_household", columnList = "household_id"),
    @Index(name = "idx_expense_paid_by", columnList = "paid_by_id"),
    @Index(name = "idx_expense_date", columnList = "date"),
    @Index(name = "idx_expense_category", columnList = "category"),
    @Index(name = "idx_expense_status", columnList = "status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Expense extends BaseEntity {

    @NotBlank
    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    @NotNull
    @DecimalMin(value = "0.01")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @NotBlank
    @Column(nullable = false)
    private String currency;

    @NotNull
    @Column(nullable = false)
    private LocalDate date;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ExpenseCategory category = ExpenseCategory.OTHER;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ExpenseStatus status = ExpenseStatus.PENDING;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "paid_by_id", nullable = false)
    private User paidBy;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "household_id", nullable = false)
    private Household household;

    @Column
    private String receiptUrl;

    @ElementCollection
    @CollectionTable(name = "expense_tags", joinColumns = @JoinColumn(name = "expense_id"))
    @Column(name = "tag")
    private List<String> tags = new ArrayList<>();

    @OneToMany(mappedBy = "expense", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ExpenseSplit> splits = new ArrayList<>();
}
