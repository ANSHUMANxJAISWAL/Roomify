package com.roomify.database.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications", indexes = {
    @Index(name = "idx_notification_user", columnList = "user_id"),
    @Index(name = "idx_notification_household", columnList = "household_id"),
    @Index(name = "idx_notification_type", columnList = "type"),
    @Index(name = "idx_notification_priority", columnList = "priority"),
    @Index(name = "idx_notification_read", columnList = "read_at")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Notification extends BaseEntity {

    @NotBlank
    @Column(nullable = false)
    private String title;

    @NotBlank
    @Column(nullable = false, length = 1000)
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private NotificationType type = NotificationType.SYSTEM_UPDATE;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private NotificationPriority priority = NotificationPriority.MEDIUM;

    @Column
    private LocalDateTime readAt;

    @Column
    private String actionUrl;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "household_id")
    private Household household;

    // Helper method to check if notification is read
    public boolean isRead() {
        return readAt != null;
    }
}
