package com.roomify.database.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "chores", indexes = {
    @Index(name = "idx_chore_household", columnList = "household_id"),
    @Index(name = "idx_chore_assigned_to", columnList = "assigned_to_id"),
    @Index(name = "idx_chore_assigned_by", columnList = "assigned_by_id"),
    @Index(name = "idx_chore_due_date", columnList = "due_date"),
    @Index(name = "idx_chore_status", columnList = "status"),
    @Index(name = "idx_chore_priority", columnList = "priority")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Chore extends BaseEntity {

    @NotBlank
    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to_id", nullable = false)
    private User assignedTo;

    @NotNull
    @Column(nullable = false)
    private LocalDate dueDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ChoreStatus status = ChoreStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ChorePriority priority = ChorePriority.MEDIUM;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ChoreFrequency frequency = ChoreFrequency.ONE_TIME;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "household_id", nullable = false)
    private Household household;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_by_id", nullable = false)
    private User assignedBy;

    @Column
    private LocalDateTime completedAt;

    @ElementCollection
    @CollectionTable(name = "chore_tags", joinColumns = @JoinColumn(name = "chore_id"))
    @Column(name = "tag")
    private List<String> tags = new ArrayList<>();
}
