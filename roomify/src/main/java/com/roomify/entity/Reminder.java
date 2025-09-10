package com.roomify.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "reminders", indexes = {
    @Index(name = "idx_reminder_user", columnList = "user_id"),
    @Index(name = "idx_reminder_household", columnList = "household_id"),
    @Index(name = "idx_reminder_due_date", columnList = "due_date"),
    @Index(name = "idx_reminder_status", columnList = "status")
})
public class Reminder {
    
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
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReminderType type;
    
    @NotNull(message = "Due date is required")
    @Column(name = "due_date", nullable = false)
    private LocalDateTime dueDate;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReminderPriority priority = ReminderPriority.MEDIUM;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReminderStatus status = ReminderStatus.PENDING;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to")
    private User assignedTo;
    
    @Column(name = "amount")
    private BigDecimal amount;
    
    @Column(name = "category")
    private String category;
    
    @Column(name = "recurrence")
    private String recurrence;
    
    @Column(name = "tone")
    private String tone;
    
    @Column(name = "custom_tone")
    private String customTone;
    
    @Column(name = "is_ai")
    private boolean isAI = false;
    
    @Column(name = "ai_prompt")
    private String aiPrompt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "household_id", nullable = false)
    private Household household;
    
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
    
    @Column(name = "dismissed_at")
    private LocalDateTime dismissedAt;
    
    @Column(name = "snoozed_until")
    private LocalDateTime snoozedUntil;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at", nullable = false)
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    // Removed complex relationships for now
    
    // Constructors
    public Reminder() {}
    
    public Reminder(String title, String description, ReminderType type, LocalDateTime dueDate, User user, Household household) {
        this.title = title;
        this.description = description;
        this.type = type;
        this.dueDate = dueDate;
        this.user = user;
        this.household = household;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public ReminderType getType() { return type; }
    public void setType(ReminderType type) { this.type = type; }
    
    public LocalDateTime getDueDate() { return dueDate; }
    public void setDueDate(LocalDateTime dueDate) { this.dueDate = dueDate; }
    
    public ReminderPriority getPriority() { return priority; }
    public void setPriority(ReminderPriority priority) { this.priority = priority; }
    
    public ReminderStatus getStatus() { return status; }
    public void setStatus(ReminderStatus status) { this.status = status; }
    
    public User getAssignedTo() { return assignedTo; }
    public void setAssignedTo(User assignedTo) { this.assignedTo = assignedTo; }
    
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public String getRecurrence() { return recurrence; }
    public void setRecurrence(String recurrence) { this.recurrence = recurrence; }
    
    public String getTone() { return tone; }
    public void setTone(String tone) { this.tone = tone; }
    
    public String getCustomTone() { return customTone; }
    public void setCustomTone(String customTone) { this.customTone = customTone; }
    
    public boolean isAI() { return isAI; }
    public void setAI(boolean ai) { isAI = ai; }
    
    public String getAiPrompt() { return aiPrompt; }
    public void setAiPrompt(String aiPrompt) { this.aiPrompt = aiPrompt; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public Household getHousehold() { return household; }
    public void setHousehold(Household household) { this.household = household; }
    
    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
    
    public LocalDateTime getDismissedAt() { return dismissedAt; }
    public void setDismissedAt(LocalDateTime dismissedAt) { this.dismissedAt = dismissedAt; }
    
    public LocalDateTime getSnoozedUntil() { return snoozedUntil; }
    public void setSnoozedUntil(LocalDateTime snoozedUntil) { this.snoozedUntil = snoozedUntil; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    // Removed getters/setters for complex relationships
    
    // Helper methods
    public boolean isCompleted() {
        return status == ReminderStatus.COMPLETED;
    }
    
    public boolean isPending() {
        return status == ReminderStatus.PENDING;
    }
    
    public boolean isOverdue() {
        return status == ReminderStatus.PENDING && dueDate.isBefore(LocalDateTime.now());
    }
    
    public boolean isDismissed() {
        return status == ReminderStatus.DISMISSED;
    }
    
    public boolean isSnoozed() {
        return snoozedUntil != null && snoozedUntil.isAfter(LocalDateTime.now());
    }
    
    public void complete() {
        this.status = ReminderStatus.COMPLETED;
        this.completedAt = LocalDateTime.now();
    }
    
    public void dismiss() {
        this.status = ReminderStatus.DISMISSED;
        this.dismissedAt = LocalDateTime.now();
    }
    
    public void snooze(LocalDateTime until) {
        this.snoozedUntil = until;
        this.status = ReminderStatus.PENDING;
    }
    
    public String getEffectiveTone() {
        return customTone != null && !customTone.trim().isEmpty() ? customTone : tone;
    }
    
    // toString, equals, hashCode
    @Override
    public String toString() {
        return "Reminder{" +
                "id='" + id + '\'' +
                ", title='" + title + '\'' +
                ", type=" + type +
                ", status=" + status +
                ", priority=" + priority +
                ", dueDate=" + dueDate +
                ", isAI=" + isAI +
                '}';
    }
}
