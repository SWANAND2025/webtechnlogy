package com.vit.resultportal.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "student_results")
public class StudentResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "PRN is required")
    @Column(name = "prn", nullable = false, unique = true, length = 32)
    private String prn;

    @NotBlank(message = "Student Name is required")
    @Column(name = "student_name", nullable = false, length = 100)
    private String studentName;

    @NotBlank(message = "Branch is required")
    @Column(name = "branch", nullable = false, length = 80)
    private String branch;

    @NotBlank(message = "Semester is required")
    @Column(name = "semester", nullable = false, length = 20)
    private String semester;

    // Subject 1: Data Structures & Algorithms (CS301)
    @NotNull(message = "DSA MSE is required")
    @DecimalMin(value = "0.0", message = "DSA MSE must be >= 0")
    @DecimalMax(value = "30.0", message = "DSA MSE cannot exceed 30")
    @Column(name = "dsa_mse")
    private Double dsaMse;

    @NotNull(message = "DSA ESE is required")
    @DecimalMin(value = "0.0", message = "DSA ESE must be >= 0")
    @DecimalMax(value = "70.0", message = "DSA ESE cannot exceed 70")
    @Column(name = "dsa_ese")
    private Double dsaEse;

    @Column(name = "dsa_final")
    private Double dsaFinal;

    // Subject 2: Database Management Systems (CS302)
    @NotNull(message = "DBMS MSE is required")
    @DecimalMin(value = "0.0", message = "DBMS MSE must be >= 0")
    @DecimalMax(value = "30.0", message = "DBMS MSE cannot exceed 30")
    @Column(name = "dbms_mse")
    private Double dbmsMse;

    @NotNull(message = "DBMS ESE is required")
    @DecimalMin(value = "0.0", message = "DBMS ESE must be >= 0")
    @DecimalMax(value = "70.0", message = "DBMS ESE cannot exceed 70")
    @Column(name = "dbms_ese")
    private Double dbmsEse;

    @Column(name = "dbms_final")
    private Double dbmsFinal;

    // Subject 3: Computer Networks (CS303)
    @NotNull(message = "CN MSE is required")
    @DecimalMin(value = "0.0", message = "CN MSE must be >= 0")
    @DecimalMax(value = "30.0", message = "CN MSE cannot exceed 30")
    @Column(name = "cn_mse")
    private Double cnMse;

    @NotNull(message = "CN ESE is required")
    @DecimalMin(value = "0.0", message = "CN ESE must be >= 0")
    @DecimalMax(value = "70.0", message = "CN ESE cannot exceed 70")
    @Column(name = "cn_ese")
    private Double cnEse;

    @Column(name = "cn_final")
    private Double cnFinal;

    // Subject 4: Web Technology (CS304)
    @NotNull(message = "WT MSE is required")
    @DecimalMin(value = "0.0", message = "WT MSE must be >= 0")
    @DecimalMax(value = "30.0", message = "WT MSE cannot exceed 30")
    @Column(name = "wt_mse")
    private Double wtMse;

    @NotNull(message = "WT ESE is required")
    @DecimalMin(value = "0.0", message = "WT ESE must be >= 0")
    @DecimalMax(value = "70.0", message = "WT ESE cannot exceed 70")
    @Column(name = "wt_ese")
    private Double wtEse;

    @Column(name = "wt_final")
    private Double wtFinal;

    // Aggregate Calculations
    @Column(name = "grand_total")
    private Double grandTotal;

    @Column(name = "percentage")
    private Double percentage;

    @Column(name = "subjects_cleared")
    private Integer subjectsCleared;

    @Column(name = "overall_status", length = 10)
    private String overallStatus; // "PASS" or "FAIL"

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public StudentResult() {}

    public StudentResult(String prn, String studentName, String branch, String semester,
                         Double dsaMse, Double dsaEse,
                         Double dbmsMse, Double dbmsEse,
                         Double cnMse, Double cnEse,
                         Double wtMse, Double wtEse) {
        this.prn = prn;
        this.studentName = studentName;
        this.branch = branch;
        this.semester = semester;
        this.dsaMse = dsaMse;
        this.dsaEse = dsaEse;
        this.dbmsMse = dbmsMse;
        this.dbmsEse = dbmsEse;
        this.cnMse = cnMse;
        this.cnEse = cnEse;
        this.wtMse = wtMse;
        this.wtEse = wtEse;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPrn() { return prn; }
    public void setPrn(String prn) { this.prn = prn; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getBranch() { return branch; }
    public void setBranch(String branch) { this.branch = branch; }

    public String getSemester() { return semester; }
    public void setSemester(String semester) { this.semester = semester; }

    public Double getDsaMse() { return dsaMse; }
    public void setDsaMse(Double dsaMse) { this.dsaMse = dsaMse; }

    public Double getDsaEse() { return dsaEse; }
    public void setDsaEse(Double dsaEse) { this.dsaEse = dsaEse; }

    public Double getDsaFinal() { return dsaFinal; }
    public void setDsaFinal(Double dsaFinal) { this.dsaFinal = dsaFinal; }

    public Double getDbmsMse() { return dbmsMse; }
    public void setDbmsMse(Double dbmsMse) { this.dbmsMse = dbmsMse; }

    public Double getDbmsEse() { return dbmsEse; }
    public void setDbmsEse(Double dbmsEse) { this.dbmsEse = dbmsEse; }

    public Double getDbmsFinal() { return dbmsFinal; }
    public void setDbmsFinal(Double dbmsFinal) { this.dbmsFinal = dbmsFinal; }

    public Double getCnMse() { return cnMse; }
    public void setCnMse(Double cnMse) { this.cnMse = cnMse; }

    public Double getCnEse() { return cnEse; }
    public void setCnEse(Double cnEse) { this.cnEse = cnEse; }

    public Double getCnFinal() { return cnFinal; }
    public void setCnFinal(Double cnFinal) { this.cnFinal = cnFinal; }

    public Double getWtMse() { return wtMse; }
    public void setWtMse(Double wtMse) { this.wtMse = wtMse; }

    public Double getWtEse() { return wtEse; }
    public void setWtEse(Double wtEse) { this.wtEse = wtEse; }

    public Double getWtFinal() { return wtFinal; }
    public void setWtFinal(Double wtFinal) { this.wtFinal = wtFinal; }

    public Double getGrandTotal() { return grandTotal; }
    public void setGrandTotal(Double grandTotal) { this.grandTotal = grandTotal; }

    public Double getPercentage() { return percentage; }
    public void setPercentage(Double percentage) { this.percentage = percentage; }

    public Integer getSubjectsCleared() { return subjectsCleared; }
    public void setSubjectsCleared(Integer subjectsCleared) { this.subjectsCleared = subjectsCleared; }

    public String getOverallStatus() { return overallStatus; }
    public void setOverallStatus(String overallStatus) { this.overallStatus = overallStatus; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
