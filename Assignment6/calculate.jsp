<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%-- 
  Web Technology Assignment 6: JSP JavaBean Controller
  Processes incoming HTTP request parameters, initializes JavaBean, 
  computes tiered tariff slabs, and forwards to presentation view (bill.jsp).
--%>

<jsp:useBean id="bill" class="com.electricity.BillCalculator" scope="request" />
<jsp:setProperty name="bill" property="*" />

<%
    try {
        // Parse numerical form inputs safely
        String unitsParam = request.getParameter("unitsConsumed");
        if (unitsParam != null && !unitsParam.trim().isEmpty()) {
            bill.setUnitsConsumed(Double.parseDouble(unitsParam.trim()));
        }

        String prevParam = request.getParameter("previousReading");
        if (prevParam != null && !prevParam.trim().isEmpty()) {
            bill.setPreviousReading(Double.parseDouble(prevParam.trim()));
        }

        String currParam = request.getParameter("currentReading");
        if (currParam != null && !currParam.trim().isEmpty()) {
            bill.setCurrentReading(Double.parseDouble(currParam.trim()));
        }

        // Run calculation
        bill.calculate();
        
    } catch (NumberFormatException e) {
        request.setAttribute("errorMessage", "Invalid numeric value provided for meter reading or units consumed.");
%>
        <jsp:forward page="error.jsp" />
<%
        return;
    } catch (Exception e) {
        request.setAttribute("errorMessage", "An error occurred during calculation: " + e.getMessage());
%>
        <jsp:forward page="error.jsp" />
<%
        return;
    }
%>

<jsp:forward page="bill.jsp" />
