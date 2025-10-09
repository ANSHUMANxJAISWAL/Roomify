package com.roomify.test;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EntityScan({"com.roomify.test", "com.roomify.database.entities"})
@EnableJpaRepositories({"com.roomify.test", "com.roomify.database.repositories"})
public class TestConfig {
}
