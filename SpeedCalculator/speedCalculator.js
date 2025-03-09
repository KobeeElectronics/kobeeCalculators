// Conversion factors to meters per second (base unit)
const conversionFactors = {
    // Metric
    'm_s': 1,
    'km_h': 0.277777778,
    'km_s': 1000,
    'cm_s': 0.01,
    'mm_s': 0.001,
    
    // Imperial/US
    'mph': 0.44704,
    'fps': 0.3048,
    'ips': 0.0254,
    'yard_s': 0.9144,
    'knot': 0.514444444,
    
    // Aviation/Space
    'mach': 343,  // at sea level, 20°C
    'kts': 0.514444444,
    'c': 299792458,  // speed of light in vacuum
    
    // Other
    'kph': 0.277777778,
    'mpm': 26.8224,
    'mps': 1609.344,
    'fpm': 0.00508
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
    
    // Convert to meters per second first (base unit)
    const metersPerSecond = value * conversionFactors[fromUnit];
    
    // Convert from meters per second to target unit
    return metersPerSecond / conversionFactors[toUnit];
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