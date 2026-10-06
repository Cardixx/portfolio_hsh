package com.portfolio.backend.repository;

import com.portfolio.backend.model.VisitorStat;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Repository
public interface VisitorStatRepository extends JpaRepository<VisitorStat, Long> {

    @Query("SELECT COUNT(DISTINCT v.ipHash) FROM VisitorStat v")
    long countDistinctVisitors();

    long countByVisitedAtAfter(LocalDateTime date);

    @Query("SELECT COUNT(DISTINCT v.ipHash) FROM VisitorStat v WHERE v.visitedAt >= :date")
    long countDistinctVisitorsAfter(@Param("date") LocalDateTime date);

    List<VisitorStat> findAllByOrderByVisitedAtDesc(Pageable pageable);

    @Query("SELECT v.deviceType as device, COUNT(v) as count FROM VisitorStat v GROUP BY v.deviceType")
    List<Map<String, Object>> countByDeviceType();

    @Query("SELECT cast(v.visitedAt as date) as visitDate, COUNT(v) as count, COUNT(DISTINCT v.ipHash) as uniqueCount " +
           "FROM VisitorStat v " +
           "WHERE v.visitedAt >= :since " +
           "GROUP BY cast(v.visitedAt as date) " +
           "ORDER BY cast(v.visitedAt as date) ASC")
    List<Map<String, Object>> getDailyVisitsSince(@Param("since") LocalDateTime since);
}
