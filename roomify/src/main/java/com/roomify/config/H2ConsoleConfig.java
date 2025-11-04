package com.roomify.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;

/**
 * Configuration for H2 Console accessibility.
 * The H2 console is enabled in application.properties and can be accessed at:
 * http://localhost:8080/api/h2-console
 * 
 * Connection details:
 * JDBC URL: jdbc:h2:mem:roomify_dev
 * Username: sa
 * Password: (leave blank)
 */
@Configuration
@ConditionalOnProperty(name = "spring.h2.console.enabled", havingValue = "true")
@Order(Ordered.HIGHEST_PRECEDENCE)
public class H2ConsoleConfig {
    // H2 console is configured in application.properties
    // No additional configuration needed as Spring Boot auto-configures it
}
