package com.roomify.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_user_email", columnList = "email"),
    @Index(name = "idx_user_username", columnList = "username")
})
public class User implements UserDetails {

    @Override
    public String getUsername() {
        return email; // Assuming email is used as the username
    }
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    // Username field removed to match schema.sql
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Column(unique = true, nullable = false)
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    @Column(nullable = false)
    private String password;
    
    @NotBlank(message = "First name is required")
    @Size(max = 100, message = "First name must not exceed 100 characters")
    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;
    
    @Size(max = 100, message = "Last name must not exceed 100 characters")
    @Column(name = "last_name", length = 100)
    private String lastName;
    
    @Size(max = 20, message = "Nickname must not exceed 20 characters")
    @Column(length = 20)
    private String nickname;
    
    @Size(max = 500, message = "Bio must not exceed 500 characters")
    @Column(length = 500)
    private String bio;
    
    @Column(name = "profile_picture")
    private String profilePicture;
    
    @Column(name = "phone_number")
    private String phoneNumber;
    
    @Column(name = "date_of_birth")
    private LocalDateTime dateOfBirth;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role = UserRole.USER;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserStatus status = UserStatus.ACTIVE;
    
    @Column(name = "email_verified")
    private boolean emailVerified = false;
    
    @Column(name = "last_login")
    private LocalDateTime lastLogin;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at", nullable = false)
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "household_id")
    private Household household;
    
    @OneToMany(mappedBy = "paidBy", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Expense> expenses = new HashSet<>();
    
    @OneToMany(mappedBy = "assignedTo", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Chore> assignedChores = new HashSet<>();
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Reminder> reminders = new HashSet<>();
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Notification> notifications = new HashSet<>();
    
    // Constructors
    public User() {}
    
    public User(String email, String password, String firstName) {
        this.email = email;
        this.password = password;
        this.firstName = firstName;
    }
    
    // UserDetails implementation
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Set.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }
    
    @Override
    public boolean isAccountNonExpired() {
        return status != UserStatus.EXPIRED;
    }
    
    @Override
    public boolean isAccountNonLocked() {
        return status != UserStatus.LOCKED;
    }
    
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
    
    @Override
    public boolean isEnabled() {
        return status == UserStatus.ACTIVE;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    // getUsername and setUsername removed to match schema.sql
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    
    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }
    
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    
    public String getProfilePicture() { return profilePicture; }
    public void setProfilePicture(String profilePicture) { this.profilePicture = profilePicture; }
    
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    
    public LocalDateTime getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDateTime dateOfBirth) { this.dateOfBirth = dateOfBirth; }
    
    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }
    
    public UserStatus getStatus() { return status; }
    public void setStatus(UserStatus status) { this.status = status; }
    
    public boolean isEmailVerified() { return emailVerified; }
    public void setEmailVerified(boolean emailVerified) { this.emailVerified = emailVerified; }
    
    public LocalDateTime getLastLogin() { return lastLogin; }
    public void setLastLogin(LocalDateTime lastLogin) { this.lastLogin = lastLogin; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public Household getHousehold() { return household; }
    public void setHousehold(Household household) { this.household = household; }
    
    public Set<Expense> getExpenses() { return expenses; }
    public void setExpenses(Set<Expense> expenses) { this.expenses = expenses; }
    
    public Set<Chore> getAssignedChores() { return assignedChores; }
    public void setAssignedChores(Set<Chore> assignedChores) { this.assignedChores = assignedChores; }
    
    public Set<Reminder> getReminders() { return reminders; }
    public void setReminders(Set<Reminder> reminders) { this.reminders = reminders; }
    
    public Set<Notification> getNotifications() { return notifications; }
    public void setNotifications(Set<Notification> notifications) { this.notifications = notifications; }
    
    // Helper methods
    public String getFullName() {
        if (lastName != null && !lastName.trim().isEmpty()) {
            return firstName + " " + lastName;
        }
        return firstName;
    }
    
    public String getDisplayName() {
        return nickname != null && !nickname.trim().isEmpty() ? nickname : getFullName();
    }
    
    public String getInitials() {
        String first = firstName != null && !firstName.isEmpty() ? firstName.substring(0, 1).toUpperCase() : "";
        String last = lastName != null && !lastName.isEmpty() ? lastName.substring(0, 1).toUpperCase() : "";
        return first + last;
    }
    
    // toString, equals, hashCode
    @Override
    public String toString() {
        return "User{" +
                "id='" + id + '\'' +
                ", email='" + email + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", role=" + role +
                ", status=" + status +
                '}';
    }

}
