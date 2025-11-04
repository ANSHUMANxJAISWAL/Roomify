package com.roomify.controller;

import com.roomify.database.entities.User;
import com.roomify.database.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/test")
@RequiredArgsConstructor
public class TestDbController {
    
    private final UserRepository userRepository;
    
    @GetMapping("/ping")
    public String ping() {
        return "Pong! Database connection is working.";
    }
    
    @GetMapping("/db-status")
    public ResponseEntity<Map<String, Object>> getDatabaseStatus() {
        Map<String, Object> status = new HashMap<>();
        
        try {
            long userCount = userRepository.count();
            status.put("status", "connected");
            status.put("database", "H2");
            status.put("totalUsers", userCount);
            status.put("message", "Database is working correctly!");
            
            // Get sample user to verify data retrieval
            if (userCount > 0) {
                User sampleUser = userRepository.findAll().get(0);
                status.put("sampleUserEmail", sampleUser.getEmail());
            }
            
            return ResponseEntity.ok(status);
        } catch (Exception e) {
            status.put("status", "error");
            status.put("message", e.getMessage());
            return ResponseEntity.internalServerError().body(status);
        }
    }
}
