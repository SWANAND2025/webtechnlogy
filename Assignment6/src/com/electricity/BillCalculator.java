package com.electricity;

import java.io.Serializable;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

/**
 * BillCalculator - JavaBean component for Electricity Bill Calculation
 * Web Technology Assignment 6: JSP-based Electricity Bill Calculator
 * 
 * Tariff Conditions:
 * - First 50 units  : Rs. 3.50 / unit
 * - Next 100 units  : Rs. 4.00 / unit (units 51 to 150)
 * - Next 100 units  : Rs. 5.20 / unit (units 151 to 250)
 * - Above 250 units : Rs. 6.50 / unit (units > 250)
 */
public class BillCalculator implements Serializable {
    private static final long serialVersionUID = 1L;
    private static final DecimalFormat DF = new DecimalFormat("0.00");

    // Consumer & Billing Meta Information
    private String billNumber;
    private String billDate;
    private String dueDate;
    private String consumerName;
    private String consumerId;
    private String meterNumber;
    private String connectionType;
    private String billingMonth;

    // Reading & Consumption
    private double previousReading;
    private double currentReading;
    private double unitsConsumed;

    // Slab 1: First 50 units @ Rs. 3.50
    public static final double SLAB1_RATE = 3.50;
    public static final double SLAB1_LIMIT = 50.0;
    private double slab1Units;
    private double slab1Amount;

    // Slab 2: Next 100 units (51 to 150) @ Rs. 4.00
    public static final double SLAB2_RATE = 4.00;
    public static final double SLAB2_LIMIT = 100.0;
    private double slab2Units;
    private double slab2Amount;

    // Slab 3: Next 100 units (151 to 250) @ Rs. 5.20
    public static final double SLAB3_RATE = 5.20;
    public static final double SLAB3_LIMIT = 100.0;
    private double slab3Units;
    private double slab3Amount;

    // Slab 4: Units above 250 @ Rs. 6.50
    public static final double SLAB4_RATE = 6.50;
    private double slab4Units;
    private double slab4Amount;

    // Charges and Net Total
    private double energyCharges;
    private double fixedCharge = 50.00; // Standard meter service charge (Rs.)
    private double taxRate = 5.0;       // Government Electricity Duty (%)
    private double taxAmount;
    private double totalAmount;

    /**
     * Default zero-argument constructor as required by JavaBeans specification.
     */
    public BillCalculator() {
        SimpleDateFormat sdf = new SimpleDateFormat("dd-MMM-yyyy");
        Date now = new Date();
        this.billDate = sdf.format(now);

        Calendar cal = Calendar.getInstance();
        cal.setTime(now);
        cal.add(Calendar.DAY_OF_MONTH, 15);
        this.dueDate = sdf.format(cal.getTime());

        this.billNumber = "JSP-EB-" + (System.currentTimeMillis() % 900000 + 100000);
        this.connectionType = "Domestic (Residential)";
        this.billingMonth = new SimpleDateFormat("MMMM yyyy").format(now);
    }

    /**
     * Parameterized constructor
     */
    public BillCalculator(String consumerName, String consumerId, String meterNumber,
                          String connectionType, String billingMonth, double unitsConsumed) {
        this();
        this.consumerName = consumerName;
        this.consumerId = consumerId;
        this.meterNumber = meterNumber;
        this.connectionType = connectionType;
        this.billingMonth = billingMonth;
        this.unitsConsumed = unitsConsumed;
        calculate();
    }

    /**
     * Executes tiered slab calculation based on the prescribed tariff structure:
     * 1. First 50 units  : Rs. 3.50/unit
     * 2. Next 100 units  : Rs. 4.00/unit (units 51 to 150)
     * 3. Next 100 units  : Rs. 5.20/unit (units 151 to 250)
     * 4. Above 250 units : Rs. 6.50/unit
     */
    public void calculate() {
        // If meter readings are provided and valid, auto-compute units
        if (currentReading > 0 && currentReading >= previousReading && unitsConsumed <= 0) {
            unitsConsumed = currentReading - previousReading;
        }

        double remaining = Math.max(0.0, unitsConsumed);

        // Slab 1: 0 to 50 units @ Rs. 3.50
        if (remaining > 0) {
            slab1Units = Math.min(remaining, SLAB1_LIMIT);
            slab1Amount = slab1Units * SLAB1_RATE;
            remaining -= slab1Units;
        } else {
            slab1Units = 0.0;
            slab1Amount = 0.0;
        }

        // Slab 2: 51 to 150 units (Next 100 units) @ Rs. 4.00
        if (remaining > 0) {
            slab2Units = Math.min(remaining, SLAB2_LIMIT);
            slab2Amount = slab2Units * SLAB2_RATE;
            remaining -= slab2Units;
        } else {
            slab2Units = 0.0;
            slab2Amount = 0.0;
        }

        // Slab 3: 151 to 250 units (Next 100 units) @ Rs. 5.20
        if (remaining > 0) {
            slab3Units = Math.min(remaining, SLAB3_LIMIT);
            slab3Amount = slab3Units * SLAB3_RATE;
            remaining -= slab3Units;
        } else {
            slab3Units = 0.0;
            slab3Amount = 0.0;
        }

        // Slab 4: Units above 250 @ Rs. 6.50
        if (remaining > 0) {
            slab4Units = remaining;
            slab4Amount = slab4Units * SLAB4_RATE;
        } else {
            slab4Units = 0.0;
            slab4Amount = 0.0;
        }

        // Subtotal of energy consumption
        this.energyCharges = slab1Amount + slab2Amount + slab3Amount + slab4Amount;

        // Connection based fixed charges
        if (connectionType != null && connectionType.toLowerCase().contains("commercial")) {
            this.fixedCharge = 100.00;
        } else if (connectionType != null && connectionType.toLowerCase().contains("industrial")) {
            this.fixedCharge = 250.00;
        } else {
            this.fixedCharge = 50.00;
        }

        // Electricity Duty / State Surcharge
        this.taxAmount = (this.energyCharges + this.fixedCharge) * (this.taxRate / 100.0);

        // Final Payable Amount
        this.totalAmount = this.energyCharges + this.fixedCharge + this.taxAmount;
    }

