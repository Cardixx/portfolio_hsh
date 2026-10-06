package com.portfolio.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "profile")
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 150)
    private String fullName = "Harentsoa Sarobidy Harivelo";

    @Column(length = 200)
    private String title = "Full-Stack Developer";

    @Column(length = 300)
    private String subtitle = "Building the web, one commit at a time.";

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(length = 200)
    private String currentStatus = "Open to junior dev opportunities";

    @Column(length = 200)
    private String languages = "French · English · Malagasy";

    @Column(length = 200)
    private String focus = "Full-stack web · APIs · Security";

    @Column(length = 200)
    private String location = "Fianarantsoa · Madagascar 🇲🇬";

    @Column(length = 150)
    private String email = "hariveloharentsoasarobidy@gmail.com";

    @Column(length = 250)
    private String githubUrl = "https://github.com/Cardixx";

    @Column(length = 250)
    private String linkedinUrl = "https://linkedin.com/in/harentsoa-harivelo11";

    @Column(length = 1000)
    private String heroImageUrl;

    @Column(length = 1000)
    private String resumeUrl;

    public Profile() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSubtitle() {
        return subtitle;
    }

    public void setSubtitle(String subtitle) {
        this.subtitle = subtitle;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getCurrentStatus() {
        return currentStatus;
    }

    public void setCurrentStatus(String currentStatus) {
        this.currentStatus = currentStatus;
    }

    public String getLanguages() {
        return languages;
    }

    public void setLanguages(String languages) {
        this.languages = languages;
    }

    public String getFocus() {
        return focus;
    }

    public void setFocus(String focus) {
        this.focus = focus;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getGithubUrl() {
        return githubUrl;
    }

    public void setGithubUrl(String githubUrl) {
        this.githubUrl = githubUrl;
    }

    public String getLinkedinUrl() {
        return linkedinUrl;
    }

    public void setLinkedinUrl(String linkedinUrl) {
        this.linkedinUrl = linkedinUrl;
    }

    public String getHeroImageUrl() {
        return heroImageUrl;
    }

    public void setHeroImageUrl(String heroImageUrl) {
        this.heroImageUrl = heroImageUrl;
    }

    public String getResumeUrl() {
        return resumeUrl;
    }

    public void setResumeUrl(String resumeUrl) {
        this.resumeUrl = resumeUrl;
    }
}
