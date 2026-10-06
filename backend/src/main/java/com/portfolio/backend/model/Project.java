package com.portfolio.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 200)
    private String subtitle;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String longDescription;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "project_stack", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "tech")
    private List<String> stack = new ArrayList<>();

    @Column(length = 150)
    private String accent = "from-primary/30 to-accent/30";

    @Column(length = 100)
    private String tag = "Featured";

    @Column(length = 50)
    private String year = "2025";

    @Column(length = 1000)
    private String presentationImageUrl;

    @Column(length = 1000)
    private String presentationVideoUrl;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "project_gallery", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "image_url", length = 1000)
    private List<String> galleryImages = new ArrayList<>();

    @Column(length = 1000)
    private String githubUrl;

    @Column(length = 1000)
    private String liveDemoUrl;

    private boolean featured = false;

    private int sortOrder = 0;

    private long viewCount = 0;

    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    public Project() {}

    @PrePersist
    public void onPrePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onPreUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLongDescription() {
        return longDescription;
    }

    public void setLongDescription(String longDescription) {
        this.longDescription = longDescription;
    }

    public List<String> getStack() {
        return stack;
    }

    public void setStack(List<String> stack) {
        this.stack = stack;
    }

    public String getAccent() {
        return accent;
    }

    public void setAccent(String accent) {
        this.accent = accent;
    }

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public String getPresentationImageUrl() {
        return presentationImageUrl;
    }

    public void setPresentationImageUrl(String presentationImageUrl) {
        this.presentationImageUrl = presentationImageUrl;
    }

    public String getPresentationVideoUrl() {
        return presentationVideoUrl;
    }

    public void setPresentationVideoUrl(String presentationVideoUrl) {
        this.presentationVideoUrl = presentationVideoUrl;
    }

    public List<String> getGalleryImages() {
        return galleryImages;
    }

    public void setGalleryImages(List<String> galleryImages) {
        this.galleryImages = galleryImages;
    }

    public String getGithubUrl() {
        return githubUrl;
    }

    public void setGithubUrl(String githubUrl) {
        this.githubUrl = githubUrl;
    }

    public String getLiveDemoUrl() {
        return liveDemoUrl;
    }

    public void setLiveDemoUrl(String liveDemoUrl) {
        this.liveDemoUrl = liveDemoUrl;
    }

    public boolean isFeatured() {
        return featured;
    }

    public void setFeatured(boolean featured) {
        this.featured = featured;
    }

    public int getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(int sortOrder) {
        this.sortOrder = sortOrder;
    }

    public long getViewCount() {
        return viewCount;
    }

    public void setViewCount(long viewCount) {
        this.viewCount = viewCount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
