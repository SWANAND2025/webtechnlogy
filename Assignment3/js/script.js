/**
 * Electricity Bill Calculator - Client-side Dynamics & Real-time Slabs
 * Web Technology Assignment 3
 */

// Tariff Rates
const RATE_SLAB1 = 3.50; // First 50 units
const RATE_SLAB2 = 4.00; // Next 100 units (51 to 150)
const RATE_SLAB3 = 5.20; // Next 100 units (151 to 250)
const RATE_SLAB4 = 6.50; // Above 250 units

/**
 * Calculates tiered bill amount on the client side for real-time preview
 */
function calculateSlabs(units) {
  let remaining = Math.max(0, units);
  let s1Units = 0, s1Amount = 0;
  let s2Units = 0, s2Amount = 0;
  let s3Units = 0, s3Amount = 0;
  let s4Units = 0, s4Amount = 0;

  // Slab 1: First 50 units @ Rs. 3.50
  if (remaining > 0) {
    s1Units = Math.min(remaining, 50);
    s1Amount = s1Units * RATE_SLAB1;
    remaining -= s1Units;
  }

  // Slab 2: Next 100 units (51-150) @ Rs. 4.00
  if (remaining > 0) {
    s2Units = Math.min(remaining, 100);
    s2Amount = s2Units * RATE_SLAB2;
    remaining -= s2Units;
  }

  // Slab 3: Next 100 units (151-250) @ Rs. 5.20
  if (remaining > 0) {
    s3Units = Math.min(remaining, 100);
    s3Amount = s3Units * RATE_SLAB3;
    remaining -= s3Units;
  }

  // Slab 4: Above 250 units @ Rs. 6.50
  if (remaining > 0) {
    s4Units = remaining;
    s4Amount = s4Units * RATE_SLAB4;
    remaining = 0;
  }

  const total = s1Amount + s2Amount + s3Amount + s4Amount;

  return {
    s1Units, s1Amount,
    s2Units, s2Amount,
    s3Units, s3Amount,
    s4Units, s4Amount,
    total
  };
}

/**
 * Updates the Live Preview sidebar metric values on user input
 */
function updateLivePreview() {
  const unitsInput = document.getElementById("units");
  const unitsVal = parseFloat(unitsInput.value);
  const errorEl = document.getElementById("unitsError");

  if (isNaN(unitsVal) || unitsVal < 0) {
    if (unitsVal < 0) {
      errorEl.textContent = "Units cannot be negative";
      errorEl.style.display = "block";
    } else {
      errorEl.style.display = "none";
    }
    setPreviewText(0, 0, 0, 0, 0, 0);
    return;
  }

  errorEl.style.display = "none";
  const result = calculateSlabs(unitsVal);
  setPreviewText(result.total, result.s1Amount, result.s2Amount, result.s3Amount, result.s4Amount, unitsVal);
}

function setPreviewText(total, s1, s2, s3, s4, units) {
  document.getElementById("previewTotal").textContent = "Rs. " + total.toFixed(2);
  document.getElementById("previewSlab1").textContent = "Rs. " + s1.toFixed(2);
  document.getElementById("previewSlab2").textContent = "Rs. " + s2.toFixed(2);
  document.getElementById("previewSlab3").textContent = "Rs. " + s3.toFixed(2);
  document.getElementById("previewSlab4").textContent = "Rs. " + s4.toFixed(2);
  document.getElementById("previewUnitsCount").textContent = "For " + units + " units consumed";
}

/**
 * Quick fill sample test cases
 */
function fillTestCase(units, name) {
  document.getElementById("units").value = units;
  if (name && !document.getElementById("consumerName").value) {
    document.getElementById("consumerName").value = name;
  }
  updateLivePreview();
}

/**
 * Form validation before submitting to Servlet
 */
function validateForm() {
  const unitsInput = document.getElementById("units");
  const unitsVal = parseFloat(unitsInput.value);
  const errorEl = document.getElementById("unitsError");

  if (isNaN(unitsVal)) {
    errorEl.textContent = "Please enter the number of units consumed.";
    errorEl.style.display = "block";
    unitsInput.focus();
    return false;
  }

  if (unitsVal < 0) {
    errorEl.textContent = "Units consumed cannot be negative.";
    errorEl.style.display = "block";
    unitsInput.focus();
    return false;
  }

  errorEl.style.display = "none";
  return true;
}

/**
 * Resets form and preview
 */
function resetForm() {
  document.getElementById("billForm").reset();
  setPreviewText(0, 0, 0, 0, 0, 0);
  document.getElementById("unitsError").style.display = "none";
}

// Initial setup on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  // Generate random default Consumer ID if field is empty
  const cid = document.getElementById("consumerId");
  if (cid && !cid.value) {
    cid.value = "EB-" + Math.floor(100000 + Math.random() * 900000);
  }
  updateLivePreview();
});
