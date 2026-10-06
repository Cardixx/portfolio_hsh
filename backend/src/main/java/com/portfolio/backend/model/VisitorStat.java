package com.portfolio.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "visitor_stats", indexes = {
    @Index(name = "idx_visited_at", columnList = "visitedAt"),
    @Index(name = "idx_ip_hash", columnList = "ipHash")
})
public class VisitorStat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 64)
    private String ipHash;

    @Column(length = 500)
    private String userAgent;

    @Column(length = 50)
    private String deviceType; // Desktop, Mobile, Tablet

    @Column(length = 50)
    private String browser;

    @Column(length = 50)
    private String operatingSystem;

    @Column(length = 255)
    private String pageUrl;

    @Column(length = 255)
    private String referer;

    @Column(nullable = false)
    private LocalDateTime visitedAt = LocalDateTime.now();

    public VisitorStat() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIpHash() {
        return ipHash;
    }

    public void setIpHash(String ipHash) {
        this.ipHash = ipHash;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }

    public String getDeviceType() {
        return deviceType;
    }

    public void setDeviceType(String deviceType) {
        this.deviceType = deviceType;
    }

    public String getBrowser() {
        return browser;
    }

    public void setBrowser(String browser) {
        this.browser = browser;
    }

    public String getOperatingSystem() {
        return operatingSystem;
    }

    public void setOperatingSystem(String operatingSystem) {
        this.operatingSystem = operatingSystem;
    }

    public String getPageUrl() {
        return pageUrl;
    }

    public void setPageUrl(String pageUrl) {
        this.pageUrl = pageUrl;
    }

    public String getReferer() {
        return referer;
    }

    public void setReferer(String referer) {
        this.referer = referer;
    }

    public LocalDateTime getVisitedAt() {
        return visitedAt;
    }

    public void setVisitedAt(LocalDateTime visitedAt) {
        this.visitedAt = visitedAt;
    }
}
