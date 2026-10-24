<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.electricity.BillModel" %>
<%
    BillModel bill = (BillModel) request.getAttribute("bill");
    if (bill == null) {
        response.sendRedirect("index.html");
        return;
    }
%>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Electricity Bill Receipt - <%= bill.getBillNumber() %></title>
  <link rel="stylesheet" href="css/style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
</head>
<body>

  <div class="container">
    <div class="bill-card print-area">
      <!-- Invoice Header -->
      <div class="bill-header">
        <div class="brand">
          <div class="logo-badge">&#9889;</div>
          <div>
            <h1>PowerGrid Utility Services</h1>
            <p class="subtitle">Official Electricity Consumption Invoice</p>
          </div>
        </div>
        <div class="bill-meta">
          <p><strong>Invoice #:</strong> <%= bill.getBillNumber() %></p>
          <p><strong>Billing Date:</strong> <%= bill.getBillDate() %></p>
          <span class="badge badge-success">&#10003; Processed by Servlet</span>
        </div>
      </div>

      <!-- Consumer Details Grid -->
      <div class="info-grid">
        <div class="info-item">
          <span class="label">Consumer Name</span>
          <span class="value"><%= bill.getConsumerName() %></span>
        </div>
        <div class="info-item">
          <span class="label">Consumer / Meter ID</span>
          <span class="value"><%= bill.getConsumerId() %></span>
        </div>
        <div class="info-item">
          <span class="label">Connection Type</span>
          <span class="value"><%= bill.getConnectionType() %></span>
        </div>
        <div class="info-item">
          <span class="label">Billing Cycle</span>
          <span class="value"><%= bill.getBillingMonth() %></span>
        </div>
      </div>

      <!-- Highlight Units -->
      <div class="highlight-box">
        <div class="highlight-item">
          <span>Total Units Consumed:</span>
          <strong><%= bill.getFormattedUnits() %> kWh (Units)</strong>
        </div>
      </div>

      <!-- Tariff Slab Breakdown Table -->
      <h3 class="section-title">Tariff Slab Calculation Breakdown</h3>
      <div class="table-responsive">
        <table class="slab-table">
          <thead>
            <tr>
              <th>Tariff Slab</th>
              <th>Rate (Rs./Unit)</th>
              <th>Consumed in Slab</th>
              <th>Amount (Rs.)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>First 50 Units (0 &ndash; 50)</td>
              <td>Rs. 3.50</td>
              <td><%= String.format("%.2f", bill.getSlab1Units()) %></td>
              <td class="amount-col">Rs. <%= bill.getFormattedSlab1Amount() %></td>
            </tr>
            <tr>
              <td>Next 100 Units (51 &ndash; 150)</td>
              <td>Rs. 4.00</td>
              <td><%= String.format("%.2f", bill.getSlab2Units()) %></td>
              <td class="amount-col">Rs. <%= bill.getFormattedSlab2Amount() %></td>
            </tr>
            <tr>
              <td>Next 100 Units (151 &ndash; 250)</td>
              <td>Rs. 5.20</td>
              <td><%= String.format("%.2f", bill.getSlab3Units()) %></td>
              <td class="amount-col">Rs. <%= bill.getFormattedSlab3Amount() %></td>
            </tr>
            <tr>
              <td>Units Above 250 (&gt; 250)</td>
              <td>Rs. 6.50</td>
              <td><%= String.format("%.2f", bill.getSlab4Units()) %></td>
              <td class="amount-col">Rs. <%= bill.getFormattedSlab4Amount() %></td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="total-row">
              <td colspan="3"><strong>Net Payable Amount</strong></td>
              <td class="amount-col"><strong>Rs. <%= bill.getFormattedTotalAmount() %></strong></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- Total Banner -->
      <div class="total-banner">
        <div>
          <p class="total-label">Total Amount Due</p>
          <p class="total-note">(Net charges calculated according to slab tariff rules)</p>
        </div>
        <div class="total-value">Rs. <%= bill.getFormattedTotalAmount() %></div>
      </div>

      <!-- Energy Notice -->
      <div class="notice-box">
        <p>&#128161; <strong>Energy Saving Tip:</strong> Unplug idle electronics and use natural day lighting to reduce your next billing slab.</p>
      </div>

      <!-- Actions -->
      <div class="action-bar no-print">
        <button onclick="window.print()" class="btn btn-success">&#128438; Print / Save as PDF</button>
        <a href="index.html" class="btn btn-secondary">&#8635; Calculate Another Bill</a>
      </div>

    </div>
  </div>

</body>
</html>
