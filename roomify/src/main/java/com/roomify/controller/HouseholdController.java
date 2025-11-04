package com.roomify.controller;

import com.roomify.dto.HouseholdCreateRequest;
import com.roomify.dto.HouseholdResponse;
import com.roomify.dto.HouseholdUpdateRequest;
import com.roomify.service.HouseholdService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/households")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class HouseholdController {

    private final HouseholdService householdService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HouseholdResponse createHousehold(@Valid @RequestBody HouseholdCreateRequest request) {
        return householdService.createHousehold(request);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HouseholdResponse> getHousehold(@PathVariable String id) {
        return ResponseEntity.ok(householdService.getHouseholdById(id));
    }

    @PutMapping("/{id}")
    public HouseholdResponse updateHousehold(
            @PathVariable String id,
            @Valid @RequestBody HouseholdUpdateRequest request) {
        return householdService.updateHousehold(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteHousehold(@PathVariable String id) {
        householdService.deleteHousehold(id);
    }

    @GetMapping
    public List<HouseholdResponse> getAllHouseholds() {
        return householdService.getAllHouseholds();
    }

    @GetMapping("/invite/{inviteCode}")
    public ResponseEntity<HouseholdResponse> getHouseholdByInviteCode(@PathVariable String inviteCode) {
        return ResponseEntity.ok(householdService.getHouseholdByInviteCode(inviteCode));
    }
}
