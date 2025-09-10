package com.roomify.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtTokenProvider {
    
    private static final Logger log = LoggerFactory.getLogger(JwtTokenProvider.class);
    
    @Value("${spring.security.jwt.secret}")
    private String jwtSecret;
    
    @Value("${spring.security.jwt.access-token-validity}")
    private long jwtAccessTokenValidity;
    
    @Value("${spring.security.jwt.refresh-token-validity}")
    private long jwtRefreshTokenValidity;
    
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }
    
    public String generateAccessToken(Authentication authentication) {
        UserDetails userPrincipal = (UserDetails) authentication.getPrincipal();
        return generateAccessToken(userPrincipal.getUsername());
    }
    
    public String generateAccessToken(String username) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtAccessTokenValidity);
        
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .setIssuer("roomify")
                .setAudience("roomify-users")
                .claim("type", "access")
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }
    
    public String generateRefreshToken(Authentication authentication) {
        UserDetails userPrincipal = (UserDetails) authentication.getPrincipal();
        return generateRefreshToken(userPrincipal.getUsername());
    }
    
    public String generateRefreshToken(String username) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtRefreshTokenValidity);
        
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .setIssuer("roomify")
                .setAudience("roomify-users")
                .claim("type", "refresh")
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }
    
    public String generatePasswordResetToken(String username) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + 3600000); // 1 hour
        
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .setIssuer("roomify")
                .setAudience("roomify-users")
                .claim("type", "password-reset")
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }
    
    public String generateEmailVerificationToken(String username) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + 86400000); // 24 hours
        
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .setIssuer("roomify")
                .setAudience("roomify-users")
                .claim("type", "email-verification")
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }
    
    /**
     * Extract claims from JWT token
     * @param token The JWT token
     * @return Claims object containing token data
     * @throws JwtException if the token is invalid
     */
    private Claims getClaimsFromToken(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (SignatureException ex) {
            log.error("Invalid JWT signature");
            throw ex;
        } catch (MalformedJwtException ex) {
            log.error("Invalid JWT token");
            throw ex;
        } catch (ExpiredJwtException ex) {
            log.error("Expired JWT token");
            throw ex;
        } catch (UnsupportedJwtException ex) {
            log.error("Unsupported JWT token");
            throw ex;
        } catch (IllegalArgumentException ex) {
            log.error("JWT claims string is empty");
            throw ex;
        }
    }
    
    public String getUserIdFromToken(String token) {
        try {
            return getClaimsFromToken(token).getSubject();
        } catch (Exception ex) {
            log.error("Error extracting user ID from token: {}", ex.getMessage());
            return null;
        }
    }
    
    public String getUsernameFromToken(String token) {
        return getUserIdFromToken(token);
    }
    
    public Date getExpirationDateFromToken(String token) {
        try {
            return getClaimsFromToken(token).getExpiration();
        } catch (Exception ex) {
            log.error("Error extracting expiration date from token: {}", ex.getMessage());
            return null;
        }
    }
    
    public boolean validateAccessToken(String token) {
        return validateToken(token, "access");
    }
    
    public boolean validateRefreshToken(String token) {
        return validateToken(token, "refresh");
    }
    
    public boolean validatePasswordResetToken(String token) {
        return validateToken(token, "password-reset");
    }
    
    public boolean validateEmailVerificationToken(String token) {
        return validateToken(token, "email-verification");
    }
    
    /**
     * Common method to validate any type of JWT token
     * @param token The JWT token to validate
     * @param expectedType The expected token type ("access", "refresh", etc.)
     * @return true if the token is valid and of the expected type, false otherwise
     */
    private boolean validateToken(String token, String expectedType) {
        if (token == null) {
            log.error("Token is null");
            return false;
        }
        
        try {
            // Parse the token once to get claims
            Claims claims = getClaimsFromToken(token);
            
            // Check if it's the expected token type
            String tokenType = claims.get("type", String.class);
            if (!expectedType.equals(tokenType)) {
                log.warn("Invalid token type: {}, expected: {}", tokenType, expectedType);
                return false;
            }
            
            // Check if token is expired
            if (isTokenExpired(token)) {
                log.warn("Token is expired");
                return false;
            }
            
            return true;
        } catch (SignatureException ex) {
            log.error("Invalid JWT signature");
        } catch (MalformedJwtException ex) {
            log.error("Invalid JWT token");
        } catch (ExpiredJwtException ex) {
            log.error("Expired JWT token");
        } catch (UnsupportedJwtException ex) {
            log.error("Unsupported JWT token");
        } catch (IllegalArgumentException ex) {
            log.error("JWT claims string is empty");
        } catch (Exception ex) {
            log.error("Unexpected error validating token: {}", ex.getMessage());
        }
        return false;
    }
    
    public boolean isTokenExpired(String token) {
        if (token == null) {
            return true;
        }
        
        try {
            Date expiration = getExpirationDateFromToken(token);
            if (expiration == null) {
                return true;
            }
            return expiration.before(new Date());
        } catch (ExpiredJwtException ex) {
            log.warn("Token is expired");
            return true;
        } catch (Exception ex) {
            log.error("Error checking token expiration: {}", ex.getMessage());
            return true;
        }
    }
}
