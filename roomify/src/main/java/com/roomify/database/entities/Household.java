package com.roomify.database.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "households", indexes = {
    @Index(name = "idx_household_invite_code", columnList = "inviteCode", unique = true),
    @Index(name = "idx_household_status", columnList = "status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Household extends BaseEntity {

    @NotBlank
    @Size(max = 100)
    @Column(nullable = false)
    private String name;

    @Size(max = 500)
    @Column(length = 500)
    private String description;

    @Embedded
    private Address address;

    @NotBlank
    @Column(nullable = false, unique = true)
    private String inviteCode;

    @Column(nullable = false)
    private Integer maxMembers = 10;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private HouseholdStatus status = HouseholdStatus.ACTIVE;

    @OneToMany(mappedBy = "household", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<HouseholdMember> members = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "household_rules", joinColumns = @JoinColumn(name = "household_id"))
    @Column(name = "rule")
    private List<String> rules = new ArrayList<>();
}
