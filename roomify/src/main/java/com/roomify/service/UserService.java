package com.roomify.service;

import com.roomify.dto.UserCreateRequest;
import com.roomify.dto.UserResponse;
import com.roomify.dto.UserUpdateRequest;

import java.util.List;

public interface UserService {
    UserResponse createUser(UserCreateRequest request);
    UserResponse getUserById(String id);
    UserResponse getUserByEmail(String email);
    UserResponse updateUser(String id, UserUpdateRequest request);
    void deleteUser(String id);
    List<UserResponse> getAllUsers();
    
    List<UserResponse> searchUsers(String email, String name);
}