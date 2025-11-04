package com.roomify.database.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(name = "household_members", indexes = {
    @Index(name = "idx_household_member_user", columnList = "user_id"),
    @Index(name = "idx_household_member_household", columnList = "household_id"),
    @Index(name = "idx_household_member_status", columnList = "status")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HouseholdMember extends BaseEntity {

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "household_id", nullable = false)
    private Household household;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private HouseholdMemberRole role = HouseholdMemberRole.MEMBER;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private HouseholdMemberStatus status = HouseholdMemberStatus.ACTIVE;
}
