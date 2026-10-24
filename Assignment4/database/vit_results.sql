-- ==========================================================
-- Vishwakarma Institute of Technology (VIT Pune)
-- Web Technology - Assignment 4
-- Semester Result Management System Database Script
-- ==========================================================

-- 1. Create Database
CREATE DATABASE IF NOT EXISTS vit_results
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE vit_results;

-- 2. Create Student Results Table
DROP TABLE IF EXISTS student_results;

CREATE TABLE student_results (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    prn VARCHAR(32) NOT NULL UNIQUE,
    student_name VARCHAR(100) NOT NULL,
    branch VARCHAR(80) NOT NULL,
    semester VARCHAR(20) NOT NULL,
    dsa_mse DOUBLE NOT NULL COMMENT 'MSE out of 30',
    dsa_ese DOUBLE NOT NULL COMMENT 'ESE out of 70',
    dsa_final DOUBLE NOT NULL COMMENT 'Calculated: (MSE*0.3)+(ESE*0.7)',
    dbms_mse DOUBLE NOT NULL COMMENT 'MSE out of 30',
    dbms_ese DOUBLE NOT NULL COMMENT 'ESE out of 70',
    dbms_final DOUBLE NOT NULL COMMENT 'Calculated: (MSE*0.3)+(ESE*0.7)',
    cn_mse DOUBLE NOT NULL COMMENT 'MSE out of 30',
    cn_ese DOUBLE NOT NULL COMMENT 'ESE out of 70',
    cn_final DOUBLE NOT NULL COMMENT 'Calculated: (MSE*0.3)+(ESE*0.7)',
    wt_mse DOUBLE NOT NULL COMMENT 'MSE out of 30',
    wt_ese DOUBLE NOT NULL COMMENT 'ESE out of 70',
    wt_final DOUBLE NOT NULL COMMENT 'Calculated: (MSE*0.3)+(ESE*0.7)',
    grand_total DOUBLE NOT NULL COMMENT 'Sum of 4 subject finals out of 400',
    percentage DOUBLE NOT NULL COMMENT 'Grand Total / 4',
    subjects_cleared INT NOT NULL COMMENT 'Count of subjects with final >= 40',
    overall_status VARCHAR(10) NOT NULL COMMENT 'PASS or FAIL',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_prn (prn)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Seed Sample Student Data (Matches screenshots in assignment report)
INSERT INTO student_results 
(prn, student_name, branch, semester, 
 dsa_mse, dsa_ese, dsa_final, 
 dbms_mse, dbms_ese, dbms_final, 
 cn_mse, cn_ese, cn_final, 
 wt_mse, wt_ese, wt_final, 
 grand_total, percentage, subjects_cleared, overall_status)
VALUES 
('12411742', 'swanand', 'Computer Engineering', 'V',
 26.0, 68.0, 55.40,
 29.0, 66.0, 54.90,
 27.0, 67.0, 55.00,
 28.0, 66.0, 54.60,
 219.90, 54.98, 4, 'PASS'),

('19AF142', 'Swanand', 'Computer Engineering', 'V',
 25.0, 65.0, 53.00,
 28.0, 64.0, 53.20,
 26.0, 62.0, 51.20,
 29.0, 67.0, 55.60,
 213.00, 53.25, 4, 'PASS'),

('12414076', 'Swanand Uttarwar', 'Computer Engineering', 'V',
 28.0, 67.0, 55.30,
 29.0, 68.0, 56.30,
 27.0, 65.0, 53.60,
 30.0, 69.0, 57.30,
 222.50, 55.63, 4, 'PASS');

-- 4. Verify insertion
SELECT prn, student_name, branch, semester, grand_total, percentage, overall_status 
FROM student_results;
