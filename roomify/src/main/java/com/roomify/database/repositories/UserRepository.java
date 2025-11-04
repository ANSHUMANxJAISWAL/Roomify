package com.roomify.database.repositories;

import com.roomify.database.entities.User;
import com.roomify.database.entities.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByStatus(UserStatus status);

    @Query("SELECT u FROM User u WHERE u.id = :id AND u.deletedAt IS NULL")
    Optional<User> findActiveById(@Param("id") String id);

    @Query("SELECT u FROM User u WHERE u.createdAt >= :startDate")
    List<User> findUsersCreatedAfter(@Param("startDate") LocalDateTime startDate);
    
    List<User> findByEmailContainingIgnoreCase(String email);
    
    List<User> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String firstName, String lastName);
}
