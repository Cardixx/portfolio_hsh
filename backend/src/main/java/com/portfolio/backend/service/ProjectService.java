package com.portfolio.backend.service;

import com.portfolio.backend.model.Project;
import com.portfolio.backend.repository.ProjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAllByOrderBySortOrderAscCreatedAtDesc();
    }

    public List<Project> getFeaturedProjects() {
        return projectRepository.findByFeaturedTrueOrderBySortOrderAscCreatedAtDesc();
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
    }

    @Transactional
    public Project createProject(Project project) {
        return projectRepository.save(project);
    }

    @Transactional
    public Project updateProject(Long id, Project updated) {
        Project existing = getProjectById(id);

        existing.setTitle(updated.getTitle());
        existing.setSubtitle(updated.getSubtitle());
        existing.setDescription(updated.getDescription());
        existing.setLongDescription(updated.getLongDescription());
        existing.setStack(updated.getStack());
        existing.setAccent(updated.getAccent());
        existing.setTag(updated.getTag());
        existing.setYear(updated.getYear());
        existing.setPresentationImageUrl(updated.getPresentationImageUrl());
        existing.setPresentationVideoUrl(updated.getPresentationVideoUrl());
        existing.setGalleryImages(updated.getGalleryImages());
        existing.setGithubUrl(updated.getGithubUrl());
        existing.setLiveDemoUrl(updated.getLiveDemoUrl());
        existing.setFeatured(updated.isFeatured());
        existing.setSortOrder(updated.getSortOrder());

        return projectRepository.save(existing);
    }

    @Transactional
    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }

    @Transactional
    public void recordView(Long id) {
        if (projectRepository.existsById(id)) {
            projectRepository.incrementViewCount(id);
        }
    }
}
