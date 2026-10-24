package com.vit.resultportal.repository;

import com.vit.resultportal.model.StudentResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentResultRepository extends JpaRepository<StudentResult, Long> {
    Optional<StudentResult> findByPrnIgnoreCase(String prn);
    boolean existsByPrnIgnoreCase(String prn);
    void deleteByPrnIgnoreCase(String prn);
}
