document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const fromValue = document.getElementById('from-value');
    const fromUnit = document.getElementById('from-unit');
    const toValue = document.getElementById('to-value');
    const toUnit = document.getElementById('to-unit');
    const swapButton = document.getElementById('swap');
    const resetButton = document.getElementById('reset');

    // Conversion factors to Joules (base unit)
    const TO_JOULES = {
        // Joule units
        'J': 1,
        'MJ': 1e6,
        'kJ': 1e3,
        'mJ': 1e-3,
        'µJ': 1e-6,
        'nJ': 1e-9,
        'GJ': 1e9,
        'aJ': 1e-18,
        
        // Power units
        'kWh': 3.6e6,
        'GWh': 3.6e9,
        'MWh': 3.6e9,        // 3.6 million kilowatt-hours
        'Wh': 3.6e3,
        'kWs': 1e3,
        'Ws': 1,

        // Mechanical units
        'Nm': 1,
        'dyncm': 1e-7,
        'gfm': 0.00980665,
        'gfcm': 0.0000980665,
        'kgfcm': 0.0980665,
        'kgfm': 9.80665,
        'kpm': 9.80665,
        'lbfft': 1.355818,
        'lbfin': 0.112985,
        'ozfin': 0.007061594,
        'ftlbf': 1.355818,
        'inlbf': 0.112985,
        'inozf': 0.007061594,
        'pdlft': 0.04214011,

        // Calories
        'kcal': 4184,         // International Table
        'kcalth': 4181.8,     // Thermochemical
        'cal': 4.184,         // International Table
        'calth': 4.1818,      // Thermochemical

        // BTU and Therm
        'BTU': 1055.06,       // International Table
        'BTUth': 1054.35,     // Thermochemical
        'MBTU': 1.05506e6,    // International Table
        'therm': 1.05506e8,   // International Table
        'thermEC': 1.05506e8, // EC
        'thermUS': 1.054804e8,// US

        // Other units
        'hph': 2.6845e6,      // Horsepower Hour
        'tonref': 1.2660670e7,// Ton Hour (refrigeration)
        'eV': 1.602176634e-19,// Electron Volt
        'keV': 1.602176634e-16,
        'MeV': 1.602176634e-13,
        'erg': 1e-7,
        'hartree': 4.359744650e-18,
        'rydberg': 2.179872325e-18
    };

    // Function to convert from any unit to Joules
    function toJoules(value, unit) {
        return value * TO_JOULES[unit];
    }

    // Function to convert from Joules to any unit
    function fromJoules(joules, unit) {
        return joules / TO_JOULES[unit];
    }

    // Function to update the result
    function updateResult() {
        const value = parseFloat(fromValue.value);
        if (isNaN(value) || value === '') {
            toValue.value = '';
            return;
        }

        // Convert to joules first, then to target unit
        const joules = toJoules(value, fromUnit.value);
        const result = fromJoules(joules, toUnit.value);
        
        // Format the result based on its magnitude
        if (Math.abs(result) < 0.01 || Math.abs(result) >= 1e6) {
            toValue.value = result.toExponential(4);
        } else {
            toValue.value = result.toFixed(4);
        }
    }

    // Event listeners for input and unit changes
    fromValue.addEventListener('input', updateResult);
    fromUnit.addEventListener('change', updateResult);
    toUnit.addEventListener('change', updateResult);

    // Swap button handler
    swapButton.addEventListener('click', function() {
        // Swap units
        const tempUnit = fromUnit.value;
        fromUnit.value = toUnit.value;
        toUnit.value = tempUnit;

        // Swap values if there's a result
        if (toValue.value !== '') {
            fromValue.value = toValue.value;
            updateResult();
        }
    });

    // Reset button handler
    resetButton.addEventListener('click', function() {
        fromValue.value = '';
        toValue.value = '';
        fromUnit.selectedIndex = 0;
        toUnit.selectedIndex = 0;
    });
}); 