package com.roomify.controller;

import com.roomify.dto.DashboardStats;
import com.roomify.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStats> getDashboardStats(@RequestParam(required = false) String userId) {
        // For now, use a default user ID if not provided
        String currentUserId = userId != null ? userId : "default-user";
        DashboardStats stats = dashboardService.getDashboardStats(currentUserId);
        return ResponseEntity.ok(stats);
    }
}
