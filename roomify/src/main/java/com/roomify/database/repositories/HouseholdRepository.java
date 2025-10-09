package com.roomify.database.repositories;

import com.roomify.database.entities.Household;
import com.roomify.database.entities.HouseholdStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HouseholdRepository extends JpaRepository<com.roomify.database.entities.Household, String> {
    
    Optional<Household> findByInviteCode(String inviteCode);
    
    List<Household> findByStatus(HouseholdStatus status);
    
    List<Household> findByNameContainingIgnoreCase(String name);
    
    @Query("SELECT h FROM Household h WHERE h.name LIKE %:searchTerm% OR h.description LIKE %:searchTerm% OR h.city LIKE %:searchTerm% OR h.state LIKE %:searchTerm%")
    Page<Household> findBySearchTerm(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    @Query("SELECT h FROM Household h WHERE h.status = :status AND (h.name LIKE %:searchTerm% OR h.description LIKE %:searchTerm% OR h.city LIKE %:searchTerm% OR h.state LIKE %:searchTerm%)")
    Page<Household> findByStatusAndSearchTerm(@Param("status") HouseholdStatus status, @Param("searchTerm") String searchTerm, Pageable pageable);
    
    @Query("SELECT h FROM Household h ORDER BY h.createdAt DESC")
    Page<Household> findAllOrderByCreatedAtDesc(Pageable pageable);
    
    @Query("SELECT h FROM Household h WHERE h.status = :status ORDER BY h.createdAt DESC")
    Page<Household> findByStatusOrderByCreatedAtDesc(@Param("status") HouseholdStatus status, Pageable pageable);
    
    @Query("SELECT h FROM Household h WHERE h.city = :city ORDER BY h.createdAt DESC")
    List<Household> findByCityOrderByCreatedAtDesc(@Param("city") String city);
    
    @Query("SELECT h FROM Household h WHERE h.state = :state ORDER BY h.createdAt DESC")
    List<Household> findByStateOrderByCreatedAtDesc(@Param("state") String state);
    
    @Query("SELECT h FROM Household h WHERE h.country = :country ORDER BY h.createdAt DESC")
    List<Household> findByCountryOrderByCreatedAtDesc(@Param("country") String country);
    
    @Query("SELECT h FROM Household h WHERE h.city = :city AND h.status = :status ORDER BY h.createdAt DESC")
    List<Household> findByCityAndStatusOrderByCreatedAtDesc(@Param("city") String city, @Param("status") HouseholdStatus status);
    
    @Query("SELECT h FROM Household h WHERE h.state = :state AND h.status = :status ORDER BY h.createdAt DESC")
    List<Household> findByStateAndStatusOrderByCreatedAtDesc(@Param("state") String state, @Param("status") HouseholdStatus status);
    
    @Query("SELECT h FROM Household h WHERE h.country = :country AND h.status = :status ORDER BY h.createdAt DESC")
    List<Household> findByCountryAndStatusOrderByCreatedAtDesc(@Param("country") String country, @Param("status") HouseholdStatus status);
    
    @Query("SELECT h.city, COUNT(h) FROM Household h WHERE h.status = :status GROUP BY h.city ORDER BY COUNT(h) DESC")
    List<Object[]> getCityCountsByStatus(@Param("status") HouseholdStatus status);
    
    @Query("SELECT h.state, COUNT(h) FROM Household h WHERE h.status = :status GROUP BY h.state ORDER BY COUNT(h) DESC")
    List<Object[]> getStateCountsByStatus(@Param("status") HouseholdStatus status);
    
    @Query("SELECT h.country, COUNT(h) FROM Household h WHERE h.status = :status GROUP BY h.country ORDER BY COUNT(h) DESC")
    List<Object[]> getCountryCountsByStatus(@Param("status") HouseholdStatus status);
    
    @Query("SELECT COUNT(h) FROM Household h WHERE h.status = :status")
    long countByStatus(@Param("status") HouseholdStatus status);
    
    @Query("SELECT COUNT(h) FROM Household h WHERE h.city = :city")
    long countByCity(@Param("city") String city);
    
    @Query("SELECT COUNT(h) FROM Household h WHERE h.state = :state")
    long countByState(@Param("state") String state);
    
    @Query("SELECT COUNT(h) FROM Household h WHERE h.country = :country")
    long countByCountry(@Param("country") String country);
    
    @Query("SELECT h FROM Household h WHERE h.maxMembers IS NOT NULL AND h.maxMembers <= (SELECT COUNT(u) FROM User u WHERE u.household.id = h.id)")
    List<Household> findFullHouseholds();
    
    @Query("SELECT h FROM Household h WHERE h.maxMembers IS NOT NULL AND h.maxMembers > (SELECT COUNT(u) FROM User u WHERE u.household.id = h.id)")
    List<Household> findAvailableHouseholds();
    
    @Query("SELECT h FROM Household h WHERE h.maxMembers IS NOT NULL AND h.maxMembers > (SELECT COUNT(u) FROM User u WHERE u.household.id = h.id) AND h.status = :status")
    List<Household> findAvailableHouseholdsByStatus(@Param("status") HouseholdStatus status);
    
    @Query("SELECT h FROM Household h WHERE h.maxMembers IS NOT NULL AND h.maxMembers > (SELECT COUNT(u) FROM User u WHERE u.household.id = h.id) AND h.city = :city AND h.status = :status")
    List<Household> findAvailableHouseholdsByCityAndStatus(@Param("city") String city, @Param("status") HouseholdStatus status);
    
    @Query("SELECT h FROM Household h WHERE h.maxMembers IS NOT NULL AND h.maxMembers > (SELECT COUNT(u) FROM User u WHERE u.household.id = h.id) AND h.state = :state AND h.status = :status")
    List<Household> findAvailableHouseholdsByStateAndStatus(@Param("state") String state, @Param("status") HouseholdStatus status);
    
    @Query("SELECT h FROM Household h WHERE h.maxMembers IS NOT NULL AND h.maxMembers > (SELECT COUNT(u) FROM User u WHERE u.household.id = h.id) AND h.country = :country AND h.status = :status")
    List<Household> findAvailableHouseholdsByCountryAndStatus(@Param("country") String country, @Param("status") HouseholdStatus status);
}
