package com.roomify.service;

import com.roomify.dto.ReminderDto;
import java.util.List;

public interface ReminderService {
    ReminderDto createReminder(ReminderDto reminderDto);
    ReminderDto getReminderById(String id);
    List<ReminderDto> getAllRemindersByHousehold(String householdId);
    List<ReminderDto> getRemindersByUser(String userId);
    ReminderDto updateReminder(String id, ReminderDto reminderDto);
    void deleteReminder(String id);
    ReminderDto markAsCompleted(String reminderId);
}
