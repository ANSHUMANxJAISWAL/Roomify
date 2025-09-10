package com.roomify.repository;

import com.roomify.entity.Notification;
import com.roomify.entity.NotificationPriority;
import com.roomify.entity.NotificationType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, String> {
    
    List<Notification> findByUserId(String userId);
    
    List<Notification> findByUserIdAndStatus(String userId, boolean read);
    
    List<Notification> findByUserIdAndType(String userId, NotificationType type);
    
    List<Notification> findByUserIdAndPriority(String userId, NotificationPriority priority);
    
    List<Notification> findByHouseholdId(String householdId);
    
    List<Notification> findByHouseholdIdAndStatus(String householdId, boolean read);
    
    List<Notification> findByHouseholdIdAndType(String householdId, NotificationType type);
    
    List<Notification> findByHouseholdIdAndPriority(String householdId, NotificationPriority priority);
    
    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId AND (n.title LIKE %:searchTerm% OR n.message LIKE %:searchTerm%)")
    Page<Notification> findByUserIdAndSearchTerm(@Param("userId") String userId, @Param("searchTerm") String searchTerm, Pageable pageable);
    
    @Query("SELECT n FROM Notification n WHERE n.household.id = :householdId AND (n.title LIKE %:searchTerm% OR n.message LIKE %:searchTerm%)")
    Page<Notification> findByHouseholdIdAndSearchTerm(@Param("householdId") String householdId, @Param("searchTerm") String searchTerm, Pageable pageable);
    
    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId ORDER BY n.createdAt DESC")
    Page<Notification> findByUserIdOrderByCreatedAtDesc(@Param("userId") String userId, Pageable pageable);
    
    @Query("SELECT n FROM Notification n WHERE n.household.id = :householdId ORDER BY n.createdAt DESC")
    Page<Notification> findByHouseholdIdOrderByCreatedAtDesc(@Param("householdId") String householdId, Pageable pageable);
    
    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId AND n.readAt IS NULL ORDER BY n.createdAt DESC")
    Page<Notification> findUnreadByUserIdOrderByCreatedAtDesc(@Param("userId") String userId, Pageable pageable);
    
    @Query("SELECT n FROM Notification n WHERE n.household.id = :householdId AND n.readAt IS NULL ORDER BY n.createdAt DESC")
    Page<Notification> findUnreadByHouseholdIdOrderByCreatedAtDesc(@Param("householdId") String householdId, Pageable pageable);
    
    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId AND n.readAt IS NOT NULL ORDER BY n.readAt DESC")
    Page<Notification> findReadByUserIdOrderByReadAtDesc(@Param("userId") String userId, Pageable pageable);
    
    @Query("SELECT n FROM Notification n WHERE n.household.id = :householdId AND n.readAt IS NOT NULL ORDER BY n.readAt DESC")
    Page<Notification> findReadByHouseholdIdOrderByReadAtDesc(@Param("householdId") String householdId, Pageable pageable);
    
    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId AND n.createdAt >= :startDate")
    List<Notification> findByUserIdAndCreatedAfter(@Param("userId") String userId, @Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT n FROM Notification n WHERE n.household.id = :householdId AND n.createdAt >= :startDate")
    List<Notification> findByHouseholdIdAndCreatedAfter(@Param("householdId") String householdId, @Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId AND n.createdAt BETWEEN :startDate AND :endDate")
    List<Notification> findByUserIdAndCreatedBetween(@Param("userId") String userId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT n FROM Notification n WHERE n.household.id = :householdId AND n.createdAt BETWEEN :startDate AND :endDate")
    List<Notification> findByHouseholdIdAndCreatedBetween(@Param("householdId") String householdId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId AND n.priority IN ('HIGH', 'URGENT') ORDER BY n.createdAt DESC")
    List<Notification> findHighPriorityByUserId(@Param("userId") String userId);
    
    @Query("SELECT n FROM Notification n WHERE n.household.id = :householdId AND n.priority IN ('HIGH', 'URGENT') ORDER BY n.createdAt DESC")
    List<Notification> findHighPriorityByHouseholdId(@Param("householdId") String householdId);
    
    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId AND n.type = :type ORDER BY n.createdAt DESC")
    List<Notification> findByUserIdAndTypeOrderByCreatedAtDesc(@Param("userId") String userId, @Param("type") NotificationType type);
    
    @Query("SELECT n FROM Notification n WHERE n.household.id = :householdId AND n.type = :type ORDER BY n.createdAt DESC")
    List<Notification> findByHouseholdIdAndTypeOrderByCreatedAtDesc(@Param("householdId") String householdId, @Param("type") NotificationType type);
    
    @Query("SELECT n.type, COUNT(n) FROM Notification n WHERE n.user.id = :userId GROUP BY n.type")
    List<Object[]> getTypeCountsByUserId(@Param("userId") String userId);
    
    @Query("SELECT n.priority, COUNT(n) FROM Notification n WHERE n.user.id = :userId GROUP BY n.priority")
    List<Object[]> getPriorityCountsByUserId(@Param("userId") String userId);
    
    @Query("SELECT n.type, COUNT(n) FROM Notification n WHERE n.household.id = :householdId GROUP BY n.type")
    List<Object[]> getTypeCountsByHouseholdId(@Param("householdId") String householdId);
    
    @Query("SELECT n.priority, COUNT(n) FROM Notification n WHERE n.household.id = :householdId GROUP BY n.priority")
    List<Object[]> getPriorityCountsByHouseholdId(@Param("householdId") String householdId);
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.user.id = :userId")
    long countByUserId(@Param("userId") String userId);
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.user.id = :userId AND n.readAt IS NULL")
    long countUnreadByUserId(@Param("userId") String userId);
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.user.id = :userId AND n.readAt IS NOT NULL")
    long countReadByUserId(@Param("userId") String userId);
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.household.id = :householdId")
    long countByHouseholdId(@Param("householdId") String householdId);
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.household.id = :householdId AND n.readAt IS NULL")
    long countUnreadByHouseholdId(@Param("householdId") String householdId);
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.household.id = :householdId AND n.readAt IS NOT NULL")
    long countReadByHouseholdId(@Param("householdId") String householdId);
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.user.id = :userId AND n.type = :type")
    long countByUserIdAndType(@Param("userId") String userId, @Param("type") NotificationType type);
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.household.id = :householdId AND n.type = :type")
    long countByHouseholdIdAndType(@Param("householdId") String householdId, @Param("type") NotificationType type);
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.user.id = :userId AND n.priority = :priority")
    long countByUserIdAndPriority(@Param("userId") String userId, @Param("priority") NotificationPriority priority);
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.household.id = :householdId AND n.priority = :priority")
    long countByHouseholdIdAndPriority(@Param("householdId") String householdId, @Param("priority") NotificationPriority priority);
    
    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId AND n.createdAt >= :startDate ORDER BY n.createdAt DESC")
    Page<Notification> findRecentByUserId(@Param("userId") String userId, @Param("startDate") LocalDateTime startDate, Pageable pageable);
    
    @Query("SELECT n FROM Notification n WHERE n.household.id = :householdId AND n.createdAt >= :startDate ORDER BY n.createdAt DESC")
    Page<Notification> findRecentByHouseholdId(@Param("householdId") String householdId, @Param("startDate") LocalDateTime startDate, Pageable pageable);
}
