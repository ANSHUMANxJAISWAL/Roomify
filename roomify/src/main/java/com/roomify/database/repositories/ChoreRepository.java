package com.roomify.database.repositories;

import com.roomify.database.entities.Chore;
import com.roomify.database.entities.ChoreStatus;
import com.roomify.database.entities.ChorePriority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ChoreRepository extends JpaRepository<Chore, String> {

    List<Chore> findByHouseholdId(String householdId);

    List<Chore> findByAssignedToId(String assignedToId);

    List<Chore> findByAssignedById(String assignedById);

    List<Chore> findByStatus(ChoreStatus status);

    List<Chore> findByPriority(ChorePriority priority);

    List<Chore> findByDueDate(LocalDate dueDate);

    @Query("SELECT c FROM Chore c WHERE c.household.id = :householdId AND c.dueDate < :date AND c.status NOT IN ('COMPLETED', 'CANCELLED')")
    List<Chore> findOverdueByHouseholdId(@Param("householdId") String householdId, @Param("date") LocalDate date);

    @Query("SELECT c FROM Chore c WHERE c.household.id = :householdId AND c.status = :status")
    List<Chore> findByHouseholdIdAndStatus(@Param("householdId") String householdId, @Param("status") ChoreStatus status);

    @Query("SELECT c FROM Chore c WHERE c.assignedTo.id = :userId AND c.household.id = :householdId")
    List<Chore> findByAssignedToIdAndHouseholdId(@Param("userId") String userId, @Param("householdId") String householdId);
}
