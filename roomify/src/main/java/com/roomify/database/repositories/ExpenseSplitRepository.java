package com.roomify.database.repositories;

import com.roomify.database.entities.ExpenseSplit;
import com.roomify.database.enums.ExpenseSplitStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseSplitRepository extends JpaRepository<ExpenseSplit, String> {

    List<ExpenseSplit> findByExpenseId(String expenseId);

    List<ExpenseSplit> findByUserId(String userId);

    List<ExpenseSplit> findByStatus(ExpenseSplitStatus status);

    @Query("SELECT es FROM ExpenseSplit es WHERE es.expense.household.id = :householdId")
    List<ExpenseSplit> findByHouseholdId(@Param("householdId") String householdId);

    @Query("SELECT es FROM ExpenseSplit es WHERE es.user.id = :userId AND es.expense.household.id = :householdId")
    List<ExpenseSplit> findByUserIdAndHouseholdId(@Param("userId") String userId, @Param("householdId") String householdId);

    @Query("SELECT es FROM ExpenseSplit es WHERE es.user.id = :userId AND es.status = :status")
    List<ExpenseSplit> findByUserIdAndStatus(@Param("userId") String userId, @Param("status") ExpenseSplitStatus status);
}
