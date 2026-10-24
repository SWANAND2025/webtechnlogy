package com.vit.resultportal.controller;

import com.vit.resultportal.model.StudentResult;
import com.vit.resultportal.service.StudentResultService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/results")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class StudentResultController {

    private final StudentResultService service;

    @Autowired
    public StudentResultController(StudentResultService service) {
        this.service = service;
    }

    /**
     * Calculate and persist student result into MySQL
     */
    @PostMapping
    public ResponseEntity<?> saveResult(@Valid @RequestBody StudentResult studentResult) {
        try {
            StudentResult saved = service.saveOrUpdateResult(studentResult);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to save result: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Preview calculation without saving to database
     */
    @PostMapping("/calculate")
    public ResponseEntity<?> calculatePreview(@RequestBody StudentResult studentResult) {
        try {
            service.calculateResult(studentResult);
            return ResponseEntity.ok(studentResult);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Calculation failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Find existing student result by PRN
     */
    @GetMapping("/{prn}")
    public ResponseEntity<?> getResultByPrn(@PathVariable String prn) {
        Optional<StudentResult> resultOpt = service.getResultByPrn(prn);
        if (resultOpt.isPresent()) {
            return ResponseEntity.ok(resultOpt.get());
        } else {
            Map<String, String> error = new HashMap<>();
            error.put("message", "No semester result found for PRN: " + prn);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    /**
     * Retrieve all saved results
     */
    @GetMapping
    public ResponseEntity<List<StudentResult>> getAllResults() {
        return ResponseEntity.ok(service.getAllResults());
    }

    /**
     * Delete student result by PRN
     */
    @DeleteMapping("/{prn}")
    public ResponseEntity<?> deleteResult(@PathVariable String prn) {
        boolean deleted = service.deleteResultByPrn(prn);
        if (deleted) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Result deleted successfully for PRN: " + prn);
            return ResponseEntity.ok(response);
        } else {
            Map<String, String> error = new HashMap<>();
            error.put("message", "PRN not found: " + prn);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }
}