    // Getters and Setters
    public String getBillNumber() { return billNumber; }
    public void setBillNumber(String billNumber) { this.billNumber = billNumber; }

    public String getBillDate() { return billDate; }
    public void setBillDate(String billDate) { this.billDate = billDate; }

    public String getDueDate() { return dueDate; }
    public void setDueDate(String dueDate) { this.dueDate = dueDate; }

    public String getConsumerName() { return consumerName != null ? consumerName : "Swanand Uttarwar"; }
    public void setConsumerName(String consumerName) { this.consumerName = consumerName; }

    public String getConsumerId() { return consumerId != null ? consumerId : "CON-2026-9812"; }
    public void setConsumerId(String consumerId) { this.consumerId = consumerId; }

    public String getMeterNumber() { return meterNumber != null ? meterNumber : "MTR-55421"; }
    public void setMeterNumber(String meterNumber) { this.meterNumber = meterNumber; }

    public String getConnectionType() { return connectionType != null ? connectionType : "Domestic (Residential)"; }
    public void setConnectionType(String connectionType) { this.connectionType = connectionType; }

    public String getBillingMonth() { return billingMonth != null ? billingMonth : "October 2026"; }
    public void setBillingMonth(String billingMonth) { this.billingMonth = billingMonth; }

    public double getPreviousReading() { return previousReading; }
    public void setPreviousReading(double previousReading) { this.previousReading = previousReading; }

    public double getCurrentReading() { return currentReading; }
    public void setCurrentReading(double currentReading) { this.currentReading = currentReading; }

    public double getUnitsConsumed() { return unitsConsumed; }
    public void setUnitsConsumed(double unitsConsumed) { this.unitsConsumed = unitsConsumed; }

    public double getSlab1Units() { return slab1Units; }
    public double getSlab1Rate() { return SLAB1_RATE; }
    public double getSlab1Amount() { return slab1Amount; }

    public double getSlab2Units() { return slab2Units; }
    public double getSlab2Rate() { return SLAB2_RATE; }
    public double getSlab2Amount() { return slab2Amount; }

    public double getSlab3Units() { return slab3Units; }
    public double getSlab3Rate() { return SLAB3_RATE; }
    public double getSlab3Amount() { return slab3Amount; }

    public double getSlab4Units() { return slab4Units; }
    public double getSlab4Rate() { return SLAB4_RATE; }
    public double getSlab4Amount() { return slab4Amount; }

    public double getEnergyCharges() { return energyCharges; }
    public double getFixedCharge() { return fixedCharge; }
    public void setFixedCharge(double fixedCharge) { this.fixedCharge = fixedCharge; }

    public double getTaxRate() { return taxRate; }
    public void setTaxRate(double taxRate) { this.taxRate = taxRate; }

    public double getTaxAmount() { return taxAmount; }
    public double getTotalAmount() { return totalAmount; }

    // Formatted String Helpers for Clean JSP Rendering
    public String getFormattedUnits() { return DF.format(unitsConsumed); }
    public String getFormattedSlab1Units() { return DF.format(slab1Units); }
    public String getFormattedSlab1Amount() { return DF.format(slab1Amount); }
    public String getFormattedSlab2Units() { return DF.format(slab2Units); }
    public String getFormattedSlab2Amount() { return DF.format(slab2Amount); }
    public String getFormattedSlab3Units() { return DF.format(slab3Units); }
    public String getFormattedSlab3Amount() { return DF.format(slab3Amount); }
    public String getFormattedSlab4Units() { return DF.format(slab4Units); }
    public String getFormattedSlab4Amount() { return DF.format(slab4Amount); }
    public String getFormattedEnergyCharges() { return DF.format(energyCharges); }
    public String getFormattedFixedCharge() { return DF.format(fixedCharge); }
    public String getFormattedTaxAmount() { return DF.format(taxAmount); }
    public String getFormattedTotalAmount() { return DF.format(totalAmount); }
}
