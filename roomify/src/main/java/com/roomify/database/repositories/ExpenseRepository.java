package com.roomify.database.repositories;

import com.roomify.database.entities.Expense;
import com.roomify.database.entities.ExpenseCategory;
import com.roomify.database.entities.ExpenseStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<com.roomify.database.entities.Expense, String> {
    
    List<Expense> findByHouseholdId(String householdId);
    
    List<Expense> findByHouseholdIdAndStatus(String householdId, ExpenseStatus status);
    
    List<Expense> findByPaidById(String paidById);
    
    List<Expense> findByHouseholdIdAndPaidById(String householdId, String paidById);
    
    List<Expense> findByHouseholdIdAndCategory(String householdId, ExpenseCategory category);
    
    List<Expense> findByHouseholdIdAndDateBetween(String householdId, LocalDate startDate, LocalDate endDate);
    
    List<Expense> findByHouseholdIdAndStatusAndDateBetween(String householdId, ExpenseStatus status, LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT e FROM Expense e WHERE e.household.id = :householdId AND e.title LIKE %:searchTerm% OR e.description LIKE %:searchTerm%")
    Page<Expense> findByHouseholdIdAndSearchTerm(@Param("householdId") String householdId, @Param("searchTerm") String searchTerm, Pageable pageable);
    
    @Query("SELECT e FROM Expense e WHERE e.household.id = :householdId AND e.category = :category AND (e.title LIKE %:searchTerm% OR e.description LIKE %:searchTerm%)")
    Page<Expense> findByHouseholdIdAndCategoryAndSearchTerm(@Param("householdId") String householdId, @Param("category") ExpenseCategory category, @Param("searchTerm") String searchTerm, Pageable pageable);
    
    @Query("SELECT e FROM Expense e WHERE e.household.id = :householdId ORDER BY e.date DESC")
    Page<Expense> findByHouseholdIdOrderByDateDesc(@Param("householdId") String householdId, Pageable pageable);
    
    @Query("SELECT e FROM Expense e WHERE e.household.id = :householdId ORDER BY e.amount DESC")
    Page<Expense> findByHouseholdIdOrderByAmountDesc(@Param("householdId") String householdId, Pageable pageable);
    
    @Query("SELECT e FROM Expense e WHERE e.household.id = :householdId ORDER BY e.amount ASC")
    Page<Expense> findByHouseholdIdOrderByAmountAsc(@Param("householdId") String householdId, Pageable pageable);
    
    @Query("SELECT e FROM Expense e WHERE e.household.id = :householdId ORDER BY e.createdAt DESC")
    Page<Expense> findByHouseholdIdOrderByCreatedAtDesc(@Param("householdId") String householdId, Pageable pageable);
    
    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.household.id = :householdId")
    BigDecimal getTotalAmountByHouseholdId(@Param("householdId") String householdId);
    
    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.household.id = :householdId AND e.status = :status")
    BigDecimal getTotalAmountByHouseholdIdAndStatus(@Param("householdId") String householdId, @Param("status") ExpenseStatus status);
    
    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.household.id = :householdId AND e.category = :category")
    BigDecimal getTotalAmountByHouseholdIdAndCategory(@Param("householdId") String householdId, @Param("category") ExpenseCategory category);
    
    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.household.id = :householdId AND e.date BETWEEN :startDate AND :endDate")
    BigDecimal getTotalAmountByHouseholdIdAndDateRange(@Param("householdId") String householdId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT e.category, SUM(e.amount) FROM Expense e WHERE e.household.id = :householdId GROUP BY e.category")
    List<Object[]> getCategoryTotalsByHouseholdId(@Param("householdId") String householdId);
    
    @Query("SELECT e.category, COUNT(e) FROM Expense e WHERE e.household.id = :householdId GROUP BY e.category")
    List<Object[]> getCategoryCountsByHouseholdId(@Param("householdId") String householdId);
    
    @Query("SELECT e FROM Expense e WHERE e.household.id = :householdId AND e.status = 'PENDING' ORDER BY e.date ASC")
    List<Expense> findPendingExpensesByHouseholdId(@Param("householdId") String householdId);
    
    @Query("SELECT e FROM Expense e WHERE e.household.id = :householdId AND e.status = 'SETTLED' ORDER BY e.date DESC")
    List<Expense> findSettledExpensesByHouseholdId(@Param("householdId") String householdId);
    
    @Query("SELECT COUNT(e) FROM Expense e WHERE e.household.id = :householdId")
    long countByHouseholdId(@Param("householdId") String householdId);
    
    @Query("SELECT COUNT(e) FROM Expense e WHERE e.household.id = :householdId AND e.status = :status")
    long countByHouseholdIdAndStatus(@Param("householdId") String householdId, @Param("status") ExpenseStatus status);
    
    @Query("SELECT COUNT(e) FROM Expense e WHERE e.household.id = :householdId AND e.category = :category")
    long countByHouseholdIdAndCategory(@Param("householdId") String householdId, @Param("category") ExpenseCategory category);
    
    @Query("SELECT e FROM Expense e WHERE e.household.id = :householdId AND e.paidBy.id = :userId ORDER BY e.date DESC")
    Page<Expense> findByHouseholdIdAndPaidByOrderByDateDesc(@Param("householdId") String householdId, @Param("userId") String userId, Pageable pageable);
    
    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.household.id = :householdId AND e.paidBy.id = :userId")
    BigDecimal getTotalAmountByHouseholdIdAndPaidBy(@Param("householdId") String householdId, @Param("userId") String userId);
}
