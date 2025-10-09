package com.roomify.database.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Index;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.CascadeType;
import jakarta.persistence.FetchType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "households")
public class Household {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @NotBlank(message = "Household name is required")
    @Size(max = 100, message = "Household name must not exceed 100 characters")
    @Column(nullable = false, length = 100)
    private String name;
    
    @Size(max = 500, message = "Description must not exceed 500 characters")
    @Column(length = 500)
    private String description;
    
    @Size(max = 200, message = "Address must not exceed 200 characters")
    @Column(length = 200)
    private String address;
    
    @Size(max = 100, message = "City must not exceed 100 characters")
    @Column(length = 100)
    private String city;
    
    @Size(max = 100, message = "State must not exceed 100 characters")
    @Column(length = 100)
    private String state;
    
    @Size(max = 20, message = "Postal code must not exceed 20 characters")
    @Column(name = "postal_code", length = 20)
    private String postalCode;
    
    @Size(max = 100, message = "Country must not exceed 100 characters")
    @Column(length = 100)
    private String country;
    
    @Column(name = "max_members")
    private Integer maxMembers;
    
    @Column(name = "invite_code", unique = true)
    private String inviteCode;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private HouseholdStatus status = HouseholdStatus.ACTIVE;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at", nullable = false)
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "household", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<User> members = new HashSet<>();
    
    @OneToMany(mappedBy = "household", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Expense> expenses = new HashSet<>();
    
    @OneToMany(mappedBy = "household", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Chore> chores = new HashSet<>();
    
    @OneToMany(mappedBy = "household", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Reminder> reminders = new HashSet<>();
    
    @OneToMany(mappedBy = "household", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Notification> notifications = new HashSet<>();
    
    // Constructors
    public Household() {}
    
    public Household(String name) {
        this.name = name;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    
    public String getPostalCode() { return postalCode; }
    public void setPostalCode(String postalCode) { this.postalCode = postalCode; }
    
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
    
    public Integer getMaxMembers() { return maxMembers; }
    public void setMaxMembers(Integer maxMembers) { this.maxMembers = maxMembers; }
    
    public String getInviteCode() { return inviteCode; }
    public void setInviteCode(String inviteCode) { this.inviteCode = inviteCode; }
    
    public HouseholdStatus getStatus() { return status; }
    public void setStatus(HouseholdStatus status) { this.status = status; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public Set<User> getMembers() { return members; }
    public void setMembers(Set<User> members) { this.members = members; }
    
    public Set<Expense> getExpenses() { return expenses; }
    public void setExpenses(Set<Expense> expenses) { this.expenses = expenses; }
    
    public Set<Chore> getChores() { return chores; }
    public void setChores(Set<Chore> chores) { this.chores = chores; }
    
    public Set<Reminder> getReminders() { return reminders; }
    public void setReminders(Set<Reminder> reminders) { this.reminders = reminders; }
    
    public Set<Notification> getNotifications() { return notifications; }
    public void setNotifications(Set<Notification> notifications) { this.notifications = notifications; }
    
    // Helper methods
    public String getFullAddress() {
        StringBuilder address = new StringBuilder();
        if (this.address != null && !this.address.trim().isEmpty()) {
            address.append(this.address);
        }
        if (this.city != null && !this.city.trim().isEmpty()) {
            if (address.length() > 0) address.append(", ");
            address.append(this.city);
        }
        if (this.state != null && !this.state.trim().isEmpty()) {
            if (address.length() > 0) address.append(", ");
            address.append(this.state);
        }
        if (this.postalCode != null && !this.postalCode.trim().isEmpty()) {
            if (address.length() > 0) address.append(" ");
            address.append(this.postalCode);
        }
        if (this.country != null && !this.country.trim().isEmpty()) {
            if (address.length() > 0) address.append(", ");
            address.append(this.country);
        }
        return address.toString();
    }
    
    public int getMemberCount() {
        return members != null ? members.size() : 0;
    }
    
    public boolean isFull() {
        return maxMembers != null && getMemberCount() >= maxMembers;
    }
    
    public boolean canAddMember() {
        return !isFull() && status == HouseholdStatus.ACTIVE;
    }
    
    // toString, equals, hashCode
    @Override
    public String toString() {
        return "Household{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", city='" + city + '\'' +
                ", state='" + state + '\'' +
                ", status=" + status +
                ", memberCount=" + getMemberCount() +
                '}';
    }
}

