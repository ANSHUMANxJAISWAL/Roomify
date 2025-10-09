package com.roomify.service.impl;

import com.roomify.dto.ChoreDto;
import com.roomify.database.entities.Chore;
import com.roomify.database.entities.ChoreStatus;
import com.roomify.database.entities.User;
import com.roomify.exception.ResourceNotFoundException;
import com.roomify.database.repositories.ChoreRepository;
import com.roomify.database.repositories.UserRepository;
import com.roomify.service.ChoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ChoreServiceImpl implements ChoreService {

    @Autowired
    private ChoreRepository choreRepository;
    
    @Autowired
    private UserRepository userRepository;

    @Override
    public ChoreDto createChore(ChoreDto choreDto) {
        com.roomify.database.entities.Chore chore = new Chore();
        chore.setId(UUID.randomUUID().toString());
        chore.setTitle(choreDto.getTitle());
        chore.setDescription(choreDto.getDescription());
        chore.setPriority(choreDto.getPriority());
        chore.setStatus(com.roomify.database.entities.ChoreStatus.PENDING);
        chore.setFrequency(choreDto.getFrequency());
        chore.setDueDate(choreDto.getDueDate());
        chore.setCreatedAt(LocalDateTime.now());
        chore.setUpdatedAt(LocalDateTime.now());
        
        if (choreDto.getAssignedToId() != null) {
            User assignedUser = userRepository.findById(choreDto.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", choreDto.getAssignedToId()));
            chore.setAssignedTo(assignedUser);
        }
        
        Chore savedChore = choreRepository.save(chore);
        return convertToDto(savedChore);
    }

    @Override
    public ChoreDto getChoreById(String id) {
        com.roomify.database.entities.Chore chore = choreRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Chore", "id", id));
        return convertToDto(chore);
    }

    @Override
    public List<ChoreDto> getAllChoresByHousehold(String householdId) {
        return choreRepository.findByHouseholdId(householdId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ChoreDto> getChoresByUser(String userId) {
        return choreRepository.findByAssignedToId(userId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public ChoreDto updateChore(String id, ChoreDto choreDto) {
        com.roomify.database.entities.Chore chore = choreRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Chore", "id", id));
        
        chore.setTitle(choreDto.getTitle());
        chore.setDescription(choreDto.getDescription());
        chore.setPriority(choreDto.getPriority());
        chore.setFrequency(choreDto.getFrequency());
        chore.setDueDate(choreDto.getDueDate());
        chore.setUpdatedAt(LocalDateTime.now());
        
        if (choreDto.getAssignedToId() != null) {
            User assignedUser = userRepository.findById(choreDto.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", choreDto.getAssignedToId()));
            chore.setAssignedTo(assignedUser);
        }
        
        com.roomify.database.entities.Chore updatedChore = choreRepository.save(chore);
        return convertToDto(updatedChore);
    }

    @Override
    public void deleteChore(String id) {
        if (!choreRepository.existsById(id)) {
            throw new ResourceNotFoundException("Chore", "id", id);
        }
        choreRepository.deleteById(id);
    }

    @Override
    public ChoreDto assignChore(String choreId, String userId) {
        com.roomify.database.entities.Chore chore = choreRepository.findById(choreId)
                .orElseThrow(() -> new ResourceNotFoundException("Chore", "id", choreId));
        
        com.roomify.database.entities.User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        
        chore.setAssignedTo(user);
        chore.setUpdatedAt(LocalDateTime.now());
        
        com.roomify.database.entities.Chore updatedChore = choreRepository.save(chore);
        return convertToDto(updatedChore);
    }

    @Override
    public ChoreDto completeChore(String choreId) {
        com.roomify.database.entities.Chore chore = choreRepository.findById(choreId)
                .orElseThrow(() -> new ResourceNotFoundException("Chore", "id", choreId));
        
        chore.setStatus(com.roomify.database.entities.ChoreStatus.COMPLETED);
        chore.setCompletedAt(LocalDateTime.now());
        chore.setUpdatedAt(LocalDateTime.now());
        
        com.roomify.database.entities.Chore updatedChore = choreRepository.save(chore);
        return convertToDto(updatedChore);
    }

    private ChoreDto convertToDto(com.roomify.database.entities.Chore chore) {
        ChoreDto dto = new ChoreDto();
        dto.setId(chore.getId());
        dto.setTitle(chore.getTitle());
        dto.setDescription(chore.getDescription());
        dto.setPriority(chore.getPriority());
        dto.setStatus(chore.getStatus());
        dto.setFrequency(chore.getFrequency());
        dto.setDueDate(chore.getDueDate());
        dto.setCompletedAt(chore.getCompletedAt());
        dto.setCreatedAt(chore.getCreatedAt());
        dto.setUpdatedAt(chore.getUpdatedAt());
        
        if (chore.getAssignedTo() != null) {
            dto.setAssignedToId(chore.getAssignedTo().getId());
            dto.setAssignedToName(chore.getAssignedTo().getDisplayName());
        }
        
        // Note: Chore entity doesn't have createdBy field
        
        if (chore.getHousehold() != null) {
            dto.setHouseholdId(chore.getHousehold().getId());
        }
        
        return dto;
    }
}

