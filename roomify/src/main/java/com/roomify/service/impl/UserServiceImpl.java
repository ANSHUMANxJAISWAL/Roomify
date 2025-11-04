package com.roomify.service.impl;

import com.roomify.database.entities.User;
import com.roomify.database.entities.UserRole;
import com.roomify.database.entities.UserStatus;
import com.roomify.database.repositories.UserRepository;
import com.roomify.dto.UserCreateRequest;
import com.roomify.dto.UserResponse;
import com.roomify.dto.UserUpdateRequest;
import com.roomify.exception.BadRequestException;
import com.roomify.exception.ResourceNotFoundException;
import com.roomify.service.UserService;
import lombok.RequiredArgsConstructor;
// import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.annotation.PostConstruct;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(String id) {
        User user = userRepository.findActiveById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        return mapToResponse(user);
    }

    @Override
    @Transactional
    public UserResponse createUser(UserCreateRequest request) {
        if (userRepository.existsByEmail(request.email)) {
            throw new BadRequestException("Email already in use");
        }

        User user = new User();
        user.setEmail(request.email);
        user.setPassword(request.password); // Store password as plain text for basic project
        user.setFirstName(request.firstName);
        user.setLastName(request.lastName);
        user.setRole(UserRole.USER);
        user.setStatus(UserStatus.ACTIVE);

        User savedUser = userRepository.save(user);
        System.out.println("Created new user with email: " + savedUser.getEmail());
        return mapToResponse(savedUser);
    }

    @Override
    @Transactional
    public UserResponse updateUser(String id, UserUpdateRequest request) {
        User user = userRepository.findActiveById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (request.firstName != null) {
            user.setFirstName(request.firstName);
        }
        if (request.lastName != null) {
            user.setLastName(request.lastName);
        }

        User updatedUser = userRepository.save(user);
        System.out.println("Updated user with id: " + id);
        return mapToResponse(updatedUser);
    }

    @Override
    @Transactional
    public void deleteUser(String id) {
        User user = userRepository.findActiveById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        user.setDeletedAt(java.time.LocalDateTime.now());
        userRepository.save(user);
        System.out.println("Soft deleted user with id: " + id);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        return mapToResponse(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
            .filter(user -> user.getDeletedAt() == null)
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> searchUsers(String email, String name) {
        if (email != null && !email.trim().isEmpty()) {
            return userRepository.findByEmailContainingIgnoreCase(email).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        } else if (name != null && !name.trim().isEmpty()) {
            return userRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(name, name).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        }
        return List.of();
    }

    @PostConstruct
    @Transactional
    public void createSampleUsers() {
        try {
            if (userRepository.count() == 0) {
                System.out.println("Creating sample users...");

                User adminUser = new User();
                adminUser.setEmail("admin@roomify.com");
                adminUser.setPassword("admin123");
                adminUser.setFirstName("Admin");
                adminUser.setLastName("User");
                adminUser.setRole(UserRole.ADMIN);
                adminUser.setStatus(UserStatus.ACTIVE);

                User johnUser = new User();
                johnUser.setEmail("john@roomify.com");
                johnUser.setPassword("john123");
                johnUser.setFirstName("John");
                johnUser.setLastName("Doe");
                johnUser.setRole(UserRole.USER);
                johnUser.setStatus(UserStatus.ACTIVE);

                User janeUser = new User();
                janeUser.setEmail("jane@roomify.com");
                janeUser.setPassword("jane123");
                janeUser.setFirstName("Jane");
                janeUser.setLastName("Smith");
                janeUser.setRole(UserRole.USER);
                janeUser.setStatus(UserStatus.ACTIVE);

                User guestUser = new User();
                guestUser.setEmail("guest@roomify.com");
                guestUser.setPassword("guest123");
                guestUser.setFirstName("Guest");
                guestUser.setLastName("User");
                guestUser.setRole(UserRole.USER);
                guestUser.setStatus(UserStatus.ACTIVE);

                userRepository.save(adminUser);
                userRepository.save(johnUser);
                userRepository.save(janeUser);
                userRepository.save(guestUser);

                System.out.println("Sample users created successfully");
            } else {
                System.out.println("Users already exist, skipping sample user creation");
            }
        } catch (Exception e) {
            System.err.println("Error creating sample users: " + e.getMessage());
        }
    }

    private UserResponse mapToResponse(User user) {
        UserResponse response = new UserResponse();
        response.id = user.getId();
        response.email = user.getEmail();
        response.firstName = user.getFirstName();
        response.lastName = user.getLastName();
        response.role = user.getRole();
        response.status = user.getStatus();
        response.createdAt = user.getCreatedAt();
        response.updatedAt = user.getUpdatedAt();
        return response;
    }
}
