<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Electricity Bill Calculator | JSP (JavaServer Pages)</title>
  <meta name="description" content="Responsive tiered electricity bill calculator web application developed using JSP (JavaServer Pages).">
  
  <!-- Google Fonts & Stylesheet -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>

  <!-- Ambient background glow elements -->
  <div class="ambient-glow-1"></div>
  <div class="ambient-glow-2"></div>

  <div class="container">
    
    <!-- Header Section -->
    <header class="app-header">
      <div class="brand-wrapper">
        <div class="logo-badge">&#9889;</div>
        <div class="brand-info">
          <h1>MAHA-VIDYUT BILL CALCULATOR</h1>
          <p>Official Tariff Billing Portal &mdash; Powered by JavaServer Pages (JSP)</p>
        </div>
      </div>
      <div class="header-badges">
        <span class="badge badge-wt">WT Assignment 6</span>
        <span class="badge badge-jsp">&lt;jsp:useBean /&gt;</span>
        <span class="badge badge-success">&#10003; Responsive JSP</span>
      </div>
    </header>

    <!-- Active Tariff Slabs Section -->
    <section class="tariffs-section">
      <h2 class="section-title">&#128268; Specified Tariff Slabs &amp; Rates</h2>
      <div class="tariff-grid">
        
        <div class="tariff-card slab-1">
          <div class="slab-header">
            <span class="slab-tag">Slab 1</span>
            <span class="slab-range">0 &ndash; 50 Units</span>
          </div>
          <div class="slab-rate">Rs. 3.50 <span>/ unit</span></div>
          <p class="slab-desc">Condition for first 50 units</p>
        </div>

        <div class="tariff-card slab-2">
          <div class="slab-header">
            <span class="slab-tag">Slab 2</span>
            <span class="slab-range">51 &ndash; 150 Units</span>
          </div>
          <div class="slab-rate">Rs. 4.00 <span>/ unit</span></div>
          <p class="slab-desc">Condition for next 100 units</p>
        </div>

        <div class="tariff-card slab-3">
          <div class="slab-header">
            <span class="slab-tag">Slab 3</span>
            <span class="slab-range">151 &ndash; 250 Units</span>
          </div>
          <div class="slab-rate">Rs. 5.20 <span>/ unit</span></div>
          <p class="slab-desc">Condition for next 100 units</p>
        </div>

        <div class="tariff-card slab-4">
          <div class="slab-header">
            <span class="slab-tag">Slab 4</span>
            <span class="slab-range">Above 250 Units</span>
          </div>
          <div class="slab-rate">Rs. 6.50 <span>/ unit</span></div>
          <p class="slab-desc">Condition for units &gt; 250</p>
        </div>

      </div>
    </section>

    <!-- Main Content Area: Form & Live Calculation Breakdown -->
    <div class="main-grid">

      <!-- Form Card -->
      <section class="card">
        <div class="card-header">
          <h2>Consumer &amp; Consumption Details</h2>
          <p>Enter consumer meter information to compute official monthly bill via JSP</p>
        </div>

        <!-- Quick Demo Presets -->
        <div class="presets-box">
          <span class="presets-label">&#9889; Quick Test Cases:</span>
          <div class="preset-pills">
            <button type="button" class="preset-pill" onclick="fillTestCase(35, 'Aarav Sharma')">
              35 Units <span class="sub">(Slab 1)</span>
            </button>
            <button type="button" class="preset-pill" onclick="fillTestCase(120, 'Priya Patel')">
              120 Units <span class="sub">(Slabs 1-2)</span>
            </button>
            <button type="button" class="preset-pill" onclick="fillTestCase(210, 'Swanand Uttarwar')">
              210 Units <span class="sub">(Slabs 1-3)</span>
            </button>
            <button type="button" class="preset-pill" onclick="fillTestCase(320, 'Vikram Deshmukh')">
              320 Units <span class="sub">(All Slabs)</span>
            </button>
          </div>
        </div>

        <!-- JSP Submission Form -->
        <form action="calculate.jsp" method="POST" id="billForm" onsubmit="return validateForm()">
          
          <div class="form-row">
            <div class="form-group">
              <label for="consumerName">Consumer Full Name <span class="req">*</span></label>
              <div class="input-wrapper">
                <span class="input-icon">&#128100;</span>
                <input type="text" id="consumerName" name="consumerName" value="Swanand Uttarwar" required placeholder="e.g. Swanand Uttarwar">
              </div>
            </div>

            <div class="form-group">
              <label for="consumerId">Consumer Number / Account ID <span class="req">*</span></label>
              <div class="input-wrapper">
                <span class="input-icon">&#128221;</span>
                <input type="text" id="consumerId" name="consumerId" value="CN-12414076" required placeholder="e.g. CN-104928">
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="meterNumber">Meter Serial Number</label>
              <div class="input-wrapper">
                <span class="input-icon">&#9874;</span>
                <input type="text" id="meterNumber" name="meterNumber" value="MTR-88219" placeholder="e.g. MTR-88219">
              </div>
            </div>

            <div class="form-group">
              <label for="connectionType">Connection Tariff Category</label>
              <div class="input-wrapper">
                <span class="input-icon">&#127968;</span>
                <select id="connectionType" name="connectionType">
                  <option value="Domestic (Residential)" selected>LT-I: Domestic (Residential)</option>
                  <option value="Commercial (Non-Domestic)">LT-II: Commercial (Non-Domestic)</option>
                  <option value="Industrial (Small &amp; Medium)">LT-III: Industrial (Small/Med)</option>
                </select>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="previousReading">Previous Meter Reading (kWh)</label>
              <div class="input-wrapper">
                <span class="input-icon">&#128392;</span>
                <input type="number" step="0.1" id="previousReading" name="previousReading" value="1250" placeholder="e.g. 1250">
              </div>
              <span class="helper-text">Optional: enter to auto-compute consumed units</span>
            </div>

            <div class="form-group">
              <label for="currentReading">Current Meter Reading (kWh)</label>
              <div class="input-wrapper">
                <span class="input-icon">&#128392;</span>
                <input type="number" step="0.1" id="currentReading" name="currentReading" value="1460" placeholder="e.g. 1460">
              </div>
              <span class="helper-text">Must be &ge; Previous Reading</span>
            </div>
          </div>

          <div class="form-group">
            <label for="unitsConsumed">Total Units Consumed (kWh) <span class="req">*</span></label>
            <div class="input-wrapper">
              <span class="input-icon">&#9889;</span>
              <input type="number" step="0.1" id="unitsConsumed" name="unitsConsumed" value="210" min="0" required placeholder="e.g. 210">
            </div>
            <span class="helper-text">Units will be billed across the 4 tiered tariff slabs</span>
          </div>

          <!-- Actions -->
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">
              <span>&#128196; Generate Official JSP Bill</span>
            </button>
            <button type="reset" class="btn btn-secondary" onclick="setTimeout(updateLivePreview, 50)">
              <span>&#8634; Reset</span>
            </button>
          </div>

        </form>

      </section>

      <!-- Live Calculation Breakdown Preview Panel -->
      <aside class="card preview-panel">
        <div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <h2>Instant Calculation Preview</h2>
            <p>Real-time client validation &amp; preview</p>
          </div>
          <span class="live-badge"><span class="pulse-dot"></span> Live</span>
        </div>

        <div class="preview-stat-card">
          <div class="preview-stat-label">Estimated Bill Payable</div>
          <div class="preview-stat-value" id="previewTotal">Rs. 931.35</div>
          <div class="preview-stat-sub">Energy: <span id="previewEnergy">Rs. 887.00</span> + Fixed &amp; Taxes</div>
        </div>

        <h3 style="font-size: 14px; font-weight: 700; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.5px;">
          Slab-wise Units &amp; Amount:
        </h3>

        <div class="slab-breakdown-list">
          
          <div class="slab-item-row">
            <div class="slab-item-info">
              <span class="slab-circle s1"></span>
              <div>
                <strong>Slab 1 (0&ndash;50 @ Rs. 3.50)</strong>
                <div style="font-size:12px; color:#94a3b8;" id="s1_units">50.0 units</div>
              </div>
            </div>
            <span class="slab-item-cost" id="s1_cost">Rs. 175.00</span>
          </div>

          <div class="slab-item-row">
            <div class="slab-item-info">
              <span class="slab-circle s2"></span>
              <div>
                <strong>Slab 2 (51&ndash;150 @ Rs. 4.00)</strong>
                <div style="font-size:12px; color:#94a3b8;" id="s2_units">100.0 units</div>
              </div>
            </div>
            <span class="slab-item-cost" id="s2_cost">Rs. 400.00</span>
          </div>

          <div class="slab-item-row">
            <div class="slab-item-info">
              <span class="slab-circle s3"></span>
              <div>
                <strong>Slab 3 (151&ndash;250 @ Rs. 5.20)</strong>
                <div style="font-size:12px; color:#94a3b8;" id="s3_units">60.0 units</div>
              </div>
            </div>
            <span class="slab-item-cost" id="s3_cost">Rs. 312.00</span>
          </div>

          <div class="slab-item-row">
            <div class="slab-item-info">
              <span class="slab-circle s4"></span>
              <div>
                <strong>Slab 4 (&gt; 250 @ Rs. 6.50)</strong>
                <div style="font-size:12px; color:#94a3b8;" id="s4_units">0.0 units</div>
              </div>
            </div>
            <span class="slab-item-cost" id="s4_cost">Rs. 0.00</span>
          </div>

        </div>

        <div>
          <div style="display:flex; justify-content:space-between; font-size:12px; color:#94a3b8; margin-bottom:4px;">
            <span>Consumption Distribution</span>
            <span>0 &rarr; 250+ units</span>
          </div>
          <div class="consumption-track">
            <div class="track-seg s1" id="seg1" style="width: 20%;"></div>
            <div class="track-seg s2" id="seg2" style="width: 40%;"></div>
            <div class="track-seg s3" id="seg3" style="width: 24%;"></div>
            <div class="track-seg s4" id="seg4" style="width: 0%;"></div>
          </div>
        </div>

      </aside>

    </div>

  </div>

  <script src="js/script.js"></script>
</body>
</html>
