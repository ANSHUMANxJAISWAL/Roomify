package com.roomify.service.impl;

import com.roomify.dto.ReminderDto;
import com.roomify.database.entities.Reminder;
import com.roomify.database.entities.ReminderStatus;
import com.roomify.database.entities.User;
import com.roomify.exception.ResourceNotFoundException;
import com.roomify.database.repositories.ReminderRepository;
import com.roomify.database.repositories.UserRepository;
import com.roomify.service.ReminderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ReminderServiceImpl implements ReminderService {

    @Autowired
    private ReminderRepository reminderRepository;
    
    @Autowired
    private UserRepository userRepository;

    @Override
    public ReminderDto createReminder(ReminderDto reminderDto) {
        com.roomify.database.entities.Reminder reminder = new Reminder();
        reminder.setId(UUID.randomUUID().toString());
        reminder.setTitle(reminderDto.getTitle());
        reminder.setDescription(reminderDto.getDescription());
        reminder.setPriority(reminderDto.getPriority());
        reminder.setStatus(com.roomify.database.entities.ReminderStatus.PENDING);
        reminder.setType(reminderDto.getType());
        reminder.setDueDate(reminderDto.getDueDate());
        reminder.setCreatedAt(LocalDateTime.now());
        reminder.setUpdatedAt(LocalDateTime.now());
        
        if (reminderDto.getAssignedToId() != null) {
            User assignedUser = userRepository.findById(reminderDto.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", reminderDto.getAssignedToId()));
            reminder.setAssignedTo(assignedUser);
        }
        
        if (reminderDto.getHouseholdId() != null) {
            // Set household if needed
        }
        
        Reminder savedReminder = reminderRepository.save(reminder);
        return convertToDto(savedReminder);
    }

    @Override
    public ReminderDto getReminderById(String id) {
        com.roomify.database.entities.Reminder reminder = reminderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reminder", "id", id));
        return convertToDto(reminder);
    }

    @Override
    public List<ReminderDto> getAllRemindersByHousehold(String householdId) {
        return reminderRepository.findByHouseholdId(householdId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReminderDto> getRemindersByUser(String userId) {
        return reminderRepository.findByAssignedToId(userId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public ReminderDto updateReminder(String id, ReminderDto reminderDto) {
        com.roomify.database.entities.Reminder reminder = reminderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reminder", "id", id));
        
        reminder.setTitle(reminderDto.getTitle());
        reminder.setDescription(reminderDto.getDescription());
        reminder.setPriority(reminderDto.getPriority());
        reminder.setType(reminderDto.getType());
        reminder.setDueDate(reminderDto.getDueDate());
        reminder.setUpdatedAt(LocalDateTime.now());
        
        if (reminderDto.getAssignedToId() != null) {
            User assignedUser = userRepository.findById(reminderDto.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", reminderDto.getAssignedToId()));
            reminder.setAssignedTo(assignedUser);
        }
        
        Reminder updatedReminder = reminderRepository.save(reminder);
        return convertToDto(updatedReminder);
    }

    @Override
    public void deleteReminder(String id) {
        if (!reminderRepository.existsById(id)) {
            throw new ResourceNotFoundException("Reminder", "id", id);
        }
        reminderRepository.deleteById(id);
    }

    @Override
    public ReminderDto markAsCompleted(String reminderId) {
        com.roomify.database.entities.Reminder reminder = reminderRepository.findById(reminderId)
                .orElseThrow(() -> new ResourceNotFoundException("Reminder", "id", reminderId));
        
        reminder.setStatus(com.roomify.database.entities.ReminderStatus.COMPLETED);
        reminder.setCompletedAt(LocalDateTime.now());
        reminder.setUpdatedAt(LocalDateTime.now());
        
        Reminder updatedReminder = reminderRepository.save(reminder);
        return convertToDto(updatedReminder);
    }

    private ReminderDto convertToDto(com.roomify.database.entities.Reminder reminder) {
        ReminderDto dto = new ReminderDto();
        dto.setId(reminder.getId());
        dto.setTitle(reminder.getTitle());
        dto.setDescription(reminder.getDescription());
        dto.setPriority(reminder.getPriority());
        dto.setStatus(reminder.getStatus());
        dto.setType(reminder.getType());
        dto.setDueDate(reminder.getDueDate());
        dto.setCompletedAt(reminder.getCompletedAt());
        dto.setCreatedAt(reminder.getCreatedAt());
        dto.setUpdatedAt(reminder.getUpdatedAt());
        
        if (reminder.getAssignedTo() != null) {
            dto.setAssignedToId(reminder.getAssignedTo().getId());
            dto.setAssignedToName(reminder.getAssignedTo().getDisplayName());
        }
        
        if (reminder.getHousehold() != null) {
            dto.setHouseholdId(reminder.getHousehold().getId());
        }
        
        return dto;
    }
}

