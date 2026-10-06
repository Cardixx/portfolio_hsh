package com.portfolio.backend.service;

import com.portfolio.backend.model.Skill;
import com.portfolio.backend.repository.SkillRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SkillService {

    private final SkillRepository skillRepository;

    public SkillService(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    public List<Skill> getAllSkills() {
        return skillRepository.findAllByOrderByCategoryAscSortOrderAsc();
    }

    public List<Skill> getSkillsByCategory(String category) {
        return skillRepository.findByCategoryOrderBySortOrderAsc(category);
    }

    public Skill getSkillById(Long id) {
        return skillRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Skill not found with id: " + id));
    }

    @Transactional
    public Skill createSkill(Skill skill) {
        return skillRepository.save(skill);
    }

    @Transactional
    public Skill updateSkill(Long id, Skill updated) {
        Skill existing = getSkillById(id);
        existing.setName(updated.getName());
        existing.setCategory(updated.getCategory());
        existing.setSortOrder(updated.getSortOrder());
        return skillRepository.save(existing);
    }

    @Transactional
    public void deleteSkill(Long id) {
        skillRepository.deleteById(id);
    }
}
