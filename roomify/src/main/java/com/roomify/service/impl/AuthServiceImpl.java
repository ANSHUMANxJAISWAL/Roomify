package com.roomify.service.impl;

import com.roomify.dto.AuthResponse;
import com.roomify.dto.LoginRequest;
import com.roomify.dto.RegisterRequest;
import com.roomify.dto.UserDto;
import com.roomify.exception.UnauthorizedException;
import com.roomify.security.JwtTokenProvider;
import com.roomify.service.AuthService;
import com.roomify.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthServiceImpl.class);

    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    
    @Autowired
    private UserService userService;

    @Override
    public AuthResponse login(LoginRequest loginRequest) {
        if (loginRequest == null || loginRequest.getEmail() == null || loginRequest.getPassword() == null) {
            throw new IllegalArgumentException("Login credentials cannot be null");
        }
        
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(),
                    loginRequest.getPassword()
                )
            );
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            String accessToken = jwtTokenProvider.generateAccessToken(loginRequest.getEmail());
            String refreshToken = jwtTokenProvider.generateRefreshToken(loginRequest.getEmail());
            UserDto user = userService.getUserByEmail(loginRequest.getEmail());
            
            log.info("User logged in successfully: {}", loginRequest.getEmail());
            return new AuthResponse(accessToken, refreshToken, 900000L, user);
        } catch (Exception e) {
            log.error("Login failed for user {}: {}", loginRequest.getEmail(), e.getMessage());
            throw new UnauthorizedException("Invalid email or password", e);
        }
    }

    @Override
    public AuthResponse register(RegisterRequest registerRequest) {
        if (registerRequest == null || registerRequest.getEmail() == null || registerRequest.getPassword() == null) {
            throw new IllegalArgumentException("Registration details cannot be null");
        }
        
        try {
            UserDto user = userService.registerUser(registerRequest);
            
            String accessToken = jwtTokenProvider.generateAccessToken(user.getEmail());
            String refreshToken = jwtTokenProvider.generateRefreshToken(user.getEmail());
            
            log.info("User registered successfully: {}", user.getEmail());
            return new AuthResponse(accessToken, refreshToken, 900000L, user);
        } catch (Exception e) {
            log.error("Registration failed for user {}: {}", registerRequest.getEmail(), e.getMessage());
            throw e;
        }
    }

    @Override
    public AuthResponse refreshToken(String refreshToken) {
        if (refreshToken == null || !jwtTokenProvider.validateRefreshToken(refreshToken)) {
            throw new UnauthorizedException("Invalid refresh token");
        }
        
        String email = jwtTokenProvider.getUsernameFromToken(refreshToken);
        if (email == null) {
            throw new UnauthorizedException("Invalid refresh token: could not extract user information");
        }
        
        UserDto user = userService.getUserByEmail(email);
        String newAccessToken = jwtTokenProvider.generateAccessToken(email);
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(email);
        
        return new AuthResponse(newAccessToken, newRefreshToken, 900000L, user);
    }

    @Override
    public void logout(String refreshToken) {
        // Validate the token before processing logout
        if (refreshToken != null && jwtTokenProvider.validateRefreshToken(refreshToken)) {
            // In a real application, you might want to blacklist the refresh token
            // For now, we'll just log the logout
            String username = jwtTokenProvider.getUsernameFromToken(refreshToken);
            if (username != null) {
                log.info("User logged out: {}", username);
            }
        }
    }
}
