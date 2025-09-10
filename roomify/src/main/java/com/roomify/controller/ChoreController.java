package com.roomify.controller;

import com.roomify.dto.ChoreDto;
import com.roomify.service.ChoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chores")
@CrossOrigin(origins = "*")
public class ChoreController {

    @Autowired
    private ChoreService choreService;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ChoreDto> createChore(@RequestBody ChoreDto choreDto) {
        ChoreDto createdChore = choreService.createChore(choreDto);
        return ResponseEntity.ok(createdChore);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ChoreDto> getChoreById(@PathVariable String id) {
        ChoreDto chore = choreService.getChoreById(id);
        return ResponseEntity.ok(chore);
    }

    @GetMapping("/household/{householdId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<ChoreDto>> getChoresByHousehold(@PathVariable String householdId) {
        List<ChoreDto> chores = choreService.getAllChoresByHousehold(householdId);
        return ResponseEntity.ok(chores);
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<ChoreDto>> getChoresByUser(@PathVariable String userId) {
        List<ChoreDto> chores = choreService.getChoresByUser(userId);
        return ResponseEntity.ok(chores);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ChoreDto> updateChore(@PathVariable String id, @RequestBody ChoreDto choreDto) {
        ChoreDto updatedChore = choreService.updateChore(id, choreDto);
        return ResponseEntity.ok(updatedChore);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> deleteChore(@PathVariable String id) {
        choreService.deleteChore(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/assign/{userId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ChoreDto> assignChore(@PathVariable String id, @PathVariable String userId) {
        ChoreDto assignedChore = choreService.assignChore(id, userId);
        return ResponseEntity.ok(assignedChore);
    }

    @PostMapping("/{id}/complete")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ChoreDto> completeChore(@PathVariable String id) {
        ChoreDto completedChore = choreService.completeChore(id);
        return ResponseEntity.ok(completedChore);
    }
}
