INSERT IGNORE INTO student_results 
(id, prn, student_name, branch, semester, 
 dsa_mse, dsa_ese, dsa_final, 
 dbms_mse, dbms_ese, dbms_final, 
 cn_mse, cn_ese, cn_final, 
 wt_mse, wt_ese, wt_final, 
 grand_total, percentage, subjects_cleared, overall_status, created_at, updated_at)
VALUES 
(1, '12411742', 'swanand', 'Computer Engineering', 'V',
 26.0, 68.0, 55.40,
 29.0, 66.0, 54.90,
 27.0, 67.0, 55.00,
 28.0, 66.0, 54.60,
 219.90, 54.98, 4, 'PASS', NOW(), NOW()),

(2, '19AF142', 'Swanand', 'Computer Engineering', 'V',
 25.0, 65.0, 53.00,
 28.0, 64.0, 53.20,
 26.0, 62.0, 51.20,
 29.0, 67.0, 55.60,
 213.00, 53.25, 4, 'PASS', NOW(), NOW()),

(3, '12414076', 'Swanand Uttarwar', 'Computer Engineering', 'V',
 28.0, 67.0, 55.30,
 29.0, 68.0, 56.30,
 27.0, 65.0, 53.60,
 30.0, 69.0, 57.30,
 222.50, 55.63, 4, 'PASS', NOW(), NOW());
