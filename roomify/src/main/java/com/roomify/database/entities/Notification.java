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
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications", indexes = {
    @Index(name = "idx_notification_user", columnList = "user_id"),
    @Index(name = "idx_notification_household", columnList = "household_id"),
    @Index(name = "idx_notification_created_at", columnList = "created_at"),
    @Index(name = "idx_notification_read", columnList = "read_at")
})
public class Notification {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    @Column(nullable = false, length = 200)
    private String title;
    
    @Size(max = 1000, message = "Message must not exceed 1000 characters")
    @Column(length = 1000)
    private String message;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationType type;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationPriority priority = NotificationPriority.MEDIUM;
    
    @Column(name = "read_at")
    private LocalDateTime readAt;
    
    @Column(name = "action_url")
    private String actionUrl;
    
    @Column(name = "action_text")
    private String actionText;
    
    @Column(name = "icon")
    private String icon;
    
    @Column(name = "data")
    private String data; // JSON string for additional data
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationStatus status = NotificationStatus.UNREAD;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "household_id", nullable = false)
    private Household household;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at", nullable = false)
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    // Constructors
    public Notification() {}
    
    public Notification(String title, String message, NotificationType type, User user, Household household) {
        this.title = title;
        this.message = message;
        this.type = type;
        this.user = user;
        this.household = household;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public NotificationType getType() { return type; }
    public void setType(NotificationType type) { this.type = type; }
    
    public NotificationPriority getPriority() { return priority; }
    public void setPriority(NotificationPriority priority) { this.priority = priority; }
    
    public LocalDateTime getReadAt() { return readAt; }
    public void setReadAt(LocalDateTime readAt) { this.readAt = readAt; }
    
    public NotificationStatus getStatus() { return status; }
    public void setStatus(NotificationStatus status) { this.status = status; }
    
    public String getActionUrl() { return actionUrl; }
    public void setActionUrl(String actionUrl) { this.actionUrl = actionUrl; }
    
    public String getActionText() { return actionText; }
    public void setActionText(String actionText) { this.actionText = actionText; }
    
    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
    
    public String getData() { return data; }
    public void setData(String data) { this.data = data; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public Household getHousehold() { return household; }
    public void setHousehold(Household household) { this.household = household; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    // Helper methods
    public boolean isRead() {
        return readAt != null;
    }
    
    public boolean isUnread() {
        return readAt == null;
    }
    
    public void markAsRead() {
        this.readAt = LocalDateTime.now();
    }
    
    public void markAsUnread() {
        this.readAt = null;
    }
    
    public boolean hasAction() {
        return actionUrl != null && !actionUrl.trim().isEmpty();
    }
    
    public boolean isHighPriority() {
        return priority == NotificationPriority.HIGH || priority == NotificationPriority.URGENT;
    }
    
    // toString, equals, hashCode
    @Override
    public String toString() {
        return "Notification{" +
                "id='" + id + '\'' +
                ", title='" + title + '\'' +
                ", type=" + type +
                ", priority=" + priority +
                ", read=" + isRead() +
                ", createdAt=" + createdAt +
                '}';
    }
}

