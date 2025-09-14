package com.roomify.security;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.lang.NonNull;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    @Autowired
    private UserDetailsServiceImpl userDetailsService;
    
    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, 
                                  @NonNull HttpServletResponse response, 
                                  @NonNull FilterChain filterChain) throws ServletException, IOException {
        
        try {
            String jwt = getJwtFromRequest(request);
            
            if (StringUtils.hasText(jwt)) {
                if (jwtTokenProvider.validateAccessToken(jwt)) {
                    String username = jwtTokenProvider.getUsernameFromToken(jwt);
                    
                    if (username != null) {
                        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                        
                        if (userDetails != null && userDetails.isEnabled()) {
                            UsernamePasswordAuthenticationToken authentication = 
                                new UsernamePasswordAuthenticationToken(
                                    userDetails, 
                                    null, 
                                    userDetails.getAuthorities()
                                );
                            
                            authentication.setDetails(
                                new WebAuthenticationDetailsSource().buildDetails(request)
                            );
                            
                            SecurityContextHolder.getContext().setAuthentication(authentication);
                            log.debug("Successfully authenticated user: {}", username);
                        } else {
                            log.warn("User not found or disabled: {}", username);
                        }
                    } else {
                        log.warn("Could not extract username from token");
                    }
                } else {
                    log.warn("Invalid JWT token");
                }
            } else {
                log.trace("No JWT token found in request");
            }
        } catch (ExpiredJwtException ex) {
            log.warn("Expired JWT token: {}", ex.getMessage());
            String requestURI = request.getRequestURI();
            if (!requestURI.contains("/auth/refresh")) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\":\"JWT token has expired\"}");
                return;
            }
        } catch (Exception ex) {
            log.error("Authentication error: {}", ex.getMessage(), ex);
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"Authentication failed: " + ex.getMessage() + "\"}");
            return;
        }
        
        filterChain.doFilter(request, response);
    }
    
    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            try {
                return bearerToken.substring(7);
            } catch (IndexOutOfBoundsException ex) {
                log.error("Invalid Bearer token format");
                return null;
            }
        }
        
        return null;
    }
}
