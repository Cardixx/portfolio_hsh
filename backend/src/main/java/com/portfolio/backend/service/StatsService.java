package com.portfolio.backend.service;

import com.portfolio.backend.dto.StatsSummaryDto;
import com.portfolio.backend.dto.VisitRequest;
import com.portfolio.backend.model.Project;
import com.portfolio.backend.model.VisitorStat;
import com.portfolio.backend.repository.ProjectRepository;
import com.portfolio.backend.repository.VisitorStatRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@Service
public class StatsService {

    private final VisitorStatRepository visitorStatRepository;
    private final ProjectRepository projectRepository;

    public StatsService(VisitorStatRepository visitorStatRepository, ProjectRepository projectRepository) {
        this.visitorStatRepository = visitorStatRepository;
        this.projectRepository = projectRepository;
    }

    @Transactional
    public void recordVisit(VisitRequest visitRequest, HttpServletRequest request) {
        VisitorStat stat = new VisitorStat();

        String ip = extractClientIp(request);
        stat.setIpHash(hashIp(ip));

        String userAgent = request.getHeader("User-Agent");
        if (userAgent != null) {
            stat.setUserAgent(userAgent.length() > 500 ? userAgent.substring(0, 500) : userAgent);
            stat.setDeviceType(detectDevice(userAgent));
            stat.setBrowser(detectBrowser(userAgent));
            stat.setOperatingSystem(detectOS(userAgent));
        } else {
            stat.setDeviceType("Desktop");
            stat.setBrowser("Unknown");
            stat.setOperatingSystem("Unknown");
        }

        if (visitRequest != null) {
            stat.setPageUrl(visitRequest.getPageUrl() != null ? visitRequest.getPageUrl() : "/");
            stat.setReferer(visitRequest.getReferer() != null ? visitRequest.getReferer() : request.getHeader("Referer"));
            if (visitRequest.getDeviceType() != null && !visitRequest.getDeviceType().isBlank()) {
                stat.setDeviceType(visitRequest.getDeviceType());
            }
        } else {
            stat.setPageUrl("/");
            stat.setReferer(request.getHeader("Referer"));
        }

        stat.setVisitedAt(LocalDateTime.now());
        visitorStatRepository.save(stat);
    }

    public StatsSummaryDto getSummary() {
        StatsSummaryDto dto = new StatsSummaryDto();

        long totalVisits = visitorStatRepository.count();
        long uniqueVisitors = visitorStatRepository.countDistinctVisitors();

        LocalDateTime startOfToday = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);
        long todayVisits = visitorStatRepository.countByVisitedAtAfter(startOfToday);

        LocalDateTime oneWeekAgo = LocalDateTime.now().minusDays(7);
        long weekVisits = visitorStatRepository.countByVisitedAtAfter(oneWeekAgo);

        List<Project> allProjects = projectRepository.findAllByOrderBySortOrderAscCreatedAtDesc();
        long totalProjectViews = allProjects.stream().mapToLong(Project::getViewCount).sum();

        List<Map<String, Object>> deviceBreakdown = visitorStatRepository.countByDeviceType();
        List<Map<String, Object>> dailyVisits = visitorStatRepository.getDailyVisitsSince(LocalDateTime.now().minusDays(30));
        List<VisitorStat> recentVisits = visitorStatRepository.findAllByOrderByVisitedAtDesc(PageRequest.of(0, 20));

        dto.setTotalVisits(totalVisits);
        dto.setUniqueVisitors(uniqueVisitors);
        dto.setTodayVisits(todayVisits);
        dto.setWeekVisits(weekVisits);
        dto.setTotalProjectViews(totalProjectViews);
        dto.setTopProjects(allProjects);
        dto.setDeviceBreakdown(deviceBreakdown);
        dto.setDailyVisits(dailyVisits);
        dto.setRecentVisits(recentVisits);

        return dto;
    }

    public List<VisitorStat> getRecentVisits(int limit) {
        return visitorStatRepository.findAllByOrderByVisitedAtDesc(PageRequest.of(0, Math.min(limit, 100)));
    }

    private String extractClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null || xfHeader.isEmpty() || "unknown".equalsIgnoreCase(xfHeader)) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0].trim();
    }

    private String hashIp(String ip) {
        if (ip == null) return "unknown";
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encodedhash = digest.digest(ip.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : encodedhash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString().substring(0, 32);
        } catch (NoSuchAlgorithmException e) {
            return String.valueOf(ip.hashCode());
        }
    }

    private String detectDevice(String ua) {
        String lower = ua.toLowerCase();
        if (lower.contains("mobile") || lower.contains("android") || lower.contains("iphone")) {
            return "Mobile";
        } else if (lower.contains("tablet") || lower.contains("ipad")) {
            return "Tablet";
        }
        return "Desktop";
    }

    private String detectBrowser(String ua) {
        String lower = ua.toLowerCase();
        if (lower.contains("edg")) return "Edge";
        if (lower.contains("chrome") && !lower.contains("edg")) return "Chrome";
        if (lower.contains("firefox")) return "Firefox";
        if (lower.contains("safari") && !lower.contains("chrome")) return "Safari";
        if (lower.contains("opr") || lower.contains("opera")) return "Opera";
        return "Other";
    }

    private String detectOS(String ua) {
        String lower = ua.toLowerCase();
        if (lower.contains("windows")) return "Windows";
        if (lower.contains("mac os") || lower.contains("macintosh")) return "macOS";
        if (lower.contains("android")) return "Android";
        if (lower.contains("iphone") || lower.contains("ipad") || lower.contains("ios")) return "iOS";
        if (lower.contains("linux")) return "Linux";
        return "Other";
    }
}
