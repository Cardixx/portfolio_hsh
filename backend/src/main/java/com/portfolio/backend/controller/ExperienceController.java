package com.portfolio.backend.controller;

import com.portfolio.backend.model.Experience;
import com.portfolio.backend.service.ExperienceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/experiences")
public class ExperienceController {

    private final ExperienceService experienceService;

    public ExperienceController(ExperienceService experienceService) {
        this.experienceService = experienceService;
    }

    @GetMapping
    public ResponseEntity<List<Experience>> getAllExperiences() {
        return ResponseEntity.ok(experienceService.getAllExperiences());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Experience> getExperienceById(@PathVariable Long id) {
        return ResponseEntity.ok(experienceService.getExperienceById(id));
    }

    @PostMapping
    public ResponseEntity<Experience> createExperience(@RequestBody Experience experience) {
        return ResponseEntity.ok(experienceService.createExperience(experience));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Experience> updateExperience(@PathVariable Long id, @RequestBody Experience experience) {
        return ResponseEntity.ok(experienceService.updateExperience(id, experience));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExperience(@PathVariable Long id) {
        experienceService.deleteExperience(id);
        return ResponseEntity.ok(Map.of("message", "Experience deleted successfully"));
    }
}
