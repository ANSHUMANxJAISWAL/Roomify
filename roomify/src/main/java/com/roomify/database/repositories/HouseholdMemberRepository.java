package com.roomify.database.repositories;

import com.roomify.database.entities.HouseholdMember;
import com.roomify.database.entities.HouseholdMemberStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HouseholdMemberRepository extends JpaRepository<HouseholdMember, String> {

    List<HouseholdMember> findByUserId(String userId);

    List<HouseholdMember> findByHouseholdId(String householdId);

    List<HouseholdMember> findByStatus(HouseholdMemberStatus status);

    @Query("SELECT hm FROM HouseholdMember hm WHERE hm.user.id = :userId AND hm.household.id = :householdId")
    Optional<HouseholdMember> findByUserIdAndHouseholdId(@Param("userId") String userId, @Param("householdId") String householdId);

    @Query("SELECT hm FROM HouseholdMember hm WHERE hm.user.id = :userId AND hm.status = 'ACTIVE'")
    List<HouseholdMember> findActiveByUserId(@Param("userId") String userId);

    @Query("SELECT hm FROM HouseholdMember hm WHERE hm.household.id = :householdId AND hm.status = 'ACTIVE'")
    List<HouseholdMember> findActiveByHouseholdId(@Param("householdId") String householdId);

    @Query("SELECT COUNT(hm) FROM HouseholdMember hm WHERE hm.household.id = :householdId AND hm.status = 'ACTIVE'")
    long countActiveMembersByHouseholdId(@Param("householdId") String householdId);
}
