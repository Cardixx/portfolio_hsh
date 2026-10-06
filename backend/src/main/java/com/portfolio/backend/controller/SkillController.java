package com.portfolio.backend.controller;

import com.portfolio.backend.model.Skill;
import com.portfolio.backend.service.SkillService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/skills")
public class SkillController {

    private final SkillService skillService;

    public SkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    @GetMapping
    public ResponseEntity<List<Skill>> getAllSkills(@RequestParam(required = false) String category) {
        if (category != null && !category.isBlank()) {
            return ResponseEntity.ok(skillService.getSkillsByCategory(category));
        }
        return ResponseEntity.ok(skillService.getAllSkills());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Skill> getSkillById(@PathVariable Long id) {
        return ResponseEntity.ok(skillService.getSkillById(id));
    }

    @PostMapping
    public ResponseEntity<Skill> createSkill(@RequestBody Skill skill) {
        return ResponseEntity.ok(skillService.createSkill(skill));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Skill> updateSkill(@PathVariable Long id, @RequestBody Skill skill) {
        return ResponseEntity.ok(skillService.updateSkill(id, skill));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSkill(@PathVariable Long id) {
        skillService.deleteSkill(id);
        return ResponseEntity.ok(Map.of("message", "Skill deleted successfully"));
    }
}
