package com.roomify.database.repositories;

import com.roomify.database.entities.Notification;
import com.roomify.database.entities.NotificationType;
import com.roomify.database.entities.NotificationPriority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, String> {

    List<Notification> findByUserId(String userId);

    List<Notification> findByHouseholdId(String householdId);

    List<Notification> findByType(NotificationType type);

    List<Notification> findByPriority(NotificationPriority priority);

    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId AND n.readAt IS NULL")
    List<Notification> findUnreadByUserId(@Param("userId") String userId);

    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId AND n.household.id = :householdId")
    List<Notification> findByUserIdAndHouseholdId(@Param("userId") String userId, @Param("householdId") String householdId);

    @Query("SELECT n FROM Notification n WHERE n.household.id = :householdId AND n.createdAt >= :since")
    List<Notification> findByHouseholdIdSince(@Param("householdId") String householdId, @Param("since") LocalDateTime since);

    @Query("SELECT COUNT(n) FROM Notification n WHERE n.user.id = :userId AND n.readAt IS NULL")
    long countUnreadByUserId(@Param("userId") String userId);
}
