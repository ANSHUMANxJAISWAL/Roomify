package com.roomify.database.repositories;

import com.roomify.database.entities.Household;
import com.roomify.database.entities.HouseholdStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HouseholdRepository extends JpaRepository<Household, String> {

    List<Household> findByStatus(HouseholdStatus status);

    Optional<Household> findByInviteCode(String inviteCode);

    @Query("SELECT h FROM Household h JOIN h.members m WHERE m.user.id = :userId AND m.status = 'ACTIVE'")
    List<Household> findByMemberUserId(@Param("userId") String userId);

    @Query("SELECT h FROM Household h WHERE h.status = 'ACTIVE'")
    List<Household> findActiveHouseholds();

    boolean existsByInviteCode(String inviteCode);
}
