package com.roomify.repository;

import com.roomify.entity.User;
import com.roomify.entity.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    
    Optional<User> findByUsername(String username);
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByUsernameOrEmail(String username, String email);
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
    
    boolean existsByUsernameOrEmail(String username, String email);
    
    List<User> findByStatus(UserStatus status);
    
    List<User> findByEmailVerified(boolean emailVerified);
    
    List<User> findByLastLoginBefore(LocalDateTime date);
    
    @Query("SELECT u FROM User u WHERE u.household.id = :householdId")
    List<User> findByHouseholdId(@Param("householdId") String householdId);
    
    @Query("SELECT u FROM User u WHERE u.household.id = :householdId AND u.status = :status")
    List<User> findByHouseholdIdAndStatus(@Param("householdId") String householdId, @Param("status") UserStatus status);
    
    @Query("SELECT u FROM User u WHERE u.username LIKE %:searchTerm% OR u.firstName LIKE %:searchTerm% OR u.lastName LIKE %:searchTerm% OR u.email LIKE %:searchTerm%")
    Page<User> findBySearchTerm(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    @Query("SELECT u FROM User u WHERE u.household.id = :householdId AND (u.username LIKE %:searchTerm% OR u.firstName LIKE %:searchTerm% OR u.lastName LIKE %:searchTerm% OR u.email LIKE %:searchTerm%)")
    Page<User> findByHouseholdIdAndSearchTerm(@Param("householdId") String householdId, @Param("searchTerm") String searchTerm, Pageable pageable);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.household.id = :householdId")
    long countByHouseholdId(@Param("householdId") String householdId);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.household.id = :householdId AND u.status = :status")
    long countByHouseholdIdAndStatus(@Param("householdId") String householdId, @Param("status") UserStatus status);
    
    @Query("SELECT u FROM User u WHERE u.createdAt >= :startDate")
    List<User> findUsersCreatedAfter(@Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT u FROM User u WHERE u.lastLogin >= :startDate")
    List<User> findUsersActiveAfter(@Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT u FROM User u WHERE u.household.id = :householdId ORDER BY u.createdAt ASC")
    List<User> findHouseholdMembersOrderedByJoinDate(@Param("householdId") String householdId);
    
    @Query("SELECT u FROM User u WHERE u.household.id = :householdId AND u.role = 'HOUSEHOLD_ADMIN'")
    Optional<User> findHouseholdAdmin(@Param("householdId") String householdId);
    
    @Query("SELECT u FROM User u WHERE u.household.id = :householdId AND u.role = 'USER'")
    List<User> findHouseholdRegularMembers(@Param("householdId") String householdId);
}
