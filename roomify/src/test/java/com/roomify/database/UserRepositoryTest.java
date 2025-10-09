package com.roomify.database;

import com.roomify.database.entities.User;
import com.roomify.database.entities.UserRole;
import com.roomify.database.entities.UserStatus;
import com.roomify.database.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Test class for UserRepository CRUD operations
 */
@DataJpaTest
@ActiveProfiles("test")
public class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    public void testCreateUser() {
        // Create a new user
        User user = new User();
        user.setEmail("test@example.com");
        user.setPassword("password123");
        user.setFirstName("Test");
        user.setLastName("User");
        user.setRole(UserRole.USER);
        user.setStatus(UserStatus.ACTIVE);
        
        // Save the user
        User savedUser = userRepository.save(user);
        
        // Verify
        assertNotNull(savedUser.getId(), "User ID should be generated");
        assertEquals("test@example.com", savedUser.getEmail());
        assertEquals("Test", savedUser.getFirstName());
        
        System.out.println("✅ User created successfully with ID: " + savedUser.getId());
    }

    @Test
    public void testFindUserByEmail() {
        // Create and save a user
        User user = new User();
        user.setEmail("find@example.com");
        user.setPassword("password123");
        user.setFirstName("Find");
        user.setLastName("Me");
        userRepository.save(user);
        
        // Find by email
        Optional<User> foundUser = userRepository.findByEmail("find@example.com");
        
        // Verify
        assertTrue(foundUser.isPresent(), "User should be found");
        assertEquals("Find", foundUser.get().getFirstName());
        
        System.out.println("✅ User found by email successfully");
    }

    @Test
    public void testUpdateUser() {
        // Create and save a user
        User user = new User();
        user.setEmail("update@example.com");
        user.setPassword("password123");
        user.setFirstName("Original");
        user.setLastName("Name");
        User savedUser = userRepository.save(user);
        
        // Update the user
        savedUser.setFirstName("Updated");
        savedUser.setLastName("NewName");
        userRepository.save(savedUser);
        
        // Verify
        Optional<User> updatedUser = userRepository.findById(savedUser.getId());
        assertTrue(updatedUser.isPresent());
        assertEquals("Updated", updatedUser.get().getFirstName());
        assertEquals("NewName", updatedUser.get().getLastName());
        
        System.out.println("✅ User updated successfully");
    }

    @Test
    public void testDeleteUser() {
        // Create and save a user
        User user = new User();
        user.setEmail("delete@example.com");
        user.setPassword("password123");
        user.setFirstName("Delete");
        user.setLastName("Me");
        User savedUser = userRepository.save(user);
        String userId = savedUser.getId();
        
        // Delete the user
        userRepository.delete(savedUser);
        
        // Verify
        Optional<User> deletedUser = userRepository.findById(userId);
        assertFalse(deletedUser.isPresent(), "User should be deleted");
        
        System.out.println("✅ User deleted successfully");
    }

    @Test
    public void testExistsByEmail() {
        // Create and save a user
        User user = new User();
        user.setEmail("exists@example.com");
        user.setPassword("password123");
        user.setFirstName("Exists");
        userRepository.save(user);
        
        // Check existence
        assertTrue(userRepository.existsByEmail("exists@example.com"));
        assertFalse(userRepository.existsByEmail("notexists@example.com"));
        
        System.out.println("✅ Email existence check successful");
    }
}
