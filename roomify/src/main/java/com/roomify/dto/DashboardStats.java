package com.roomify.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStats {
    public long totalExpenses;
    public long totalChores;
    public long totalReminders;
    public long pendingPayments;
    public long overdueChores;
    public long upcomingReminders;
}
