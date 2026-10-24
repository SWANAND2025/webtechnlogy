# Assignment 3: Electricity Bill Calculator using Java Servlet

[![Java](https://img.shields.io/badge/Java-Servlet%20API-orange.svg)](https://docs.oracle.com/javaee/7/api/javax/servlet/package-summary.html)
[![HTML5](https://img.shields.io/badge/HTML5-Responsive-E34F26.svg)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-Modern%20Design-1572B6.svg)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![Server](https://img.shields.io/badge/Server-Apache%20Tomcat-F8DC75.svg)](https://tomcat.apache.org/)

A responsive, production-ready web application designed and developed for **Web Technology Assignment 3**. It calculates electricity bills based on tiered tariff slabs using **Java Servlet** on the backend and modern **HTML5 / CSS3 / JavaScript** on the frontend.

Repository: [https://github.com/SWANAND2025/webtechnlogy](https://github.com/SWANAND2025/webtechnlogy)

---

## 📌 Problem Statement

> **Assignment Objective:**  
> Design and develop a responsive website to calculate Electricity bill with the help of any AI code generation tool using Servlet.  
> **Tariff Conditions:**
> - Condition for first 50 units &ndash; **Rs. 3.50 / unit**
> - For next 100 units &ndash; **Rs. 4.00 / unit**
> - For next 100 units &ndash; **Rs. 5.20 / unit**
> - For units above 250 &ndash; **Rs. 6.50 / unit**

---

## ⚡ Tariff Rate Slab Details

The tariff is calculated progressively across 4 slabs:

| Slab | Range (Units) | Rate per Unit (Rs.) | Maximum Units in Slab | Maximum Cost in Slab (Rs.) | Cumulative Max Cost (Rs.) |
|:---:|:---:|:---:|:---:|:---:|:---:|
| **Slab 1** | 0 &ndash; 50 | **Rs. 3.50** | 50 units | Rs. 175.00 | Rs. 175.00 |
| **Slab 2** | 51 &ndash; 150 | **Rs. 4.00** | 100 units | Rs. 400.00 | Rs. 575.00 |
| **Slab 3** | 151 &ndash; 250 | **Rs. 5.20** | 100 units | Rs. 520.00 | Rs. 1,095.00 |
| **Slab 4** | Above 250 | **Rs. 6.50** | Remaining units | (Units - 250) &times; 6.50 | *Varies with units* |

---

## 🧮 Mathematical Calculation Formula & Test Cases

Let $U$ be the total units consumed:

$$
\text{Total Bill} = 
\begin{cases} 
U \times 3.50 & \text{if } U \le 50 \\
(50 \times 3.50) + (U - 50) \times 4.00 & \text{if } 50 < U \le 150 \\
(50 \times 3.50) + (100 \times 4.00) + (U - 150) \times 5.20 & \text{if } 150 < U \le 250 \\
(50 \times 3.50) + (100 \times 4.00) + (100 \times 5.20) + (U - 250) \times 6.50 & \text{if } U > 250 
\end{cases}
$$

### Verification Examples

- **Test Case 1 (35 Units):**
  - Slab 1 (35 @ Rs. 3.50) = Rs. 122.50
  - **Net Payable = Rs. 122.50**

- **Test Case 2 (120 Units):**
  - Slab 1 (50 @ Rs. 3.50) = Rs. 175.00
  - Slab 2 (70 @ Rs. 4.00) = Rs. 280.00
  - **Net Payable = Rs. 455.00**

- **Test Case 3 (210 Units):**
  - Slab 1 (50 @ Rs. 3.50) = Rs. 175.00
  - Slab 2 (100 @ Rs. 4.00) = Rs. 400.00
  - Slab 3 (60 @ Rs. 5.20) = Rs. 312.00
  - **Net Payable = Rs. 887.00**

- **Test Case 4 (300 Units):**
  - Slab 1 (50 @ Rs. 3.50) = Rs. 175.00
  - Slab 2 (100 @ Rs. 4.00) = Rs. 400.00
  - Slab 3 (100 @ Rs. 5.20) = Rs. 520.00
  - Slab 4 (50 @ Rs. 6.50) = Rs. 325.00
  - **Net Payable = Rs. 1,420.00**

---

## 📂 Project Directory Structure

```text
Assignment3/
├── css/
│   └── style.css                   # Responsive CSS3 styling & print media queries
├── js/
│   └── script.js                   # Client-side validation & live instant slab preview
├── src/
│   └── com/
│       └── electricity/
│           ├── BillModel.java      # Data model encapsulating bill details & calculations
│           └── ElectricityBillServlet.java # Java Servlet handling POST /CalculateBill
├── WEB-INF/
│   ├── classes/
│   │   └── com/
│   │       └── electricity/
│   │           ├── BillModel.class
│   │           └── ElectricityBillServlet.class
│   └── web.xml                     # Web deployment descriptor with servlet-mapping
├── index.html                      # Responsive landing page & user input form
├── result.jsp                      # Professional invoice bill receipt template
├── pom.xml                         # Maven build configuration
└── README.md                       # Complete project documentation
```

---

## 🛠️ Technology Stack

- **Frontend:**
  - Semantic HTML5 with accessible form controls
  - Pure CSS3 with CSS Grid, Flexbox, Glassmorphism, and `@media print` optimization
  - Vanilla JavaScript (ES6+) for real-time live estimation and input validation
- **Backend:**
  - Java SE (Java 8 / 11 / 17 / 21+)
  - Java Servlet API (`HttpServlet`, `HttpServletRequest`, `HttpServletResponse`)
  - JavaServer Pages (JSP) / Standalone direct Servlet HTML generator fallback
- **Application Server:**
  - Apache Tomcat (v8.5 / v9.0 / v10.x with Tomcat migration tool)
  - XAMPP Tomcat

---

## 🚀 How to Run the Project

### Option A: Direct Deployment to Apache Tomcat / XAMPP

1. Copy the `Assignment3` directory into your Tomcat `webapps` directory:
   ```text
   C:\xampp\tomcat\webapps\Assignment3
   # OR
   C:\Program Files\Apache Software Foundation\Tomcat 9.0\webapps\Assignment3
   ```
2. Start Apache Tomcat from the XAMPP Control Panel or command line (`catalina.bat start` / `startup.bat`).
3. Open your browser and navigate to:
   ```text
   http://localhost:8080/Assignment3/
   ```

---

### Option B: Using Eclipse IDE (Dynamic Web Project)

1. Open **Eclipse IDE for Enterprise Java and Web Developers**.
2. Go to **File &rarr; New &rarr; Dynamic Web Project**.
3. Name the project `Assignment3` and select your **Apache Tomcat** target runtime.
4. Copy the files into the Eclipse project:
   - `src/com/electricity/*` &rarr; `Java Resources/src`
   - `index.html`, `result.jsp`, `css/`, `js/` &rarr; `WebContent` (or `src/main/webapp`)
   - `web.xml` &rarr; `WebContent/WEB-INF/web.xml`
5. Right-click `index.html` &rarr; **Run As &rarr; Run on Server**.

---

### Option C: Compiling from Command Line

To compile the Java Servlet source files manually:

```powershell
# Navigate to the Assignment3 folder
cd Assignment3

# Compile Java classes using Tomcat's servlet-api.jar
javac -cp "C:\xampp\tomcat\lib\servlet-api.jar" -d "WEB-INF\classes" src\com\electricity\BillModel.java src\com\electricity\ElectricityBillServlet.java
```

---

## ✨ Key Features

1. **Fully Responsive Layout:** Optimized for mobile phones, tablets, laptops, and ultra-wide desktop displays.
2. **Instant Live Estimator:** Calculates and shows individual slab breakdowns dynamically in real time as the user types units.
3. **One-Click Quick Presets:** Pre-configured buttons to test 35, 120, 210, and 340 units instantly.
4. **Print / Save as PDF:** One-click invoice print feature that formats the bill into a clean, professional paper invoice.
5. **Dual Rendering Engine:** Works seamlessly via JSP forward (`result.jsp`) or standalone direct Servlet HTML generation.
6. **Robust Input Validation:** Prevents negative units, non-numeric inputs, and empty submissions with user-friendly alerts.

---

## 👨‍💻 Author & Repository

- **Developer:** Swanand
- **GitHub Repository:** [SWANAND2025/webtechnlogy](https://github.com/SWANAND2025/webtechnlogy)
- **Course:** Web Technology
