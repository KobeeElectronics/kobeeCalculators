// Conversion factors to cubic meters (base unit)
const conversionFactors = {
    // Metric
    'm3': 1,
    'dm3': 0.001,
    'cm3': 0.000001,
    'mm3': 1e-9,
    'hl': 0.1,
    'l': 0.001,
    'dl': 0.0001,
    'cl': 0.00001,
    'ml': 0.000001,
    'kl': 1,
    'Ml': 1000,
    'cc': 0.000001,
    
    // Imperial/US Liquid
    'gal': 0.003785411784,
    'qt': 0.000946352946,
    'pt': 0.000473176473,
    'cup': 0.0002365882365,
    'fl_oz': 0.0000295735295625,
    'tbsp': 0.0000147867647813,
    'tsp': 0.00000492892159375,
    'gi': 0.0001182941183,
    
    // US Dry
    'dry_qt': 0.001101220942715,
    'dry_pt': 0.0005506104713575,
    'pk': 0.008809767571320,
    'bu': 0.03523907028528,
    
    // Imperial
    'uk_gal': 0.00454609,
    'uk_qt': 0.0011365225,
    'uk_pt': 0.00056826125,
    'uk_fl_oz': 0.0000284130625,
    
    // Other
    'bbl': 0.158987294928,  // Oil barrel
    'beer_bbl': 0.117347765  // Beer barrel
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
    
    // Convert to cubic meters first (base unit)
    const cubicMeters = value * conversionFactors[fromUnit];
    
    // Convert from cubic meters to target unit
    return cubicMeters / conversionFactors[toUnit];
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