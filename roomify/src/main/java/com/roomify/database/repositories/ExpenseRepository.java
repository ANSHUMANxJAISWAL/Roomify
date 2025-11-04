package com.roomify.database.repositories;

import com.roomify.database.entities.Expense;
import com.roomify.database.enums.ExpenseCategory;
import com.roomify.database.enums.ExpenseStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, String> {

    List<Expense> findByHouseholdId(String householdId);

    List<Expense> findByPaidById(String paidById);

    List<Expense> findByStatus(ExpenseStatus status);

    List<Expense> findByCategory(ExpenseCategory category);

    @Query("SELECT e FROM Expense e WHERE e.household.id = :householdId AND e.date BETWEEN :startDate AND :endDate")
    List<Expense> findByHouseholdIdAndDateRange(
        @Param("householdId") String householdId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );

    @Query("SELECT e FROM Expense e WHERE e.household.id = :householdId AND e.status = :status")
    List<Expense> findByHouseholdIdAndStatus(@Param("householdId") String householdId, @Param("status") ExpenseStatus status);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.household.id = :householdId AND e.status = 'SETTLED'")
    Long getTotalSettledAmountByHousehold(@Param("householdId") String householdId);
}
