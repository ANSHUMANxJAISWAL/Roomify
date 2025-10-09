package com.roomify.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

/**
 * Cache configuration for the application.
 * Provides a cacheManager bean required by UserDetailsServiceImpl.
 */
@Configuration
@EnableCaching
public class CacheConfig {

    /**
     * Creates a simple in-memory cache manager.
     * This is required by UserDetailsServiceImpl for caching user details.
     *
     * @return the cache manager
     */
    @Bean
    @Primary
    public CacheManager cacheManager() {
        return new ConcurrentMapCacheManager("users");
    }
}
