package com.portfolio.backend.repository;

import com.portfolio.backend.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findAllByOrderBySortOrderAscCreatedAtDesc();

    List<Project> findByFeaturedTrueOrderBySortOrderAscCreatedAtDesc();

    @Modifying
    @Query("UPDATE Project p SET p.viewCount = p.viewCount + 1 WHERE p.id = :id")
    void incrementViewCount(@Param("id") Long id);
}
