package com.roomify.database;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Test class to verify database connectivity
 */
@SpringBootTest
@ActiveProfiles("test")
public class DatabaseConnectionTest {

    @Autowired
    private DataSource dataSource;

    @Test
    public void testDatabaseConnection() throws SQLException {
        assertNotNull(dataSource, "DataSource should be autowired");
        
        try (Connection connection = dataSource.getConnection()) {
            assertTrue(connection.isValid(5), "Connection should be valid");
            assertFalse(connection.isClosed(), "Connection should not be closed");
            
            System.out.println("✅ Database connection successful!");
            System.out.println("   Database: " + connection.getMetaData().getDatabaseProductName());
            System.out.println("   Version: " + connection.getMetaData().getDatabaseProductVersion());
            System.out.println("   URL: " + connection.getMetaData().getURL());
        }
    }
    
    @Test
    public void testDataSourceConfiguration() {
        assertNotNull(dataSource, "DataSource should not be null");
        System.out.println("✅ DataSource configuration successful!");
    }
}
