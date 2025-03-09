// Conversion factors to meters (base unit)
const conversionFactors = {
    // Metric
    'km': 1000,
    'm': 1,
    'dm': 0.1,
    'cm': 0.01,
    'mm': 0.001,
    'µm': 1e-6,
    'nm': 1e-9,
    
    // Imperial/US
    'mi': 1609.344,
    'yd': 0.9144,
    'ft': 0.3048,
    'in': 0.0254,
    
    // Maritime
    'nmi': 1852,
    'ftm': 1.8288,
    'cable': 185.2,
    
    // Survey
    'chain': 20.1168,
    'rd': 5.0292,
    'link': 0.201168,
    
    // Other
    'ly': 9.461e15,
    'au': 149597870700,
    'pc': 3.086e16,
    'angstrom': 1e-10
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
    
    // Convert to meters first (base unit)
    const meters = value * conversionFactors[fromUnit];
    
    // Convert from meters to target unit
    return meters / conversionFactors[toUnit];
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