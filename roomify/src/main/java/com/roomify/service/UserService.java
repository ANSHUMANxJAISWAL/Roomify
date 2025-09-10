package com.roomify.service;

import com.roomify.dto.UserDto;
import com.roomify.dto.RegisterRequest;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;

public interface UserService extends UserDetailsService {
    UserDto registerUser(RegisterRequest request);
    UserDto getUserById(String id);
    UserDto getUserByEmail(String email);
    List<UserDto> getAllUsers();
    UserDto updateUser(String id, UserDto userDto);
    void deleteUser(String id);
    boolean existsByEmail(String email);
    UserDto getCurrentUser();
}
