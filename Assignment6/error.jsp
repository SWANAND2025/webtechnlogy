<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" isErrorPage="true" %>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Error - Electricity Bill Calculator</title>
  <link rel="stylesheet" href="css/style.css">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&display=swap" rel="stylesheet">
</head>
<body>
  <div class="container" style="max-width: 600px; margin-top: 60px;">
    <div class="card" style="text-align: center; border-color: rgba(239, 68, 68, 0.4);">
      <div style="font-size: 48px; color: #ef4444; margin-bottom: 16px;">&#9888;</div>
      <h2 style="color: #ef4444; margin-bottom: 12px;">Calculation Error</h2>
      <p style="color: #94a3b8; margin-bottom: 24px;">
        <%= request.getAttribute("errorMessage") != null ? request.getAttribute("errorMessage") : "An unexpected error occurred while processing your bill calculation." %>
      </p>
      <a href="index.jsp" class="btn btn-primary" style="display: inline-flex;">
        &larr; Return to Calculator Form
      </a>
    </div>
  </div>
</body>
</html>
