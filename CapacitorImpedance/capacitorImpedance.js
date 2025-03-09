// Get DOM elements
const capacitanceInput = document.getElementById('capacitance');
const capacitanceUnit = document.getElementById('capacitanceUnit');
const frequencyInput = document.getElementById('frequency');
const frequencyUnit = document.getElementById('frequencyUnit');
const impedanceValue = document.getElementById('impedanceValue');
const resetButton = document.getElementById('reset');

// Constants
const PI = Math.PI;

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Calculate impedance
function calculateImpedance() {
    const capacitance = parseFloat(capacitanceInput.value);
    const frequency = parseFloat(frequencyInput.value);
    
    if (isNaN(capacitance) || isNaN(frequency) || capacitance === 0 || frequency === 0) {
        impedanceValue.textContent = '-';
        return;
    }
    
    // Convert units to base units (F and Hz)
    const capacitanceInFarads = capacitance * parseFloat(capacitanceUnit.value);
    const frequencyInHertz = frequency * parseFloat(frequencyUnit.value);
    
    // Calculate impedance: Xc = 1 / (2πfC)
    const impedance = 1 / (2 * PI * frequencyInHertz * capacitanceInFarads);
    
    // Format the result
    if (impedance >= 1e9) {
        impedanceValue.textContent = (impedance / 1e9).toFixed(3) + ' G';
    } else if (impedance >= 1e6) {
        impedanceValue.textContent = (impedance / 1e6).toFixed(3) + ' M';
    } else if (impedance >= 1e3) {
        impedanceValue.textContent = (impedance / 1e3).toFixed(3) + ' k';
    } else if (impedance >= 1) {
        impedanceValue.textContent = impedance.toFixed(3);
    } else if (impedance >= 1e-3) {
        impedanceValue.textContent = (impedance * 1e3).toFixed(3) + ' m';
    } else {
        impedanceValue.textContent = (impedance * 1e6).toFixed(3) + ' µ';
    }
}

// Reset calculator
function resetCalculator() {
    capacitanceInput.value = '';
    frequencyInput.value = '';
    impedanceValue.textContent = '-';
}

// Event listeners
const debouncedCalculate = debounce(calculateImpedance, 500);

capacitanceInput.addEventListener('input', debouncedCalculate);
capacitanceUnit.addEventListener('change', debouncedCalculate);
frequencyInput.addEventListener('input', debouncedCalculate);
frequencyUnit.addEventListener('change', debouncedCalculate);
resetButton.addEventListener('click', resetCalculator);

// Initialize calculator
resetCalculator(); 