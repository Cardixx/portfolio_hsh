package com.portfolio.backend.controller;

import com.portfolio.backend.model.Profile;
import com.portfolio.backend.service.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public ResponseEntity<Profile> getProfile() {
        return ResponseEntity.ok(profileService.getProfile());
    }

    @PutMapping
    public ResponseEntity<Profile> updateProfile(@RequestBody Profile profile) {
        return ResponseEntity.ok(profileService.updateProfile(profile));
    }
}
