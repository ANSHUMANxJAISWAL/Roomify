package com.roomify.database.entities;

import com.roomify.database.enums.ExpenseSplitStatus;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "expense_splits", indexes = {
    @Index(name = "idx_expense_split_expense", columnList = "expense_id"),
    @Index(name = "idx_expense_split_user", columnList = "user_id"),
    @Index(name = "idx_expense_split_status", columnList = "status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseSplit extends BaseEntity {

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "expense_id", nullable = false)
    private Expense expense;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull
    @DecimalMin(value = "0.00")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @DecimalMin(value = "0.00")
    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal percentage;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ExpenseSplitStatus status = ExpenseSplitStatus.PENDING;
}
