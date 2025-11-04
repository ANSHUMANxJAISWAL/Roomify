package com.roomify.service;

import com.roomify.dto.DashboardStats;
import com.roomify.dto.ExpenseResponse;
import com.roomify.dto.ChoreResponse;
import com.roomify.dto.ReminderResponse;
import com.roomify.dto.NotificationResponse;
import com.roomify.dto.HouseholdResponse;

import java.util.List;

public interface DashboardService {
    DashboardStats getDashboardStats(String userId);
    List<ExpenseResponse> getRecentExpenses(String userId, int limit);
    List<ChoreResponse> getRecentChores(String userId, int limit);
    List<ReminderResponse> getUpcomingReminders(String userId, int limit);
    List<NotificationResponse> getRecentNotifications(String userId, int limit);
    List<HouseholdResponse> getUserHouseholds(String userId);
}
