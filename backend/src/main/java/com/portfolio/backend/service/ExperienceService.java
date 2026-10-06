package com.portfolio.backend.service;

import com.portfolio.backend.model.Experience;
import com.portfolio.backend.repository.ExperienceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ExperienceService {

    private final ExperienceRepository experienceRepository;

    public ExperienceService(ExperienceRepository experienceRepository) {
        this.experienceRepository = experienceRepository;
    }

    public List<Experience> getAllExperiences() {
        return experienceRepository.findAllByOrderBySortOrderAscCreatedAtDesc();
    }

    public Experience getExperienceById(Long id) {
        return experienceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Experience not found with id: " + id));
    }

    @Transactional
    public Experience createExperience(Experience experience) {
        return experienceRepository.save(experience);
    }

    @Transactional
    public Experience updateExperience(Long id, Experience updated) {
        Experience existing = getExperienceById(id);

        existing.setTitle(updated.getTitle());
        existing.setCompany(updated.getCompany());
        existing.setPeriod(updated.getPeriod());
        existing.setDescription(updated.getDescription());
        existing.setSkills(updated.getSkills());
        existing.setSortOrder(updated.getSortOrder());

        return experienceRepository.save(existing);
    }

    @Transactional
    public void deleteExperience(Long id) {
        experienceRepository.deleteById(id);
    }
}
