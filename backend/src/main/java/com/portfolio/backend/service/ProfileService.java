package com.portfolio.backend.service;

import com.portfolio.backend.model.Profile;
import com.portfolio.backend.repository.ProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProfileService {

    private final ProfileRepository profileRepository;

    public ProfileService(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    public Profile getProfile() {
        return profileRepository.findFirstByOrderByIdAsc()
                .orElseGet(() -> {
                    Profile defaultProfile = new Profile();
                    defaultProfile.setBio("I'm a Computer Science student passionate about web development and digital solutions. My focus is on building secure and scalable web applications that solve real problems.\n\nCapable of developing full-stack systems with a user-centered approach — I move comfortably between crafting clean React interfaces and architecting robust Laravel & Node.js APIs.\n\nI care deeply about code quality, performance, and writing software that I'd be proud to maintain six months later.");
                    return profileRepository.save(defaultProfile);
                });
    }

    @Transactional
    public Profile updateProfile(Profile updated) {
        Profile existing = getProfile();

        existing.setFullName(updated.getFullName());
        existing.setTitle(updated.getTitle());
        existing.setSubtitle(updated.getSubtitle());
        existing.setBio(updated.getBio());
        existing.setCurrentStatus(updated.getCurrentStatus());
        existing.setLanguages(updated.getLanguages());
        existing.setFocus(updated.getFocus());
        existing.setLocation(updated.getLocation());
        existing.setEmail(updated.getEmail());
        existing.setGithubUrl(updated.getGithubUrl());
        existing.setLinkedinUrl(updated.getLinkedinUrl());
        existing.setHeroImageUrl(updated.getHeroImageUrl());
        existing.setResumeUrl(updated.getResumeUrl());

        return profileRepository.save(existing);
    }
}
