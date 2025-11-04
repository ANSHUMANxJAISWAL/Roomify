package com.roomify.service;

import com.roomify.dto.HouseholdCreateRequest;
import com.roomify.dto.HouseholdResponse;
import com.roomify.dto.HouseholdUpdateRequest;

import java.util.List;

public interface HouseholdService {
    HouseholdResponse createHousehold(HouseholdCreateRequest request);
    HouseholdResponse getHouseholdById(String id);
    HouseholdResponse updateHousehold(String id, HouseholdUpdateRequest request);
    void deleteHousehold(String id);
    List<HouseholdResponse> getAllHouseholds();
    List<HouseholdResponse> getHouseholdsByUserId(String userId);
    HouseholdResponse getHouseholdByInviteCode(String inviteCode);
}
