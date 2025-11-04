package com.roomify.service.impl;

import com.roomify.dto.*;
import com.roomify.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    @Override
    public DashboardStats getDashboardStats(String userId) {
        // TODO: Implement actual data fetching from repositories
        DashboardStats stats = new DashboardStats();
        stats.totalExpenses = 0L;
        stats.totalChores = 0L;
        stats.totalReminders = 0L;
        stats.pendingPayments = 0L;
        stats.overdueChores = 0L;
        stats.upcomingReminders = 0L;
        return stats;
    }

    @Override
    public List<ExpenseResponse> getRecentExpenses(String userId, int limit) {
        // TODO: Implement actual data fetching from repositories
        return new ArrayList<>();
    }

    @Override
    public List<ChoreResponse> getRecentChores(String userId, int limit) {
        // TODO: Implement actual data fetching from repositories
        return new ArrayList<>();
    }

    @Override
    public List<ReminderResponse> getUpcomingReminders(String userId, int limit) {
        // TODO: Implement actual data fetching from repositories
        return new ArrayList<>();
    }

    @Override
    public List<NotificationResponse> getRecentNotifications(String userId, int limit) {
        // TODO: Implement actual data fetching from repositories
        return new ArrayList<>();
    }

    @Override
    public List<HouseholdResponse> getUserHouseholds(String userId) {
        // TODO: Implement actual data fetching from repositories
        return new ArrayList<>();
    }
}
