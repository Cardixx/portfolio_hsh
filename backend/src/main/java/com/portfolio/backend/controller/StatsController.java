package com.portfolio.backend.controller;

import com.portfolio.backend.dto.StatsSummaryDto;
import com.portfolio.backend.dto.VisitRequest;
import com.portfolio.backend.model.VisitorStat;
import com.portfolio.backend.service.StatsService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    private final StatsService statsService;

    public StatsController(StatsService statsService) {
        this.statsService = statsService;
    }

    @PostMapping("/visit")
    public ResponseEntity<?> recordVisit(@RequestBody(required = false) VisitRequest visitRequest,
                                         HttpServletRequest request) {
        statsService.recordVisit(visitRequest, request);
        return ResponseEntity.ok(Map.of("message", "Visit recorded"));
    }

    @GetMapping("/summary")
    public ResponseEntity<StatsSummaryDto> getSummary() {
        return ResponseEntity.ok(statsService.getSummary());
    }

    @GetMapping("/recent")
    public ResponseEntity<List<VisitorStat>> getRecentVisits(@RequestParam(defaultValue = "20") int limit) {
        return ResponseEntity.ok(statsService.getRecentVisits(limit));
    }
}
