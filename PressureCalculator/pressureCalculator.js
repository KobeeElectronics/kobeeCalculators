// Conversion factors to Pascal (base unit)
const conversionFactors = {
    // SI Units
    'Pa': 1,
    'kPa': 1000,
    'MPa': 1000000,
    'GPa': 1000000000,
    'bar': 100000,
    'mbar': 100,
    
    // Imperial/US
    'psi': 6894.75729317831,
    'ksi': 6894757.29317831,
    'psf': 47.880258888889,
    'inHg': 3386.389,
    'ftH2O': 2989.067,
    'inH2O': 249.089,
    
    // Atmospheric
    'atm': 101325,
    'Torr': 133.322,
    'mmHg': 133.322,
    'cmH2O': 98.0665,
    'mmH2O': 9.80665,
    
    // Other
    'dyn_cm2': 0.1,
    'kgf_cm2': 98066.5,
    'kgf_m2': 9.80665,
    'mtorr': 0.133322,
    'ubar': 0.1
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
    
    // Convert to Pascal first (base unit)
    const pascals = value * conversionFactors[fromUnit];
    
    // Convert from Pascal to target unit
    return pascals / conversionFactors[toUnit];
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