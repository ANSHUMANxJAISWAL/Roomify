package com.roomify.controller;

import com.roomify.dto.ReminderDto;
import com.roomify.service.ReminderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reminders")
@CrossOrigin(origins = "*")
public class ReminderController {

    @Autowired
    private ReminderService reminderService;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ReminderDto> createReminder(@RequestBody ReminderDto reminderDto) {
        ReminderDto createdReminder = reminderService.createReminder(reminderDto);
        return ResponseEntity.ok(createdReminder);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ReminderDto> getReminderById(@PathVariable String id) {
        ReminderDto reminder = reminderService.getReminderById(id);
        return ResponseEntity.ok(reminder);
    }

    @GetMapping("/household/{householdId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<ReminderDto>> getRemindersByHousehold(@PathVariable String householdId) {
        List<ReminderDto> reminders = reminderService.getAllRemindersByHousehold(householdId);
        return ResponseEntity.ok(reminders);
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<ReminderDto>> getRemindersByUser(@PathVariable String userId) {
        List<ReminderDto> reminders = reminderService.getRemindersByUser(userId);
        return ResponseEntity.ok(reminders);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ReminderDto> updateReminder(@PathVariable String id, @RequestBody ReminderDto reminderDto) {
        ReminderDto updatedReminder = reminderService.updateReminder(id, reminderDto);
        return ResponseEntity.ok(updatedReminder);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> deleteReminder(@PathVariable String id) {
        reminderService.deleteReminder(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/complete")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ReminderDto> markAsCompleted(@PathVariable String id) {
        ReminderDto completedReminder = reminderService.markAsCompleted(id);
        return ResponseEntity.ok(completedReminder);
    }
}
