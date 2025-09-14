package com.roomify.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestDbController {
    
    @GetMapping("/ping")
    public String ping() {
        return "Pong! Database connection is working.";
    }
}
