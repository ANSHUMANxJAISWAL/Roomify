package com.roomify.test;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestController {
    private final TestRepository testRepository;

    public TestController(TestRepository testRepository) {
        this.testRepository = testRepository;
    }

    @GetMapping("/db")
    public String testDb() {
        TestEntity entity = new TestEntity();
        entity.setId("1");
        entity.setName("Test");
        testRepository.save(entity);
        return "Database test successful!";
    }
}
