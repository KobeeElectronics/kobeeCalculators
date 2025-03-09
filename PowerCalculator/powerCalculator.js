// Conversion factors to watts (base unit)
const conversionFactors = {
    // SI Units
    'w': 1,
    'kw': 1000,
    'mw': 1000000,
    'gw': 1000000000,
    'mw_small': 0.001,
    
    // Mechanical/Industrial
    'hp': 745.699872,
    'ps': 735.49875,
    'ftlb_s': 1.355817948,
    'btu_h': 0.29307107,
    'btu_m': 17.584264,
    
    // Energy Rate
    'j_s': 1,
    'kj_h': 0.277777778,
    'kcal_h': 1.163,
    'cal_s': 4.184,
    
    // Electrical
    'va': 1,  // Assuming power factor of 1
    'kva': 1000,
    'mva': 1000000,
    'dBm': function(value, toBase) {
        if (toBase) {
            // Convert dBm to watts
            return 0.001 * Math.pow(10, value / 10);
        } else {
            // Convert watts to dBm
            return 10 * Math.log10(value / 0.001);
        }
    }
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
    
    // Convert to watts first (base unit)
    let watts;
    if (fromUnit === 'dBm') {
        watts = conversionFactors['dBm'](parseFloat(value), true);
    } else {
        watts = value * conversionFactors[fromUnit];
    }
    
    // Convert from watts to target unit
    if (toUnit === 'dBm') {
        return conversionFactors['dBm'](watts, false);
    } else {
        return watts / conversionFactors[toUnit];
    }
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
    
    // For dBm values, use fixed decimal places
    if (toUnit.value === 'dBm') {
        return Number(value.toFixed(2)).toString();
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