package com.roomify.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "chores", indexes = {
    @Index(name = "idx_chore_household", columnList = "household_id"),
    @Index(name = "idx_chore_assigned_to", columnList = "assigned_to"),
    @Index(name = "idx_chore_due_date", columnList = "due_date"),
    @Index(name = "idx_chore_status", columnList = "status")
})
public class Chore {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    @Column(nullable = false, length = 200)
    private String title;
    
    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    @Column(length = 1000)
    private String description;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to", nullable = false)
    private User assignedTo;
    
    @NotNull(message = "Due date is required")
    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ChoreStatus status = ChoreStatus.PENDING;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ChorePriority priority = ChorePriority.MEDIUM;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ChoreFrequency frequency;
    
    @Column(name = "estimated_duration_minutes")
    private Integer estimatedDurationMinutes;
    
    @Column(name = "points")
    private Integer points = 0;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "household_id", nullable = false)
    private Household household;
    
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "completed_by")
    private User completedBy;
    
    @Column(name = "postponed_to")
    private LocalDate postponedTo;
    
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
    public Chore() {}
    
    public Chore(String title, String description, User assignedTo, LocalDate dueDate, ChoreFrequency frequency, Household household) {
        this.title = title;
        this.description = description;
        this.assignedTo = assignedTo;
        this.dueDate = dueDate;
        this.frequency = frequency;
        this.household = household;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public User getAssignedTo() { return assignedTo; }
    public void setAssignedTo(User assignedTo) { this.assignedTo = assignedTo; }
    
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
    
    public ChoreStatus getStatus() { return status; }
    public void setStatus(ChoreStatus status) { this.status = status; }
    
    public ChorePriority getPriority() { return priority; }
    public void setPriority(ChorePriority priority) { this.priority = priority; }
    
    public ChoreFrequency getFrequency() { return frequency; }
    public void setFrequency(ChoreFrequency frequency) { this.frequency = frequency; }
    
    public Integer getEstimatedDurationMinutes() { return estimatedDurationMinutes; }
    public void setEstimatedDurationMinutes(Integer estimatedDurationMinutes) { this.estimatedDurationMinutes = estimatedDurationMinutes; }
    
    public Integer getPoints() { return points; }
    public void setPoints(Integer points) { this.points = points; }
    
    public Household getHousehold() { return household; }
    public void setHousehold(Household household) { this.household = household; }
    
    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
    
    public User getCompletedBy() { return completedBy; }
    public void setCompletedBy(User completedBy) { this.completedBy = completedBy; }
    
    public LocalDate getPostponedTo() { return postponedTo; }
    public void setPostponedTo(LocalDate postponedTo) { this.postponedTo = postponedTo; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    // Removed getters/setters for complex relationships
    
    // Helper methods
    public boolean isCompleted() {
        return status == ChoreStatus.COMPLETED;
    }
    
    public boolean isPending() {
        return status == ChoreStatus.PENDING;
    }
    
    public boolean isOverdue() {
        return status == ChoreStatus.PENDING && dueDate.isBefore(LocalDate.now());
    }
    
    public boolean isPostponed() {
        return status == ChoreStatus.POSTPONED && postponedTo != null;
    }
    
    public void complete(User completedBy) {
        this.status = ChoreStatus.COMPLETED;
        this.completedBy = completedBy;
        this.completedAt = LocalDateTime.now();
    }
    
    public void postpone(LocalDate newDueDate) {
        this.status = ChoreStatus.POSTPONED;
        this.postponedTo = newDueDate;
    }
    
    public void reassign(User newAssignee) {
        this.assignedTo = newAssignee;
        this.status = ChoreStatus.PENDING;
        this.completedAt = null;
        this.completedBy = null;
        this.postponedTo = null;
    }
    
    // toString, equals, hashCode
    @Override
    public String toString() {
        return "Chore{" +
                "id='" + id + '\'' +
                ", title='" + title + '\'' +
                ", status=" + status +
                ", priority=" + priority +
                ", dueDate=" + dueDate +
                ", assignedTo=" + (assignedTo != null ? assignedTo.getUsername() : "null") +
                '}';
    }
}
