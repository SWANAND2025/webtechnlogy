package com.vit.resultportal.service;

import com.vit.resultportal.model.StudentResult;
import com.vit.resultportal.repository.StudentResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class StudentResultService {

    private final StudentResultRepository repository;

    @Autowired
    public StudentResultService(StudentResultRepository repository) {
        this.repository = repository;
    }

    /**
     * Calculates the semester result according to the formula:
     * Subject Final = (MSE * 30%) + (ESE * 70%)
     * Grand Total = Sum of 4 subjects
     * Percentage = Grand Total / 4.0
     * Pass criteria: Subject Final >= 40.0
     */
    public void calculateResult(StudentResult result) {
        // Validation check for nulls
        double dsaMse = result.getDsaMse() != null ? result.getDsaMse() : 0.0;
        double dsaEse = result.getDsaEse() != null ? result.getDsaEse() : 0.0;
        double dbmsMse = result.getDbmsMse() != null ? result.getDbmsMse() : 0.0;
        double dbmsEse = result.getDbmsEse() != null ? result.getDbmsEse() : 0.0;
        double cnMse = result.getCnMse() != null ? result.getCnMse() : 0.0;
        double cnEse = result.getCnEse() != null ? result.getCnEse() : 0.0;
        double wtMse = result.getWtMse() != null ? result.getWtMse() : 0.0;
        double wtEse = result.getWtEse() != null ? result.getWtEse() : 0.0;

        // Subject Final = 30% MSE + 70% ESE
        double dsaFinal = round2((dsaMse * 0.30) + (dsaEse * 0.70));
        double dbmsFinal = round2((dbmsMse * 0.30) + (dbmsEse * 0.70));
        double cnFinal = round2((cnMse * 0.30) + (cnEse * 0.70));
        double wtFinal = round2((wtMse * 0.30) + (wtEse * 0.70));

        result.setDsaFinal(dsaFinal);
        result.setDbmsFinal(dbmsFinal);
        result.setCnFinal(cnFinal);
        result.setWtFinal(wtFinal);

        // Grand Total & Percentage
        double total = round2(dsaFinal + dbmsFinal + cnFinal + wtFinal);
        double percentage = round2(total / 4.0);

        // Cleared count (Passing benchmark >= 40 marks out of 100)
        int cleared = 0;
        if (dsaFinal >= 40.0) cleared++;
        if (dbmsFinal >= 40.0) cleared++;
        if (cnFinal >= 40.0) cleared++;
        if (wtFinal >= 40.0) cleared++;

        result.setGrandTotal(total);
        result.setPercentage(percentage);
        result.setSubjectsCleared(cleared);
        result.setOverallStatus(cleared == 4 ? "PASS" : "FAIL");
    }

    private double round2(double val) {
        return Math.round(val * 100.0) / 100.0;
    }

    @Transactional
    public StudentResult saveOrUpdateResult(StudentResult input) {
        calculateResult(input);

        Optional<StudentResult> existingOpt = repository.findByPrnIgnoreCase(input.getPrn().trim());
        if (existingOpt.isPresent()) {
            StudentResult existing = existingOpt.get();
            existing.setStudentName(input.getStudentName());
            existing.setBranch(input.getBranch());
            existing.setSemester(input.getSemester());
            existing.setDsaMse(input.getDsaMse());
            existing.setDsaEse(input.getDsaEse());
            existing.setDsaFinal(input.getDsaFinal());
            existing.setDbmsMse(input.getDbmsMse());
            existing.setDbmsEse(input.getDbmsEse());
            existing.setDbmsFinal(input.getDbmsFinal());
            existing.setCnMse(input.getCnMse());
            existing.setCnEse(input.getCnEse());
            existing.setCnFinal(input.getCnFinal());
            existing.setWtMse(input.getWtMse());
            existing.setWtEse(input.getWtEse());
            existing.setWtFinal(input.getWtFinal());
            existing.setGrandTotal(input.getGrandTotal());
            existing.setPercentage(input.getPercentage());
            existing.setSubjectsCleared(input.getSubjectsCleared());
            existing.setOverallStatus(input.getOverallStatus());
            return repository.save(existing);
        } else {
            return repository.save(input);
        }
    }

    public Optional<StudentResult> getResultByPrn(String prn) {
        if (prn == null || prn.trim().isEmpty()) {
            return Optional.empty();
        }
        return repository.findByPrnIgnoreCase(prn.trim());
    }

    public List<StudentResult> getAllResults() {
        return repository.findAll();
    }

    @Transactional
    public boolean deleteResultByPrn(String prn) {
        if (repository.existsByPrnIgnoreCase(prn.trim())) {
            repository.deleteByPrnIgnoreCase(prn.trim());
            return true;
        }
        return false;
    }
}
