// Conversion factors to kilograms (base unit)
const conversionFactors = {
    // Metric
    'kg': 1,
    'g': 0.001,
    'mg': 0.000001,
    'mcg': 0.000000001,
    'mt': 1000,
    
    // Imperial/US
    'lb': 0.45359237,
    'oz': 0.028349523125,
    'st': 6.35029318,
    'ton': 907.18474,
    'long_ton': 1016.047,
    
    // Scientific
    'dalton': 1.660539067e-27,
    'atomic_mass': 1.660539067e-27,
    
    // Other
    'carat': 0.0002,
    'grain': 0.00006479891,
    'newton': 0.101971621298,  // Assuming standard gravity (9.80665 m/s²)
    'dram': 0.0017718452
};

// Get DOM elements
const fromValue = document.getElementById('from-value');
const toValue = document.getElementById('to-value');
const fromUnit = document.getElementById('from-unit');
const toUnit = document.getElementById('to-unit');
const swapButton = document.getElementById('swap');
const resetButton = document.getElementById('reset');

// Convert from one unit to another
function convert(value, fromUnit, toUnit) {
    if (value === '' || isNaN(value)) return '';
    
    // Convert to kilograms first (base unit)
    const kilograms = value * conversionFactors[fromUnit];
    
    // Convert from kilograms to target unit
    return kilograms / conversionFactors[toUnit];
}

// Format the result based on the magnitude
function formatResult(value) {
    if (value === '' || isNaN(value)) return '';
    
    // Handle very large numbers
    if (Math.abs(value) >= 1e15) {
        return value.toExponential(6);
    }
    
    // Handle very small numbers
    if (Math.abs(value) < 0.000001 && value !== 0) {
        return value.toExponential(6);
    }
    
    // For other numbers, use fixed decimal places
    return Number(value.toPrecision(10)).toString();
}

// Update the result when input changes
function updateResult() {
    const value = fromValue.value;
    const from = fromUnit.value;
    const to = toUnit.value;
    
    const result = convert(value, from, to);
    toValue.value = formatResult(result);
}

// Swap the values and units
function swapUnits() {
    // Store current values
    const tempValue = fromValue.value;
    const tempUnit = fromUnit.value;
    
    // Swap units
    fromUnit.value = toUnit.value;
    toUnit.value = tempUnit;
    
    // Swap values if they exist
    if (tempValue !== '') {
        fromValue.value = toValue.value;
        updateResult();
    }
}

// Reset all fields
function resetFields() {
    fromValue.value = '';
    toValue.value = '';
    fromUnit.selectedIndex = 0;
    toUnit.selectedIndex = 0;
}

// Event listeners
fromValue.addEventListener('input', updateResult);
fromUnit.addEventListener('change', updateResult);
toUnit.addEventListener('change', updateResult);
swapButton.addEventListener('click', swapUnits);
resetButton.addEventListener('click', resetFields);

// Initialize the calculator
resetFields(); 