// Conversion factors to bytes (base unit)
const conversionFactors = {
    // Bytes (Decimal)
    'b': 1,
    'kb': 1000,
    'mb': 1000000,
    'gb': 1000000000,
    'tb': 1000000000000,
    'pb': 1000000000000000,
    
    // Bits
    'bit': 0.125,  // 1/8 byte
    'kbit': 125,   // 1000 bits
    'mbit': 125000,
    'gbit': 125000000,
    'tbit': 125000000000,
    
    // Binary Units (IEC)
    'kib': 1024,
    'mib': 1048576,        // 1024^2
    'gib': 1073741824,     // 1024^3
    'tib': 1099511627776,  // 1024^4
    'pib': 1125899906842624, // 1024^5
    
    // Legacy/Other
    'word': 2,        // 16 bits = 2 bytes
    'block': 512,     // Traditional disk block
    'nibble': 0.5,    // 4 bits
    'sector': 512     // Traditional disk sector
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
    
    // Convert to bytes first (base unit)
    const bytes = value * conversionFactors[fromUnit];
    
    // Convert from bytes to target unit
    return bytes / conversionFactors[toUnit];
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
    
    // For bit-based units and small values, show more decimal places
    if (unit.includes('bit') || unit === 'nibble' || value < 1) {
        return Number(value.toPrecision(8)).toString();
    }
    
    // For whole-number-preferred units (blocks, sectors, words)
    if (['block', 'sector', 'word'].includes(unit) && value % 1 === 0) {
        return value.toString();
    }
    
    // For other numbers, use standard precision
    return Number(value.toPrecision(10)).toString();
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