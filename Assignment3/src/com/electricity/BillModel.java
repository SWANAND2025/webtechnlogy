package com.electricity;

import java.io.Serializable;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Model class to encapsulate electricity bill calculation details and slab breakdowns.
 */
public class BillModel implements Serializable {
    private static final long serialVersionUID = 1L;
    private static final DecimalFormat DF = new DecimalFormat("0.00");

    private String billNumber;
    private String billDate;
    private String consumerName;
    private String consumerId;
    private String connectionType;
    private String billingMonth;
    private double unitsConsumed;

    // Slabs
    // Slab 1: First 50 units @ Rs. 3.50
    private double slab1Units;
    private final double slab1Rate = 3.50;
    private double slab1Amount;

    // Slab 2: Next 100 units (51 - 150) @ Rs. 4.00
    private double slab2Units;
    private final double slab2Rate = 4.00;
    private double slab2Amount;

    // Slab 3: Next 100 units (151 - 250) @ Rs. 5.20
    private double slab3Units;
    private final double slab3Rate = 5.20;
    private double slab3Amount;

    // Slab 4: Units above 250 @ Rs. 6.50
    private double slab4Units;
    private final double slab4Rate = 6.50;
    private double slab4Amount;

    private double fixedCharge = 0.00;
    private double totalAmount;

    public BillModel() {
        this.billDate = new SimpleDateFormat("dd-MMM-yyyy").format(new Date());
        this.billNumber = "EB-" + System.currentTimeMillis() % 1000000;
    }

    public BillModel(String consumerName, String consumerId, String connectionType, String billingMonth, double unitsConsumed) {
        this();
        this.consumerName = consumerName;
        this.consumerId = consumerId;
        this.connectionType = connectionType;
        this.billingMonth = billingMonth;
        this.unitsConsumed = unitsConsumed;
        calculate();
    }

    /**
     * Calculates the electricity bill based on the specified tariff conditions:
     * - First 50 units  : Rs. 3.50 / unit
     * - Next 100 units  : Rs. 4.00 / unit
     * - Next 100 units  : Rs. 5.20 / unit
     * - Above 250 units : Rs. 6.50 / unit
     */
    public void calculate() {
        double remaining = Math.max(0.0, unitsConsumed);

        // Slab 1: First 50 units
        if (remaining > 0) {
            slab1Units = Math.min(remaining, 50.0);
            slab1Amount = slab1Units * slab1Rate;
            remaining -= slab1Units;
        } else {
            slab1Units = 0.0;
            slab1Amount = 0.0;
        }

        // Slab 2: Next 100 units (51 to 150)
        if (remaining > 0) {
            slab2Units = Math.min(remaining, 100.0);
            slab2Amount = slab2Units * slab2Rate;
            remaining -= slab2Units;
        } else {
            slab2Units = 0.0;
            slab2Amount = 0.0;
        }

        // Slab 3: Next 100 units (151 to 250)
        if (remaining > 0) {
            slab3Units = Math.min(remaining, 100.0);
            slab3Amount = slab3Units * slab3Rate;
            remaining -= slab3Units;
        } else {
            slab3Units = 0.0;
            slab3Amount = 0.0;
        }

        // Slab 4: Units above 250
        if (remaining > 0) {
            slab4Units = remaining;
            slab4Amount = slab4Units * slab4Rate;
            remaining = 0;
        } else {
            slab4Units = 0.0;
            slab4Amount = 0.0;
        }

        this.totalAmount = slab1Amount + slab2Amount + slab3Amount + slab4Amount + fixedCharge;
    }

    // Getters and Setters
    public String getBillNumber() { return billNumber; }
    public void setBillNumber(String billNumber) { this.billNumber = billNumber; }

    public String getBillDate() { return billDate; }
    public void setBillDate(String billDate) { this.billDate = billDate; }

    public String getConsumerName() { return consumerName; }
    public void setConsumerName(String consumerName) { this.consumerName = consumerName; }

    public String getConsumerId() { return consumerId; }
    public void setConsumerId(String consumerId) { this.consumerId = consumerId; }

    public String getConnectionType() { return connectionType; }
    public void setConnectionType(String connectionType) { this.connectionType = connectionType; }

    public String getBillingMonth() { return billingMonth; }
    public void setBillingMonth(String billingMonth) { this.billingMonth = billingMonth; }

    public double getUnitsConsumed() { return unitsConsumed; }
    public void setUnitsConsumed(double unitsConsumed) {
        this.unitsConsumed = unitsConsumed;
        calculate();
    }

    public double getSlab1Units() { return slab1Units; }
    public double getSlab1Rate() { return slab1Rate; }
    public double getSlab1Amount() { return slab1Amount; }

    public double getSlab2Units() { return slab2Units; }
    public double getSlab2Rate() { return slab2Rate; }
    public double getSlab2Amount() { return slab2Amount; }

    public double getSlab3Units() { return slab3Units; }
    public double getSlab3Rate() { return slab3Rate; }
    public double getSlab3Amount() { return slab3Amount; }

    public double getSlab4Units() { return slab4Units; }
    public double getSlab4Rate() { return slab4Rate; }
    public double getSlab4Amount() { return slab4Amount; }

    public double getFixedCharge() { return fixedCharge; }
    public void setFixedCharge(double fixedCharge) {
        this.fixedCharge = fixedCharge;
        this.totalAmount = slab1Amount + slab2Amount + slab3Amount + slab4Amount + fixedCharge;
    }

    public double getTotalAmount() { return totalAmount; }

    // Formatted strings for display
    public String getFormattedUnits() { return DF.format(unitsConsumed); }
    public String getFormattedSlab1Amount() { return DF.format(slab1Amount); }
    public String getFormattedSlab2Amount() { return DF.format(slab2Amount); }
    public String getFormattedSlab3Amount() { return DF.format(slab3Amount); }
    public String getFormattedSlab4Amount() { return DF.format(slab4Amount); }
    public String getFormattedTotalAmount() { return DF.format(totalAmount); }
}
