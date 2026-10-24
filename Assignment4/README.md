# Assignment 4: Semester Result Portal using Spring Boot & MySQL

[![Spring Boot](https://img.shields.io/badge/Spring--Boot-3.3.4-6DB33F.svg?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![MySQL](https://img.shields.io/badge/MySQL-9.3%20%2F%208.0-4479A1.svg?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB.svg?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Java](https://img.shields.io/badge/Java-17%20%7C%2021%20%7C%2025-ED8B00.svg?logo=openjdk&logoColor=white)](https://www.oracle.com/java/)

> **Vishwakarma Institute of Technology, Pune (VIT Pune)**  
> **Course:** Web Technology (CS-L)  
> **Assignment:** 04  
> **Name:** Swanand Uttarwar  
> **Class:** CS-L | **Batch:** 2 | **Roll No:** 33 | **PRN:** 12414076  
> **GitHub Repository:** [https://github.com/SWANAND2025/webtechnlogy](https://github.com/SWANAND2025/webtechnlogy)  

---

## 📌 Problem Statement

> **Question:**  
> Design and develop a responsive website to prepare one semester result of VIT students using **Spring-Boot** and **MySQL**. Take any four subjects with **MSE Marks (30%)** and **ESE Marks (70%)**.

---

## 🧮 Mathematical Formulation & Calculation

Each student is evaluated on 4 subjects across Mid-Semester Examination (MSE) and End-Semester Examination (ESE).

### 1. Subject Weightage Formula
$$\text{Final Marks} = (\text{MSE} \times 0.30) + (\text{ESE} \times 0.70)$$

Where:
* $\text{MSE}$: Mid Semester Exam marks (out of 30)
* $\text{ESE}$: End Semester Exam marks (out of 70)
* $\text{Final}$: Normalized Subject Score (out of 100)

### 2. Passing Criteria
* **Subject Pass Benchmark:** $\text{Final Marks} \ge 40.0$
* **Semester Overall Status:** `PASS` if all 4 subjects are cleared ($\text{Subjects Cleared} = 4$), otherwise `FAIL`.

### 3. Aggregate Calculations
$$\text{Grand Total} = \sum_{i=1}^{4} \text{Final}_i \quad (\text{out of } 400)$$
$$\text{Percentage} = \frac{\text{Grand Total}}{4} \quad (\%)$$

---

## 📊 Reference Test Case (Matching Report Screenshots)

| # | Subject Name | Code | MSE (/30) | ESE (/70) | Calculation Formula | Final (/100) | Status |
|:---:|:---|:---:|:---:|:---:|:---|:---:|:---:|
| **01** | Data Structures & Algorithms | CS301 | 26 | 68 | $(26 \times 0.3) + (68 \times 0.7) = 7.8 + 47.6$ | **55.40** | `PASS` |
| **02** | Database Management Systems | CS302 | 29 | 66 | $(29 \times 0.3) + (66 \times 0.7) = 8.7 + 46.2$ | **54.90** | `PASS` |
| **03** | Computer Networks | CS303 | 27 | 67 | $(27 \times 0.3) + (67 \times 0.7) = 8.1 + 46.9$ | **55.00** | `PASS` |
| **04** | Web Technology | CS304 | 28 | 66 | $(28 \times 0.3) + (66 \times 0.7) = 8.4 + 46.2$ | **54.60** | `PASS` |

* **Grand Total:** $55.40 + 54.90 + 55.00 + 54.60 = \mathbf{219.9 / 400}$
* **Percentage:** $\frac{219.90}{4} = \mathbf{54.98\%}$
* **Subjects Cleared:** $\mathbf{04 \text{ cleared}}$
* **Overall Status:** $\mathbf{PASS}$

---

## 🏗️ Architecture & Directory Structure

```text
Assignment4/
├── backend/                                # Spring Boot Java REST Application
│   ├── pom.xml                             # Maven Dependencies (Spring Web, JPA, MySQL)
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/vit/resultportal/
│   │   │   │   ├── VitResultPortalApplication.java # Spring Boot Main Application Class
│   │   │   │   ├── controller/
│   │   │   │   │   └── StudentResultController.java # REST API Endpoints (/api/results)
│   │   │   │   ├── model/
│   │   │   │   │   └── StudentResult.java           # JPA Entity for student_results
│   │   │   │   ├── repository/
│   │   │   │   │   └── StudentResultRepository.java # Spring Data JPA Repository
│   │   │   │   └── service/
│   │   │   │       └── StudentResultService.java    # Business Logic & Calculation Engine
│   │   │   └── resources/
│   │   │       ├── application.properties           # MySQL DataSource & Hibernate Config
│   │   │       ├── schema.sql                       # DDL Script
│   │   │       ├── data.sql                         # Pre-seeded Records
│   │   │       └── static/                          # Turnkey Standalone UI (No Node needed)
│   │   │           ├── index.html
│   │   │           ├── css/style.css
│   │   │           └── js/app.js
├── frontend/                               # Modern Vite + React Frontend (localhost:5173)
│   ├── package.json
│   ├── vite.config.js                      # Configured with proxy to port 8080
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx                         # Responsive UI & Interactive Calculations
│       └── index.css                       # Pixel-perfect responsive styling
├── database/
│   └── vit_results.sql                     # Full MySQL Database & Table Setup Script
└── README.md                               # Comprehensive Project Documentation
```

---

## 🗄️ MySQL Database Schema

```sql
CREATE DATABASE IF NOT EXISTS vit_results;
USE vit_results;

CREATE TABLE IF NOT EXISTS student_results (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    prn VARCHAR(32) NOT NULL UNIQUE,
    student_name VARCHAR(100) NOT NULL,
    branch VARCHAR(80) NOT NULL,
    semester VARCHAR(20) NOT NULL,
    dsa_mse DOUBLE NOT NULL,
    dsa_ese DOUBLE NOT NULL,
    dsa_final DOUBLE NOT NULL,
    dbms_mse DOUBLE NOT NULL,
    dbms_ese DOUBLE NOT NULL,
    dbms_final DOUBLE NOT NULL,
    cn_mse DOUBLE NOT NULL,
    cn_ese DOUBLE NOT NULL,
    cn_final DOUBLE NOT NULL,
    wt_mse DOUBLE NOT NULL,
    wt_ese DOUBLE NOT NULL,
    wt_final DOUBLE NOT NULL,
    grand_total DOUBLE NOT NULL,
    percentage DOUBLE NOT NULL,
    subjects_cleared INT NOT NULL,
    overall_status VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 🚀 Setup & Execution Guide

### Option 1: Quick Start with Spring Boot (Zero Node.js Required)
1. **Initialize MySQL Database:**
   ```bash
   mysql -u root -p < database/vit_results.sql
   ```
2. **Configure Database Credentials:**
   Open `backend/src/main/resources/application.properties` and verify your MySQL password:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=your_password_here
   ```
3. **Run the Spring Boot Application:**
   ```bash
   cd backend
   mvn spring-boot:run
   ```
4. **Open in Browser:**  
   Navigate to [http://localhost:8080](http://localhost:8080)

---

### Option 2: Running with Vite + React Frontend (`http://localhost:5173`)
1. **Run Spring Boot Backend (on port 8080):**
   ```bash
   cd backend
   mvn spring-boot:run
   ```
2. **Run Vite Frontend (on port 5173):**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
3. **Open in Browser:**  
   Navigate to [http://localhost:5173](http://localhost:5173) (Matches assignment screenshot).

---

## 📡 REST API Documentation

| Method | Endpoint | Description | Sample Response Code |
|:---:|:---|:---|:---:|
| `POST` | `/api/results` | Computes & persists student semester result into MySQL | `201 Created` |
| `GET` | `/api/results/{prn}` | Retrieves student result by PRN (case-insensitive) | `200 OK` / `404 Not Found` |
| `GET` | `/api/results` | Returns all student records from database | `200 OK` |
| `POST` | `/api/results/calculate` | Computes result preview without persisting to DB | `200 OK` |
| `DELETE` | `/api/results/{prn}` | Deletes record by PRN | `200 OK` / `404 Not Found` |

### Sample `POST /api/results` Request Payload:
```json
{
  "prn": "12411742",
  "studentName": "Swanand Uttarwar",
  "branch": "Computer Engineering",
  "semester": "V",
  "dsaMse": 26.0,
  "dsaEse": 68.0,
  "dbmsMse": 29.0,
  "dbmsEse": 66.0,
  "cnMse": 27.0,
  "cnEse": 67.0,
  "wtMse": 28.0,
  "wtEse": 66.0
}
```

### Response:
```json
{
  "id": 1,
  "prn": "12411742",
  "studentName": "Swanand Uttarwar",
  "branch": "Computer Engineering",
  "semester": "V",
  "dsaMse": 26.0,
  "dsaEse": 68.0,
  "dsaFinal": 55.4,
  "dbmsMse": 29.0,
  "dbmsEse": 66.0,
  "dbmsFinal": 54.9,
  "cnMse": 27.0,
  "cnEse": 67.0,
  "cnFinal": 55.0,
  "wtMse": 28.0,
  "wtEse": 66.0,
  "wtFinal": 54.6,
  "grandTotal": 219.9,
  "percentage": 54.98,
  "subjectsCleared": 4,
  "overallStatus": "PASS"
}
```

---

## 🎨 Features & Capabilities

* **Pixel-Perfect Fidelity:** Recreates the exact typography, card layouts, dark theme official result summary, and metrics shown in the assignment submission.
* **Instant Dynamic Calculation:** Computes subject final marks in real time as MSE and ESE inputs are entered.
* **Database Persistence:** Stores student details and marks securely in MySQL with Hibernate ORM.
* **Fast PRN Lookup:** Allows instant search and retrieval of existing student records by PRN.
* **Print & Export Friendly:** Built-in `@media print` styling formats the Official Result Card for clean PDF export or hardcopy printing.
* **Dual Execution Mode:** Works both as an integrated full-stack Spring Boot application (`localhost:8080`) and with the Vite dev server (`localhost:5173`).
