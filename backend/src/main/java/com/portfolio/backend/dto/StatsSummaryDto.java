package com.portfolio.backend.dto;

import com.portfolio.backend.model.Project;
import com.portfolio.backend.model.VisitorStat;

import java.util.List;
import java.util.Map;

public class StatsSummaryDto {

    private long totalVisits;
    private long uniqueVisitors;
    private long todayVisits;
    private long weekVisits;
    private long totalProjectViews;
    private List<Project> topProjects;
    private List<Map<String, Object>> deviceBreakdown;
    private List<Map<String, Object>> dailyVisits;
    private List<VisitorStat> recentVisits;

    public StatsSummaryDto() {}

    public long getTotalVisits() {
        return totalVisits;
    }

    public void setTotalVisits(long totalVisits) {
        this.totalVisits = totalVisits;
    }

    public long getUniqueVisitors() {
        return uniqueVisitors;
    }

    public void setUniqueVisitors(long uniqueVisitors) {
        this.uniqueVisitors = uniqueVisitors;
    }

    public long getTodayVisits() {
        return todayVisits;
    }

    public void setTodayVisits(long todayVisits) {
        this.todayVisits = todayVisits;
    }

    public long getWeekVisits() {
        return weekVisits;
    }

    public void setWeekVisits(long weekVisits) {
        this.weekVisits = weekVisits;
    }

    public long getTotalProjectViews() {
        return totalProjectViews;
    }

    public void setTotalProjectViews(long totalProjectViews) {
        this.totalProjectViews = totalProjectViews;
    }

    public List<Project> getTopProjects() {
        return topProjects;
    }

    public void setTopProjects(List<Project> topProjects) {
        this.topProjects = topProjects;
    }

    public List<Map<String, Object>> getDeviceBreakdown() {
        return deviceBreakdown;
    }

    public void setDeviceBreakdown(List<Map<String, Object>> deviceBreakdown) {
        this.deviceBreakdown = deviceBreakdown;
    }

    public List<Map<String, Object>> getDailyVisits() {
        return dailyVisits;
    }

    public void setDailyVisits(List<Map<String, Object>> dailyVisits) {
        this.dailyVisits = dailyVisits;
    }

    public List<VisitorStat> getRecentVisits() {
        return recentVisits;
    }

    public void setRecentVisits(List<VisitorStat> recentVisits) {
        this.recentVisits = recentVisits;
    }
}
