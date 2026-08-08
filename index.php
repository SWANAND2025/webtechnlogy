<?php
// ---------------------------------------------------------
// Electricity Bill Calculator
// Slabs:
// 1 - 50 units      : Rs. 3.50 / unit
// 51 - 150 units    : Rs. 4.00 / unit
// 151 - 250 units   : Rs. 5.20 / unit
// Above 250 units   : Rs. 6.50 / unit
// ---------------------------------------------------------

$units = "";
$totalBill = 0;
$showResult = false;
$error = "";

// Breakdown values (for showing slab-wise calculation)
$slab1Units = $slab2Units = $slab3Units = $slab4Units = 0;
$slab1Amt = $slab2Amt = $slab3Amt = $slab4Amt = 0;

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $units = trim($_POST["units"]);

    if ($units === "" || !is_numeric($units) || $units < 0) {
        $error = "Please enter a valid positive number of units.";
    } else {
        $units = (float) $units;
        $remaining = $units;

        // Slab 1: first 50 units
        $slab1Units = min($remaining, 50);
        $slab1Amt = $slab1Units * 3.50;
        $remaining -= $slab1Units;

        // Slab 2: next 100 units (51 - 150)
        if ($remaining > 0) {
            $slab2Units = min($remaining, 100);
            $slab2Amt = $slab2Units * 4.00;
            $remaining -= $slab2Units;
        }

        // Slab 3: next 100 units (151 - 250)
        if ($remaining > 0) {
            $slab3Units = min($remaining, 100);
            $slab3Amt = $slab3Units * 5.20;
            $remaining -= $slab3Units;
        }

        // Slab 4: above 250 units
        if ($remaining > 0) {
            $slab4Units = $remaining;
            $slab4Amt = $slab4Units * 6.50;
            $remaining = 0;
        }

        $totalBill = $slab1Amt + $slab2Amt + $slab3Amt + $slab4Amt;
        $showResult = true;
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Electricity Bill Calculator</title>
<style>
    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        font-family: 'Segoe UI', Arial, sans-serif;
    }

    body {
        min-height: 100vh;
        background: linear-gradient(135deg, #1e3c72, #2a5298);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
    }

    .container {
        background: #ffffff;
        width: 100%;
        max-width: 480px;
        border-radius: 14px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
        overflow: hidden;
    }

    .header {
        background: #1e3c72;
        color: #fff;
        text-align: center;
        padding: 24px 20px;
    }

    .header h1 {
        font-size: 22px;
        margin-bottom: 6px;
    }

    .header p {
        font-size: 13px;
        opacity: 0.85;
    }

    .form-body {
        padding: 25px 25px 10px 25px;
    }

    .form-group {
        margin-bottom: 18px;
    }

    label {
        display: block;
        margin-bottom: 8px;
        font-weight: 600;
        color: #333;
        font-size: 14px;
    }

    input[type="number"] {
        width: 100%;
        padding: 12px 14px;
        border: 2px solid #dfe4ea;
        border-radius: 8px;
        font-size: 15px;
        outline: none;
        transition: border 0.2s;
    }

    input[type="number"]:focus {
        border-color: #2a5298;
    }

    button {
        width: 100%;
        padding: 13px;
        background: #2a5298;
        color: #fff;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s;
    }

    button:hover {
        background: #1e3c72;
    }

    .error {
        background: #ffe1e1;
        color: #c0392b;
        padding: 10px 14px;
        border-radius: 8px;
        margin-bottom: 15px;
        font-size: 14px;
        border-left: 4px solid #c0392b;
    }

    .result {
        margin: 10px 25px 25px 25px;
        background: #f4f8ff;
        border: 1px solid #d6e4ff;
        border-radius: 10px;
        padding: 18px;
    }

    .result h2 {
        font-size: 16px;
        color: #1e3c72;
        margin-bottom: 12px;
        border-bottom: 1px solid #d6e4ff;
        padding-bottom: 8px;
    }

    .row {
        display: flex;
        justify-content: space-between;
        font-size: 13.5px;
        color: #444;
        padding: 5px 0;
    }

    .row span:last-child {
        font-weight: 600;
        color: #222;
    }

    .total-row {
        display: flex;
        justify-content: space-between;
        margin-top: 14px;
        padding-top: 14px;
        border-top: 2px dashed #b7c9ee;
        font-size: 18px;
        font-weight: 700;
        color: #1e3c72;
    }

    .footer-note {
        text-align: center;
        font-size: 11.5px;
        color: #888;
        padding: 0 25px 20px 25px;
    }

    @media (max-width: 400px) {
        .header h1 {
            font-size: 19px;
        }
        .result h2 {
            font-size: 15px;
        }
        .total-row {
            font-size: 16px;
        }
    }
</style>
</head>
<body>

<div class="container">
    <div class="header">
        <h1>⚡ Electricity Bill Calculator</h1>
        <p>Slab-wise billing made simple</p>
    </div>

    <div class="form-body">
        <?php if ($error): ?>
            <div class="error"><?php echo htmlspecialchars($error); ?></div>
        <?php endif; ?>

        <form method="POST" action="">
            <div class="form-group">
                <label for="units">Enter Units Consumed</label>
                <input type="number" step="0.01" min="0" name="units" id="units"
                       placeholder="e.g. 275" value="<?php echo htmlspecialchars($units); ?>" required>
            </div>
            <button type="submit">Calculate Bill</button>
        </form>
    </div>

    <?php if ($showResult): ?>
    <div class="result">
        <h2>Bill Breakdown</h2>

        <?php if ($slab1Units > 0): ?>
        <div class="row">
            <span>First <?php echo $slab1Units; ?> units @ Rs. 3.50</span>
            <span>Rs. <?php echo number_format($slab1Amt, 2); ?></span>
        </div>
        <?php endif; ?>

        <?php if ($slab2Units > 0): ?>
        <div class="row">
            <span>Next <?php echo $slab2Units; ?> units @ Rs. 4.00</span>
            <span>Rs. <?php echo number_format($slab2Amt, 2); ?></span>
        </div>
        <?php endif; ?>

        <?php if ($slab3Units > 0): ?>
        <div class="row">
            <span>Next <?php echo $slab3Units; ?> units @ Rs. 5.20</span>
            <span>Rs. <?php echo number_format($slab3Amt, 2); ?></span>
        </div>
        <?php endif; ?>

        <?php if ($slab4Units > 0): ?>
        <div class="row">
            <span>Above 250: <?php echo $slab4Units; ?> units @ Rs. 6.50</span>
            <span>Rs. <?php echo number_format($slab4Amt, 2); ?></span>
        </div>
        <?php endif; ?>

        <div class="total-row">
            <span>Total Bill</span>
            <span>Rs. <?php echo number_format($totalBill, 2); ?></span>
        </div>
    </div>
    <?php endif; ?>

    <div class="footer-note">
        Rates: 0–50 @ ₹3.50 | 51–150 @ ₹4.00 | 151–250 @ ₹5.20 | 250+ @ ₹6.50 (per unit)
    </div>
</div>

</body>
</html>