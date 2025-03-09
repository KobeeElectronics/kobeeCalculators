// Conversion factors to newtons (base unit)
const conversionFactors = {
    // SI Units
    'n': 1,
    'kn': 1000,
    'mn': 1000000,
    'mn_small': 0.001,
    'micron': 0.000001,
    
    // Imperial/US
    'lbf': 4.4482216153,
    'kip': 4448.2216153,
    'ozf': 0.2780138509,
    'pdl': 0.138254954376,
    'tonf': 8896.443230521,
    
    // Gravitational
    'kgf': 9.80665,
    'gf': 0.00980665,
    'tf': 9806.65,
    
    // Other
    'dyn': 0.00001,
    'sn': 1000,
    'kp': 9.80665,  // Same as kgf
    'atm': 101325   // Force per square meter at 1 atm
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
    
    // Convert to newtons first (base unit)
    const newtons = value * conversionFactors[fromUnit];
    
    // Convert from newtons to target unit
    return newtons / conversionFactors[toUnit];
}

// Format the result based on the magnitude and unit type
function formatResult(value, unit) {
    if (value === '' || isNaN(value)) return '';
    
    // Handle very large numbers
    if (Math.abs(value) >= 1e15) {
        return value.toExponential(6);
    }
    
    // Handle very small numbers
    if (Math.abs(value) < 0.000001 && value !== 0) {
        return value.toExponential(6);
    }
    
    // For small units and small values, show more decimal places
    if (['dyn', 'mn_small', 'micron', 'gf'].includes(unit) || value < 0.1) {
        return Number(value.toPrecision(8)).toString();
    }
    
    // For large units, show fewer decimal places
    if (['mn', 'kn', 'tf', 'tonf', 'kip'].includes(unit)) {
        return Number(value.toPrecision(7)).toString();
    }
    
    // For other numbers, use standard precision
    return Number(value.toPrecision(9)).toString();
}

// Update the result when input changes
function updateResult() {
    const value = fromValue.value;
    const from = fromUnit.value;
    const to = toUnit.value;
    
    const result = convert(value, from, to);
    toValue.value = formatResult(result, to);
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