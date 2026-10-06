package com.portfolio.backend.controller;

import com.portfolio.backend.model.Project;
import com.portfolio.backend.service.ProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects(@RequestParam(required = false) Boolean featured) {
        if (Boolean.TRUE.equals(featured)) {
            return ResponseEntity.ok(projectService.getFeaturedProjects());
        }
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }

    @PostMapping
    public ResponseEntity<Project> createProject(@RequestBody Project project) {
        return ResponseEntity.ok(projectService.createProject(project));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable Long id, @RequestBody Project project) {
        return ResponseEntity.ok(projectService.updateProject(id, project));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.ok(Map.of("message", "Project deleted successfully"));
    }

    @PostMapping("/{id}/view")
    public ResponseEntity<?> recordView(@PathVariable Long id) {
        projectService.recordView(id);
        return ResponseEntity.ok(Map.of("message", "View recorded"));
    }
}
