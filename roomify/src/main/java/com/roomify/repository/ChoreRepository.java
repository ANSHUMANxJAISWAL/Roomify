package com.roomify.repository;

import com.roomify.entity.Chore;
import com.roomify.entity.ChorePriority;
import com.roomify.entity.ChoreStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ChoreRepository extends JpaRepository<Chore, String> {
    
    List<Chore> findByHouseholdId(String householdId);
    
    List<Chore> findByHouseholdIdAndStatus(String householdId, ChoreStatus status);
    
    List<Chore> findByAssignedToId(String assignedToId);
    
    List<Chore> findByHouseholdIdAndAssignedToId(String householdId, String assignedToId);
    
    List<Chore> findByHouseholdIdAndPriority(String householdId, ChorePriority priority);
    
    List<Chore> findByHouseholdIdAndDueDateBetween(String householdId, LocalDate startDate, LocalDate endDate);
    
    List<Chore> findByHouseholdIdAndStatusAndDueDateBetween(String householdId, ChoreStatus status, LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT c FROM Chore c WHERE c.household.id = :householdId AND (c.title LIKE %:searchTerm% OR c.description LIKE %:searchTerm%)")
    Page<Chore> findByHouseholdIdAndSearchTerm(@Param("householdId") String householdId, @Param("searchTerm") String searchTerm, Pageable pageable);
    
    @Query("SELECT c FROM Chore c WHERE c.household.id = :householdId AND c.status = :status AND (c.title LIKE %:searchTerm% OR c.description LIKE %:searchTerm%)")
    Page<Chore> findByHouseholdIdAndStatusAndSearchTerm(@Param("householdId") String householdId, @Param("status") ChoreStatus status, @Param("searchTerm") String searchTerm, Pageable pageable);
    
    @Query("SELECT c FROM Chore c WHERE c.household.id = :householdId ORDER BY c.dueDate ASC")
    Page<Chore> findByHouseholdIdOrderByDueDateAsc(@Param("householdId") String householdId, Pageable pageable);
    
    @Query("SELECT c FROM Chore c WHERE c.household.id = :householdId ORDER BY c.dueDate DESC")
    Page<Chore> findByHouseholdIdOrderByDueDateDesc(@Param("householdId") String householdId, Pageable pageable);
    
    @Query("SELECT c FROM Chore c WHERE c.household.id = :householdId ORDER BY c.priority DESC, c.dueDate ASC")
    Page<Chore> findByHouseholdIdOrderByPriorityAndDueDate(@Param("householdId") String householdId, Pageable pageable);
    
    @Query("SELECT c FROM Chore c WHERE c.household.id = :householdId ORDER BY c.createdAt DESC")
    Page<Chore> findByHouseholdIdOrderByCreatedAtDesc(@Param("householdId") String householdId, Pageable pageable);
    
    @Query("SELECT c FROM Chore c WHERE c.assignedTo.id = :userId ORDER BY c.dueDate ASC")
    Page<Chore> findByAssignedToOrderByDueDateAsc(@Param("userId") String userId, Pageable pageable);
    
    @Query("SELECT c FROM Chore c WHERE c.assignedTo.id = :userId AND c.status = :status ORDER BY c.dueDate ASC")
    Page<Chore> findByAssignedToAndStatusOrderByDueDateAsc(@Param("userId") String userId, @Param("status") ChoreStatus status, Pageable pageable);
    
    @Query("SELECT c FROM Chore c WHERE c.household.id = :householdId AND c.dueDate < :today AND c.status = 'PENDING'")
    List<Chore> findOverdueChoresByHouseholdId(@Param("householdId") String householdId, @Param("today") LocalDate today);
    
    @Query("SELECT c FROM Chore c WHERE c.assignedTo.id = :userId AND c.dueDate < :today AND c.status = 'PENDING'")
    List<Chore> findOverdueChoresByAssignedTo(@Param("userId") String userId, @Param("today") LocalDate today);
    
    @Query("SELECT c FROM Chore c WHERE c.household.id = :householdId AND c.dueDate BETWEEN :startDate AND :endDate")
    List<Chore> findChoresByHouseholdIdAndDateRange(@Param("householdId") String householdId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT c FROM Chore c WHERE c.household.id = :householdId AND c.status = 'COMPLETED' ORDER BY c.completedAt DESC")
    List<Chore> findCompletedChoresByHouseholdId(@Param("householdId") String householdId);
    
    @Query("SELECT c FROM Chore c WHERE c.assignedTo.id = :userId AND c.status = 'COMPLETED' ORDER BY c.completedAt DESC")
    List<Chore> findCompletedChoresByAssignedTo(@Param("userId") String userId);
    
    @Query("SELECT c.status, COUNT(c) FROM Chore c WHERE c.household.id = :householdId GROUP BY c.status")
    List<Object[]> getStatusCountsByHouseholdId(@Param("householdId") String householdId);
    
    @Query("SELECT c.priority, COUNT(c) FROM Chore c WHERE c.household.id = :householdId GROUP BY c.priority")
    List<Object[]> getPriorityCountsByHouseholdId(@Param("householdId") String householdId);
    
    @Query("SELECT c.frequency, COUNT(c) FROM Chore c WHERE c.household.id = :householdId GROUP BY c.frequency")
    List<Object[]> getFrequencyCountsByHouseholdId(@Param("householdId") String householdId);
    
    @Query("SELECT COUNT(c) FROM Chore c WHERE c.household.id = :householdId")
    long countByHouseholdId(@Param("householdId") String householdId);
    
    @Query("SELECT COUNT(c) FROM Chore c WHERE c.household.id = :householdId AND c.status = :status")
    long countByHouseholdIdAndStatus(@Param("householdId") String householdId, @Param("status") ChoreStatus status);
    
    @Query("SELECT COUNT(c) FROM Chore c WHERE c.assignedTo.id = :userId")
    long countByAssignedTo(@Param("userId") String userId);
    
    @Query("SELECT COUNT(c) FROM Chore c WHERE c.assignedTo.id = :userId AND c.status = :status")
    long countByAssignedToAndStatus(@Param("userId") String userId, @Param("status") ChoreStatus status);
    
    @Query("SELECT c FROM Chore c WHERE c.household.id = :householdId AND c.status = 'PENDING' ORDER BY c.priority DESC, c.dueDate ASC")
    List<Chore> findPendingChoresByHouseholdIdOrderedByPriority(@Param("householdId") String householdId);
    
    @Query("SELECT c FROM Chore c WHERE c.household.id = :householdId AND c.status = 'POSTPONED' ORDER BY c.postponedTo ASC")
    List<Chore> findPostponedChoresByHouseholdId(@Param("householdId") String householdId);
}
