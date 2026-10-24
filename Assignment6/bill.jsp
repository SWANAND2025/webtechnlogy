<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.electricity.BillCalculator" %>
<jsp:useBean id="bill" class="com.electricity.BillCalculator" scope="request" />
<%
    // If accessed directly without calculate.jsp having populated the bean, compute defaults
    if (bill.getUnitsConsumed() == 0 && request.getParameter("unitsConsumed") == null) {
        bill.setUnitsConsumed(210.0);
        bill.calculate();
    }
%>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Electricity Bill Receipt - <%= bill.getBillNumber() %></title>
  
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
</head>
<body class="bill-paper-view">

  <!-- Ambient light -->
  <div class="ambient-glow-1"></div>

  <div class="container invoice-wrapper">
    
    <!-- Top Action Navigation -->
    <div class="invoice-actions-bar">
      <div>
        <a href="index.jsp" class="btn btn-secondary">
          <span>&larr; Calculate Another Bill</span>
        </a>
      </div>
      <div style="display:flex; gap:10px;">
        <button type="button" class="btn btn-secondary" onclick="window.print()">
          <span>&#128424; Print Invoice</span>
        </button>
        <button type="button" class="btn btn-primary" onclick="window.print()">
          <span>&#128190; Save as PDF</span>
        </button>
      </div>
    </div>

    <!-- Official Printable Invoice Card -->
    <div class="invoice-paper">
      
      <!-- Utility Brand Header -->
      <div class="invoice-header">
        <div class="utility-brand">
          <div class="utility-logo">&#9889;</div>
          <div>
            <h2>MAHA-VIDYUT DISTRIBUTION CO.</h2>
            <p>State Electricity Board &bull; Consumer Billing Division</p>
            <p style="font-size: 11px; color:#94a3b8; margin-top:2px;">Reg. No: MSEB/PW/2026/WT-JSP &bull; GSTIN: 27AABCM9821Q1Z4</p>
          </div>
        </div>

        <div class="invoice-meta">
          <div class="invoice-num"><%= bill.getBillNumber() %></div>
          <p><strong>Bill Issue Date:</strong> <%= bill.getBillDate() %></p>
          <p><strong>Payment Due Date:</strong> <%= bill.getDueDate() %></p>
          <div style="margin-top:6px;">
            <span class="badge badge-success">&#10003; Generated via JSP</span>
          </div>
        </div>
      </div>

      <!-- Consumer Credentials Grid -->
      <div class="bill-consumer-grid">
        <div class="meta-field">
          <span class="label">Consumer Full Name</span>
          <span class="value"><%= bill.getConsumerName() %></span>
        </div>
        <div class="meta-field">
          <span class="label">Consumer Account ID</span>
          <span class="value"><%= bill.getConsumerId() %></span>
        </div>
        <div class="meta-field">
          <span class="label">Meter Serial No.</span>
          <span class="value"><%= bill.getMeterNumber() %></span>
        </div>
        <div class="meta-field">
          <span class="label">Tariff Connection Type</span>
          <span class="value"><%= bill.getConnectionType() %></span>
        </div>
        <div class="meta-field">
          <span class="label">Billing Month</span>
          <span class="value"><%= bill.getBillingMonth() %></span>
        </div>
        <div class="meta-field">
          <span class="label">Previous Meter Reading</span>
          <span class="value"><%= String.format("%.1f", bill.getPreviousReading()) %> kWh</span>
        </div>
        <div class="meta-field">
          <span class="label">Current Meter Reading</span>
          <span class="value"><%= String.format("%.1f", bill.getCurrentReading()) %> kWh</span>
        </div>
        <div class="meta-field">
          <span class="label">Supply Voltage</span>
          <span class="value">230V Single Phase</span>
        </div>
      </div>

      <!-- Units Banner -->
      <div class="units-banner">
        <div>
          <div class="units-text">Total Electricity Consumed in Billing Cycle</div>
          <div style="font-size:12px; color:#64748b; margin-top:2px;">Meter Reading Difference = Current (<%= String.format("%.1f", bill.getCurrentReading()) %>) &minus; Previous (<%= String.format("%.1f", bill.getPreviousReading()) %>)</div>
        </div>
        <div class="units-num"><%= bill.getFormattedUnits() %> kWh (Units)</div>
      </div>

      <!-- Official Tariff Slab Breakdown Table -->
      <h3 style="font-size: 15px; font-weight:800; color:#0f172a; text-transform:uppercase; margin-bottom:12px; letter-spacing:0.3px;">
        &#9889; Tiered Tariff Slab Consumption &amp; Cost Breakdown
      </h3>

      <div class="invoice-table-wrapper">
        <table class="invoice-table">
          <thead>
            <tr>
              <th>Tariff Slab Classification</th>
              <th class="num-col">Slab Rate</th>
              <th class="num-col">Consumed Units</th>
              <th class="num-col">Calculation Formula</th>
              <th class="num-col">Slab Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr class="<%= bill.getSlab1Units() > 0 ? "active-slab" : "" %>">
              <td>
                <span class="slab-circle s1" style="display:inline-block; margin-right:6px;"></span>
                <strong>Slab 1:</strong> First 50 Units (0 &ndash; 50)
              </td>
              <td class="num-col">Rs. <%= String.format("%.2f", bill.getSlab1Rate()) %> / unit</td>
              <td class="num-col"><%= bill.getFormattedSlab1Units() %> units</td>
              <td class="num-col"><%= bill.getFormattedSlab1Units() %> &times; Rs. 3.50</td>
              <td class="num-col"><strong>Rs. <%= bill.getFormattedSlab1Amount() %></strong></td>
            </tr>

            <tr class="<%= bill.getSlab2Units() > 0 ? "active-slab" : "" %>">
              <td>
                <span class="slab-circle s2" style="display:inline-block; margin-right:6px;"></span>
                <strong>Slab 2:</strong> Next 100 Units (51 &ndash; 150)
              </td>
              <td class="num-col">Rs. <%= String.format("%.2f", bill.getSlab2Rate()) %> / unit</td>
              <td class="num-col"><%= bill.getFormattedSlab2Units() %> units</td>
              <td class="num-col"><%= bill.getFormattedSlab2Units() %> &times; Rs. 4.00</td>
              <td class="num-col"><strong>Rs. <%= bill.getFormattedSlab2Amount() %></strong></td>
            </tr>

            <tr class="<%= bill.getSlab3Units() > 0 ? "active-slab" : "" %>">
              <td>
                <span class="slab-circle s3" style="display:inline-block; margin-right:6px;"></span>
                <strong>Slab 3:</strong> Next 100 Units (151 &ndash; 250)
              </td>
              <td class="num-col">Rs. <%= String.format("%.2f", bill.getSlab3Rate()) %> / unit</td>
              <td class="num-col"><%= bill.getFormattedSlab3Units() %> units</td>
              <td class="num-col"><%= bill.getFormattedSlab3Units() %> &times; Rs. 5.20</td>
              <td class="num-col"><strong>Rs. <%= bill.getFormattedSlab3Amount() %></strong></td>
            </tr>

            <tr class="<%= bill.getSlab4Units() > 0 ? "active-slab" : "" %>">
              <td>
                <span class="slab-circle s4" style="display:inline-block; margin-right:6px;"></span>
                <strong>Slab 4:</strong> Above 250 Units (&gt; 250)
              </td>
              <td class="num-col">Rs. <%= String.format("%.2f", bill.getSlab4Rate()) %> / unit</td>
              <td class="num-col"><%= bill.getFormattedSlab4Units() %> units</td>
              <td class="num-col"><%= bill.getFormattedSlab4Units() %> &times; Rs. 6.50</td>
              <td class="num-col"><strong>Rs. <%= bill.getFormattedSlab4Amount() %></strong></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Financial Summary and Notes -->
      <div class="invoice-summary">
        
        <div class="invoice-notes">
          <h4>Payment Instructions &amp; Notes:</h4>
          <ul>
            <li>Calculated under Government Tariff Orders for LT Category consumers.</li>
            <li>Energy charges are progressively applied according to unit consumption thresholds.</li>
            <li>Pay on or before <strong><%= bill.getDueDate() %></strong> to avoid prompt payment discount loss or late surcharge.</li>
          </ul>

          <div class="qr-code-box">
            <div class="qr-img">&#9638;</div>
            <div class="qr-text">
              <strong>Scan to Pay via UPI / QR</strong>
              UPI ID: mahavidyut@sbi &bull; <%= bill.getBillNumber() %>
            </div>
          </div>
        </div>

        <div class="invoice-totals">
          <div class="total-row">
            <span>Energy Charges (Slabs Total)</span>
            <span class="val">Rs. <%= bill.getFormattedEnergyCharges() %></span>
          </div>

          <div class="total-row">
            <span>Fixed Meter / Demand Charge</span>
            <span class="val">Rs. <%= bill.getFormattedFixedCharge() %></span>
          </div>

          <div class="total-row">
            <span>Electricity Duty / Tax (5%)</span>
            <span class="val">Rs. <%= bill.getFormattedTaxAmount() %></span>
          </div>

          <div class="total-row grand-total">
            <span>Total Bill Payable</span>
            <span class="val">Rs. <%= bill.getFormattedTotalAmount() %></span>
          </div>
        </div>

      </div>

      <!-- Invoice Footer -->
      <div class="invoice-footer">
        <p>This is a computer-generated tax invoice generated by <strong>JSP (JavaServer Pages) Web Application</strong>.</p>
        <p>Web Technology Assignment 6 &bull; Developed by Swanand Uttarwar (SWANAND2025)</p>
      </div>

    </div>

  </div>

  <script src="js/script.js"></script>
</body>
</html>
