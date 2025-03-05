// Get DOM elements
const loadCapacitanceInput = document.getElementById('cl');
const strayCapacitanceInput = document.getElementById('cstray');
const loadUnitSelect = document.getElementById('cl-unit');
const strayUnitSelect = document.getElementById('cstray-unit');
const resultValue = document.getElementById('result-value');

// Conversion factors for different units (to picofarads)
const conversionFactors = {
    'pF': 1,
    'nF': 1000,
    'µF': 1000000,
    'mF': 1000000000,
    'F': 1000000000000
};

// Standard capacitor values (E12 series multipliers)
const e12Values = [1.0, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2, 10];

// Function to convert value to picofarads based on selected unit
function convertToPicofarads(value, unit) {
    return value * conversionFactors[unit];
}

// Function to find nearest standard capacitor value
function findNearestStandardValue(value) {
    // Find the exponent (in base 10)
    const exponent = Math.floor(Math.log10(value));
    const mantissa = value / Math.pow(10, exponent);
    
    // Find the nearest E12 value for the mantissa
    let nearestE12 = e12Values[0];
    let minDiff = Math.abs(mantissa - e12Values[0]);
    
    for (let i = 1; i < e12Values.length; i++) {
        const diff = Math.abs(mantissa - e12Values[i]);
        if (diff < minDiff) {
            minDiff = diff;
            nearestE12 = e12Values[i];
        }
    }
    
    return nearestE12 * Math.pow(10, exponent);
}

// Function to format capacitance with appropriate unit
function formatCapacitance(picofarads) {
    if (picofarads >= 1000000000000) { // 1F or larger
        return {
            value: (picofarads / 1000000000000).toFixed(2),
            unit: 'F'
        };
    } else if (picofarads >= 1000000000) { // 1mF or larger
        return {
            value: (picofarads / 1000000000).toFixed(2),
            unit: 'mF'
        };
    } else if (picofarads >= 1000000) { // 1µF or larger
        return {
            value: (picofarads / 1000000).toFixed(2),
            unit: 'µF'
        };
    } else if (picofarads >= 1000) { // 1nF or larger
        return {
            value: (picofarads / 1000).toFixed(2),
            unit: 'nF'
        };
    } else {
        return {
            value: picofarads.toFixed(1),
            unit: 'pF'
        };
    }
}

// Function to validate input
function isValidInput(value) {
    return value !== '' && !isNaN(value) && value >= 0;
}

// Function to calculate oscillator capacitors
function calculateCapacitors() {
    // Get input values
    const loadCapacitance = parseFloat(loadCapacitanceInput.value);
    const strayCapacitance = parseFloat(strayCapacitanceInput.value);
    const loadUnit = loadUnitSelect.value;
    const strayUnit = strayUnitSelect.value;

    // Clear result if inputs are empty
    if (loadCapacitanceInput.value === '' || strayCapacitanceInput.value === '') {
        resultValue.textContent = '';
        return;
    }

    // Validate inputs
    if (!isValidInput(loadCapacitance) || !isValidInput(strayCapacitance)) {
        resultValue.textContent = 'Please enter valid positive numbers for both capacitances.';
        return;
    }

    // Convert inputs to picofarads
    const CLpF = convertToPicofarads(loadCapacitance, loadUnit);
    const CstraypF = convertToPicofarads(strayCapacitance, strayUnit);

    // Calculate C1 and C2 (they are equal)
    const C1pF = 2 * CLpF - 2 * CstraypF;

    // Check if result is negative
    if (C1pF < 0) {
        resultValue.textContent = 'The calculated capacitance is negative. Please check your input values.';
        return;
    }

    // Find nearest standard value and format with appropriate unit
    const standardValue = findNearestStandardValue(C1pF);
    const formattedResult = formatCapacitance(standardValue);

    // Display result with appropriate unit
    resultValue.textContent = `C1 = C2 = ${formattedResult.value} ${formattedResult.unit}`;
}

// Add event listeners for real-time calculation
loadCapacitanceInput.addEventListener('input', calculateCapacitors);
strayCapacitanceInput.addEventListener('input', calculateCapacitors);
loadUnitSelect.addEventListener('change', calculateCapacitors);
strayUnitSelect.addEventListener('change', calculateCapacitors);

// Initial calculation attempt
calculateCapacitors(); 