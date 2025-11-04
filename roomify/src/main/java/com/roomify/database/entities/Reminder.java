package com.roomify.database.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import com.roomify.database.enums.ExpenseCategory;
import com.roomify.database.enums.ReminderPriority;
import com.roomify.database.enums.ReminderStatus;
import com.roomify.database.enums.ReminderType;
import com.roomify.database.enums.ReminderTone;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "reminders", indexes = {
    @Index(name = "idx_reminder_user", columnList = "user_id"),
    @Index(name = "idx_reminder_household", columnList = "household_id"),
    @Index(name = "idx_reminder_due_date", columnList = "due_date"),
    @Index(name = "idx_reminder_type", columnList = "type"),
    @Index(name = "idx_reminder_status", columnList = "status"),
    @Index(name = "idx_reminder_priority", columnList = "priority")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Reminder extends BaseEntity {

    @NotBlank
    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReminderType type = ReminderType.CUSTOM;

    @NotNull
    @Column(nullable = false)
    private LocalDate dueDate;

    @Column
    private LocalTime dueTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReminderPriority priority = ReminderPriority.MEDIUM;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReminderStatus status = ReminderStatus.PENDING;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to_id", nullable = false)
    private User assignedTo;

    @DecimalMin(value = "0.00")
    @Column(precision = 10, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column
    private ExpenseCategory category;

    @Embedded
    private ReminderRecurrence recurrence;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReminderTone tone = ReminderTone.FRIENDLY;

    @Column(nullable = false)
    private Boolean isAI = false;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "household_id")
    private Household household;

    @ElementCollection
    @CollectionTable(name = "reminder_tags", joinColumns = @JoinColumn(name = "reminder_id"))
    @Column(name = "tag")
    private List<String> tags = new ArrayList<>();
}
