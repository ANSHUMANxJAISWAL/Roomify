package com.roomify.service;

import com.roomify.dto.AuthResponse;
import com.roomify.dto.LoginRequest;
import com.roomify.dto.RegisterRequest;

public interface AuthService {
    AuthResponse login(LoginRequest request);
    AuthResponse register(RegisterRequest request);
    AuthResponse refreshToken(String refreshToken);
    void logout(String refreshToken);
}
