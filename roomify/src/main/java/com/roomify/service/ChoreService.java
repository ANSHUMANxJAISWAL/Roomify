package com.roomify.service;

import com.roomify.dto.ChoreDto;
import java.util.List;

public interface ChoreService {
    ChoreDto createChore(ChoreDto choreDto);
    ChoreDto getChoreById(String id);
    List<ChoreDto> getAllChoresByHousehold(String householdId);
    List<ChoreDto> getChoresByUser(String userId);
    ChoreDto updateChore(String id, ChoreDto choreDto);
    void deleteChore(String id);
    ChoreDto assignChore(String choreId, String userId);
    ChoreDto completeChore(String choreId);
}
