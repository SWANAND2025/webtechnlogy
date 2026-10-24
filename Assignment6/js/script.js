/**
 * Assignment 6: Electricity Bill Calculator using JSP
 * Client-side script for real-time calculation preview and form validation
 * Author: Swanand Uttarwar (SWANAND2025)
 */

document.addEventListener('DOMContentLoaded', () => {
  const unitsInput = document.getElementById('unitsConsumed');
  const prevInput = document.getElementById('previousReading');
  const currInput = document.getElementById('currentReading');
  const typeSelect = document.getElementById('connectionType');

  // Auto-calculate units when readings change
  function handleReadingChange() {
    if (prevInput && currInput) {
      const prev = parseFloat(prevInput.value);
      const curr = parseFloat(currInput.value);
      if (!isNaN(prev) && !isNaN(curr)) {
        if (curr >= prev) {
          const diff = curr - prev;
          if (unitsInput) {
            unitsInput.value = diff.toFixed(1);
          }
        }
      }
    }
    updateLivePreview();
  }

  if (prevInput) prevInput.addEventListener('input', handleReadingChange);
  if (currInput) currInput.addEventListener('input', handleReadingChange);
  if (unitsInput) unitsInput.addEventListener('input', updateLivePreview);
  if (typeSelect) typeSelect.addEventListener('change', updateLivePreview);

  // Initialize live preview on load
  updateLivePreview();
});

/**
 * Calculates tariff slabs and updates UI live preview elements
 */
function updateLivePreview() {
  const unitsInput = document.getElementById('unitsConsumed');
  if (!unitsInput) return;

  const units = Math.max(0, parseFloat(unitsInput.value) || 0);

  // Slabs configuration matching problem requirements
  // 1. First 50 units: Rs. 3.50/unit
  // 2. Next 100 units: Rs. 4.00/unit (51 - 150)
  // 3. Next 100 units: Rs. 5.20/unit (151 - 250)
  // 4. Above 250 units: Rs. 6.50/unit
  let remaining = units;

  let s1Units = 0, s1Cost = 0;
  let s2Units = 0, s2Cost = 0;
  let s3Units = 0, s3Cost = 0;
  let s4Units = 0, s4Cost = 0;

  if (remaining > 0) {
    s1Units = Math.min(remaining, 50);
    s1Cost = s1Units * 3.50;
    remaining -= s1Units;
  }
  if (remaining > 0) {
    s2Units = Math.min(remaining, 100);
    s2Cost = s2Units * 4.00;
    remaining -= s2Units;
  }
  if (remaining > 0) {
    s3Units = Math.min(remaining, 100);
    s3Cost = s3Units * 5.20;
    remaining -= s3Units;
  }
  if (remaining > 0) {
    s4Units = remaining;
    s4Cost = s4Units * 6.50;
  }

  const energyCharges = s1Cost + s2Cost + s3Cost + s4Cost;

  // Determine fixed charge based on connection type
  let fixedCharge = 50.00;
  const typeSelect = document.getElementById('connectionType');
  if (typeSelect && typeSelect.value) {
    const val = typeSelect.value.toLowerCase();
    if (val.includes('commercial')) fixedCharge = 100.00;
    else if (val.includes('industrial')) fixedCharge = 250.00;
  }

  const taxDuty = (energyCharges + fixedCharge) * 0.05;
  const netPayable = energyCharges + fixedCharge + taxDuty;

  // Update DOM Preview Elements
  const previewTotal = document.getElementById('previewTotal');
  if (previewTotal) {
    previewTotal.textContent = 'Rs. ' + netPayable.toFixed(2);
  }

  const previewEnergy = document.getElementById('previewEnergy');
  if (previewEnergy) {
    previewEnergy.textContent = 'Rs. ' + energyCharges.toFixed(2);
  }

  // Slabs UI
  setElemText('s1_units', s1Units.toFixed(1) + ' units');
  setElemText('s1_cost', 'Rs. ' + s1Cost.toFixed(2));
  setElemText('s2_units', s2Units.toFixed(1) + ' units');
  setElemText('s2_cost', 'Rs. ' + s2Cost.toFixed(2));
  setElemText('s3_units', s3Units.toFixed(1) + ' units');
  setElemText('s3_cost', 'Rs. ' + s3Cost.toFixed(2));
  setElemText('s4_units', s4Units.toFixed(1) + ' units');
  setElemText('s4_cost', 'Rs. ' + s4Cost.toFixed(2));

  // Progress segments
  const totalUnitsForTrack = Math.max(units, 250);
  setTrackWidth('seg1', (s1Units / totalUnitsForTrack) * 100);
  setTrackWidth('seg2', (s2Units / totalUnitsForTrack) * 100);
  setTrackWidth('seg3', (s3Units / totalUnitsForTrack) * 100);
  setTrackWidth('seg4', (s4Units / totalUnitsForTrack) * 100);
}

function setElemText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function setTrackWidth(id, pct) {
  const el = document.getElementById(id);
  if (el) el.style.width = Math.max(0, Math.min(pct, 100)) + '%';
}

/**
 * Loads predefined test cases into the input form
 */
function fillTestCase(units, name, conType = 'Domestic (Residential)') {
  const nameInput = document.getElementById('consumerName');
  const idInput = document.getElementById('consumerId');
  const unitsInput = document.getElementById('unitsConsumed');
  const prevInput = document.getElementById('previousReading');
  const currInput = document.getElementById('currentReading');
  const typeSelect = document.getElementById('connectionType');

  if (nameInput) nameInput.value = name;
  if (idInput) idInput.value = 'EB-2026-' + Math.floor(1000 + Math.random() * 9000);
  if (prevInput) prevInput.value = 1000;
  if (currInput) currInput.value = 1000 + units;
  if (unitsInput) unitsInput.value = units;
  if (typeSelect) typeSelect.value = conType;

  updateLivePreview();

  // Highlight effect
  if (unitsInput) {
    unitsInput.style.transform = 'scale(1.03)';
    setTimeout(() => { unitsInput.style.transform = 'scale(1)'; }, 200);
  }
}

/**
 * Validates form submission
 */
function validateForm() {
  const unitsInput = document.getElementById('unitsConsumed');
  const prevInput = document.getElementById('previousReading');
  const currInput = document.getElementById('currentReading');

  if (prevInput && currInput && prevInput.value && currInput.value) {
    const prev = parseFloat(prevInput.value);
    const curr = parseFloat(currInput.value);
    if (curr < prev) {
      alert('Error: Current meter reading cannot be less than previous meter reading.');
      currInput.focus();
      return false;
    }
  }

  if (unitsInput) {
    const units = parseFloat(unitsInput.value);
    if (isNaN(units) || units < 0) {
      alert('Please enter a valid positive number for units consumed.');
      unitsInput.focus();
      return false;
    }
  }

  return true;
}

/**
 * Print Invoice
 */
function printInvoice() {
  window.print();
}
