package com.roomify.database.repositories;

import com.roomify.database.entities.Reminder;
import com.roomify.database.entities.ReminderPriority;
import com.roomify.database.entities.ReminderStatus;
import com.roomify.database.entities.ReminderType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReminderRepository extends JpaRepository<com.roomify.database.entities.Reminder, String> {
    
    List<Reminder> findByUserId(String userId);
    
    List<Reminder> findByUserIdAndStatus(String userId, ReminderStatus status);
    
    List<Reminder> findByHouseholdId(String householdId);
    
    List<Reminder> findByHouseholdIdAndStatus(String householdId, ReminderStatus status);
    
    List<Reminder> findByAssignedToId(String assignedToId);
    
    List<Reminder> findByHouseholdIdAndAssignedToId(String householdId, String assignedToId);
    
    List<Reminder> findByHouseholdIdAndType(String householdId, ReminderType type);
    
    List<Reminder> findByHouseholdIdAndPriority(String householdId, ReminderPriority priority);
    
    List<Reminder> findByHouseholdIdAndDueDateBetween(String householdId, LocalDateTime startDate, LocalDateTime endDate);
    
    List<Reminder> findByHouseholdIdAndStatusAndDueDateBetween(String householdId, ReminderStatus status, LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT r FROM Reminder r WHERE r.household.id = :householdId AND (r.title LIKE %:searchTerm% OR r.description LIKE %:searchTerm%)")
    Page<Reminder> findByHouseholdIdAndSearchTerm(@Param("householdId") String householdId, @Param("searchTerm") String searchTerm, Pageable pageable);
    
    @Query("SELECT r FROM Reminder r WHERE r.household.id = :householdId AND r.status = :status AND (r.title LIKE %:searchTerm% OR r.description LIKE %:searchTerm%)")
    Page<Reminder> findByHouseholdIdAndStatusAndSearchTerm(@Param("householdId") String householdId, @Param("status") ReminderStatus status, @Param("searchTerm") String searchTerm, Pageable pageable);
    
    @Query("SELECT r FROM Reminder r WHERE r.user.id = :userId AND (r.title LIKE %:searchTerm% OR r.description LIKE %:searchTerm%)")
    Page<Reminder> findByUserIdAndSearchTerm(@Param("userId") String userId, @Param("searchTerm") String searchTerm, Pageable pageable);
    
    @Query("SELECT r FROM Reminder r WHERE r.household.id = :householdId ORDER BY r.dueDate ASC")
    Page<Reminder> findByHouseholdIdOrderByDueDateAsc(@Param("householdId") String householdId, Pageable pageable);
    
    @Query("SELECT r FROM Reminder r WHERE r.household.id = :householdId ORDER BY r.dueDate DESC")
    Page<Reminder> findByHouseholdIdOrderByDueDateDesc(@Param("householdId") String householdId, Pageable pageable);
    
    @Query("SELECT r FROM Reminder r WHERE r.household.id = :householdId ORDER BY r.priority DESC, r.dueDate ASC")
    Page<Reminder> findByHouseholdIdOrderByPriorityAndDueDate(@Param("householdId") String householdId, Pageable pageable);
    
    @Query("SELECT r FROM Reminder r WHERE r.user.id = :userId ORDER BY r.dueDate ASC")
    Page<Reminder> findByUserIdOrderByDueDateAsc(@Param("userId") String userId, Pageable pageable);
    
    @Query("SELECT r FROM Reminder r WHERE r.user.id = :userId AND r.status = :status ORDER BY r.dueDate ASC")
    Page<Reminder> findByUserIdAndStatusOrderByDueDateAsc(@Param("userId") String userId, @Param("status") ReminderStatus status, Pageable pageable);
    
    @Query("SELECT r FROM Reminder r WHERE r.household.id = :householdId AND r.dueDate < :now AND r.status = 'PENDING'")
    List<Reminder> findOverdueRemindersByHouseholdId(@Param("householdId") String householdId, @Param("now") LocalDateTime now);
    
    @Query("SELECT r FROM Reminder r WHERE r.user.id = :userId AND r.dueDate < :now AND r.status = 'PENDING'")
    List<Reminder> findOverdueRemindersByUserId(@Param("userId") String userId, @Param("now") LocalDateTime now);
    
    @Query("SELECT r FROM Reminder r WHERE r.household.id = :householdId AND r.dueDate BETWEEN :startDate AND :endDate")
    List<Reminder> findRemindersByHouseholdIdAndDateRange(@Param("householdId") String householdId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT r FROM Reminder r WHERE r.user.id = :userId AND r.dueDate BETWEEN :startDate AND :endDate")
    List<Reminder> findRemindersByUserIdAndDateRange(@Param("userId") String userId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT r FROM Reminder r WHERE r.household.id = :householdId AND r.status = 'COMPLETED' ORDER BY r.completedAt DESC")
    List<Reminder> findCompletedRemindersByHouseholdId(@Param("householdId") String householdId);
    
    @Query("SELECT r FROM Reminder r WHERE r.user.id = :userId AND r.status = 'COMPLETED' ORDER BY r.completedAt DESC")
    List<Reminder> findCompletedRemindersByUserId(@Param("userId") String userId);
    
    @Query("SELECT r FROM Reminder r WHERE r.household.id = :householdId AND r.status = 'DISMISSED' ORDER BY r.dismissedAt DESC")
    List<Reminder> findDismissedRemindersByHouseholdId(@Param("householdId") String householdId);
    
    @Query("SELECT r FROM Reminder r WHERE r.user.id = :userId AND r.status = 'DISMISSED' ORDER BY r.dismissedAt DESC")
    List<Reminder> findDismissedRemindersByUserId(@Param("userId") String userId);
    
    @Query("SELECT r FROM Reminder r WHERE r.household.id = :householdId AND r.status = 'SNOOZED' AND r.snoozedUntil > :now ORDER BY r.snoozedUntil ASC")
    List<Reminder> findSnoozedRemindersByHouseholdId(@Param("householdId") String householdId, @Param("now") LocalDateTime now);
    
    @Query("SELECT r FROM Reminder r WHERE r.user.id = :userId AND r.status = 'SNOOZED' AND r.snoozedUntil > :now ORDER BY r.snoozedUntil ASC")
    List<Reminder> findSnoozedRemindersByUserId(@Param("userId") String userId, @Param("now") LocalDateTime now);
    
    @Query("SELECT r.status, COUNT(r) FROM Reminder r WHERE r.household.id = :householdId GROUP BY r.status")
    List<Object[]> getStatusCountsByHouseholdId(@Param("householdId") String householdId);
    
    @Query("SELECT r.priority, COUNT(r) FROM Reminder r WHERE r.household.id = :householdId GROUP BY r.priority")
    List<Object[]> getPriorityCountsByHouseholdId(@Param("householdId") String householdId);
    
    @Query("SELECT r.type, COUNT(r) FROM Reminder r WHERE r.household.id = :householdId GROUP BY r.type")
    List<Object[]> getTypeCountsByHouseholdId(@Param("householdId") String householdId);
    
    @Query("SELECT r.status, COUNT(r) FROM Reminder r WHERE r.user.id = :userId GROUP BY r.status")
    List<Object[]> getStatusCountsByUserId(@Param("userId") String userId);
    
    @Query("SELECT r.priority, COUNT(r) FROM Reminder r WHERE r.user.id = :userId GROUP BY r.priority")
    List<Object[]> getPriorityCountsByUserId(@Param("userId") String userId);
    
    @Query("SELECT r.type, COUNT(r) FROM Reminder r WHERE r.user.id = :userId GROUP BY r.type")
    List<Object[]> getTypeCountsByUserId(@Param("userId") String userId);
    
    @Query("SELECT COUNT(r) FROM Reminder r WHERE r.household.id = :householdId")
    long countByHouseholdId(@Param("householdId") String householdId);
    
    @Query("SELECT COUNT(r) FROM Reminder r WHERE r.household.id = :householdId AND r.status = :status")
    long countByHouseholdIdAndStatus(@Param("householdId") String householdId, @Param("status") ReminderStatus status);
    
    @Query("SELECT COUNT(r) FROM Reminder r WHERE r.user.id = :userId")
    long countByUserId(@Param("userId") String userId);
    
    @Query("SELECT COUNT(r) FROM Reminder r WHERE r.user.id = :userId AND r.status = :status")
    long countByUserIdAndStatus(@Param("userId") String userId, @Param("status") ReminderStatus status);
    
    @Query("SELECT r FROM Reminder r WHERE r.household.id = :householdId AND r.status = 'PENDING' ORDER BY r.priority DESC, r.dueDate ASC")
    List<Reminder> findPendingRemindersByHouseholdIdOrderedByPriority(@Param("householdId") String householdId);
    
    @Query("SELECT r FROM Reminder r WHERE r.user.id = :userId AND r.status = 'PENDING' ORDER BY r.priority DESC, r.dueDate ASC")
    List<Reminder> findPendingRemindersByUserIdOrderedByPriority(@Param("userId") String userId);
    
    @Query("SELECT r FROM Reminder r WHERE r.household.id = :householdId AND r.isAI = true ORDER BY r.createdAt DESC")
    List<Reminder> findAIRemindersByHouseholdId(@Param("householdId") String householdId);
    
    @Query("SELECT r FROM Reminder r WHERE r.user.id = :userId AND r.isAI = true ORDER BY r.createdAt DESC")
    List<Reminder> findAIRemindersByUserId(@Param("userId") String userId);
}
