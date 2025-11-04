package com.roomify.database.repositories;

import com.roomify.database.entities.Reminder;
import com.roomify.database.enums.ReminderStatus;
import com.roomify.database.enums.ReminderType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReminderRepository extends JpaRepository<Reminder, String> {

    List<Reminder> findByUserId(String userId);

    List<Reminder> findByAssignedToId(String assignedToId);

    List<Reminder> findByHouseholdId(String householdId);

    List<Reminder> findByStatus(ReminderStatus status);

    List<Reminder> findByType(ReminderType type);

    List<Reminder> findByDueDate(LocalDate dueDate);

    @Query("SELECT r FROM Reminder r WHERE r.household.id = :householdId AND r.dueDate <= :date AND r.status = 'PENDING'")
    List<Reminder> findUpcomingByHouseholdId(@Param("householdId") String householdId, @Param("date") LocalDate date);

    @Query("SELECT r FROM Reminder r WHERE r.user.id = :userId AND r.status = :status")
    List<Reminder> findByUserIdAndStatus(@Param("userId") String userId, @Param("status") ReminderStatus status);

    @Query("SELECT r FROM Reminder r WHERE r.assignedTo.id = :userId AND r.household.id = :householdId")
    List<Reminder> findByAssignedToIdAndHouseholdId(@Param("userId") String userId, @Param("householdId") String householdId);
}
