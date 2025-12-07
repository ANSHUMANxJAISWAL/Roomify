package com.roomify.service.impl;

import com.roomify.database.entities.Address;
import com.roomify.database.entities.Household;
import com.roomify.database.entities.HouseholdStatus;
import com.roomify.database.repositories.HouseholdRepository;
import com.roomify.dto.AddressDto;
import com.roomify.dto.HouseholdCreateRequest;
import com.roomify.dto.HouseholdResponse;
import com.roomify.dto.HouseholdUpdateRequest;
import com.roomify.exception.ResourceNotFoundException;
import com.roomify.service.HouseholdService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class HouseholdServiceImpl implements HouseholdService {

    private final HouseholdRepository householdRepository;

    @Override
    public HouseholdResponse createHousehold(HouseholdCreateRequest request) {
        log.debug("Creating household with name: {}", request.name);
        
        Household household = new Household();
        household.setName(request.name);
        household.setDescription(request.description);
        
        // Map address if provided
        if (request.address != null) {
            Address address = new Address();
            address.setStreet(request.address.street);
            address.setCity(request.address.city);
            address.setState(request.address.state);
            address.setZipCode(request.address.zipCode);
            address.setCountry(request.address.country);
            household.setAddress(address);
        }
        
        household.setInviteCode(generateInviteCode());
        household.setMaxMembers(request.maxMembers != null ? request.maxMembers : 10);
        household.setStatus(HouseholdStatus.ACTIVE);
        household.setRules(request.rules != null ? request.rules : new ArrayList<>());
        
        Household savedHousehold = householdRepository.save(household);
        return mapToResponse(savedHousehold);
    }

    @Override
    @Transactional(readOnly = true)
    public HouseholdResponse getHouseholdById(String id) {
        log.debug("Getting household by id: {}", id);
        Household household = householdRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Household not found with id: " + id));
        return mapToResponse(household);
    }

    @Override
    public HouseholdResponse updateHousehold(String id, HouseholdUpdateRequest request) {
        log.debug("Updating household with id: {}", id);
        Household household = householdRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Household not found with id: " + id));
        
        household.setName(request.name);
        household.setDescription(request.description);
        
        if (request.address != null) {
            Address address = new Address();
            address.setStreet(request.address.street);
            address.setCity(request.address.city);
            address.setState(request.address.state);
            address.setZipCode(request.address.zipCode);
            address.setCountry(request.address.country);
            household.setAddress(address);
        }
        
        if (request.maxMembers != null) {
            household.setMaxMembers(request.maxMembers);
        }
        
        if (request.rules != null) {
            household.setRules(request.rules);
        }
        
        Household updatedHousehold = householdRepository.save(household);
        return mapToResponse(updatedHousehold);
    }

    @Override
    public void deleteHousehold(String id) {
        log.debug("Deleting household with id: {}", id);
        if (!householdRepository.existsById(id)) {
            throw new ResourceNotFoundException("Household not found with id: " + id);
        }
        householdRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<HouseholdResponse> getAllHouseholds() {
        log.debug("Getting all households");
        return householdRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<HouseholdResponse> getHouseholdsByUserId(String userId) {
        log.debug("Getting households by user id: {}", userId);
        // TODO: Implement after HouseholdMember relationship is established
        return new ArrayList<>();
    }

    @Override
    @Transactional(readOnly = true)
    public HouseholdResponse getHouseholdByInviteCode(String inviteCode) {
        log.debug("Getting household by invite code: {}", inviteCode);
        Household household = householdRepository.findByInviteCode(inviteCode)
                .orElseThrow(() -> new ResourceNotFoundException("Household not found with invite code: " + inviteCode));
        return mapToResponse(household);
    }
    
    private HouseholdResponse mapToResponse(Household household) {
        HouseholdResponse response = new HouseholdResponse();
        response.id = household.getId();
        response.name = household.getName();
        response.description = household.getDescription();
        
        if (household.getAddress() != null) {
            AddressDto addressDto = new AddressDto();
            addressDto.street = household.getAddress().getStreet();
            addressDto.city = household.getAddress().getCity();
            addressDto.state = household.getAddress().getState();
            addressDto.zipCode = household.getAddress().getZipCode();
            addressDto.country = household.getAddress().getCountry();
            response.address = addressDto;
        }
        
        response.inviteCode = household.getInviteCode();
        response.maxMembers = household.getMaxMembers();
        response.status = household.getStatus();
        response.rules = household.getRules();
        response.createdAt = household.getCreatedAt();
        response.updatedAt = household.getUpdatedAt();
        
        return response;
    }
    
    private String generateInviteCode() {
        // Generate a random 6-character invite code
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        Random random = new Random();
        StringBuilder code = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            code.append(chars.charAt(random.nextInt(chars.length())));
        }
        return code.toString();
    }
}
