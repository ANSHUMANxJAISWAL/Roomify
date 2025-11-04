package com.roomify.test;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
@TestPropertySource(properties = {
    "spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration"
})
public class DatabaseConnectionTest {

    @Autowired
    private TestRepository testRepository;

    @Test
    public void testDatabaseConnection() {
        // Create and save a test entity
        TestEntity entity = new TestEntity();
        entity.setId("test-1");
        entity.setName("Test Entity");
        
        TestEntity saved = testRepository.save(entity);
        assertNotNull(saved);
        
        // Retrieve the entity
        TestEntity found = testRepository.findById("test-1").orElse(null);
        assertNotNull(found);
        assertEquals("Test Entity", found.getName());
    }
}
