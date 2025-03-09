document.addEventListener('DOMContentLoaded', () => {
    const voltageInput = document.getElementById('voltage');
    const currentInput = document.getElementById('current');
    const resistanceInput = document.getElementById('resistance');
    const powerInput = document.getElementById('power');
    const voltageUnit = document.getElementById('voltage-unit');
    const currentUnit = document.getElementById('current-unit');
    const resistanceUnit = document.getElementById('resistance-unit');
    const calculateButton = document.getElementById('calculate');
    const resetButton = document.getElementById('reset');
    const formulaGroups = document.querySelectorAll('.formula-group');

    const inputs = [voltageInput, currentInput, resistanceInput, powerInput];
    const unitSelects = [voltageUnit, currentUnit, resistanceUnit];
    let filledInputs = new Set();

    // Add input event listeners
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            const value = input.value.trim();
            if (value !== '') {
                filledInputs.add(input.id);
            } else {
                filledInputs.delete(input.id);
            }
            updateInputStates();
        });
    });

    // Add unit change listeners
    unitSelects.forEach(select => {
        select.addEventListener('change', () => {
            if (filledInputs.size >= 2) {
                calculateResult();
            }
        });
    });

    // Reset button click handler
    resetButton.addEventListener('click', () => {
        inputs.forEach(input => {
            input.value = '';
            input.disabled = false;
            input.style.borderColor = '#ddd';
        });
        // Reset units to defaults
        voltageUnit.value = 'V';
        currentUnit.value = 'A';
        resistanceUnit.value = 'Ω';
        filledInputs.clear();
        updateInputStates();
        clearFormulaHighlights();
    });

    // Calculate button click handler
    calculateButton.addEventListener('click', calculateResult);

    function calculateResult() {
        if (filledInputs.size !== 2) return;

        const values = {};
        // Convert all values to base units (V, A, Ω)
        if (voltageInput.value) {
            values.voltage = convertToBaseUnit(parseFloat(voltageInput.value), voltageUnit.value);
        }
        if (currentInput.value) {
            values.current = convertToBaseUnit(parseFloat(currentInput.value), currentUnit.value);
        }
        if (resistanceInput.value) {
            values.resistance = convertToBaseUnit(parseFloat(resistanceInput.value), resistanceUnit.value);
        }
        if (powerInput.value) {
            values.power = parseFloat(powerInput.value);
        }

        const results = calculateMissingValues(values);
        updateResults(results);
        highlightRelevantFormulas(values);
    }

    function convertToBaseUnit(value, unit) {
        switch (unit) {
            case 'mV': return value * 0.001;  // Convert mV to V
            case 'mA': return value * 0.001;  // Convert mA to A
            case 'kΩ': return value * 1000;   // Convert kΩ to Ω
            case 'MΩ': return value * 1000000; // Convert MΩ to Ω
            default: return value;
        }
    }

    function convertFromBaseUnit(value, unit) {
        switch (unit) {
            case 'mV': return value * 1000;    // Convert V to mV
            case 'mA': return value * 1000;    // Convert A to mA
            case 'kΩ': return value * 0.001;   // Convert Ω to kΩ
            case 'MΩ': return value * 0.000001; // Convert Ω to MΩ
            default: return value;
        }
    }

    function updateInputStates() {
        // Enable/disable calculate button
        calculateButton.disabled = filledInputs.size !== 2;

        // Update input states
        if (filledInputs.size >= 2) {
            inputs.forEach(input => {
                if (!filledInputs.has(input.id)) {
                    input.disabled = true;
                }
            });
        } else {
            inputs.forEach(input => {
                if (!filledInputs.has(input.id)) {
                    input.disabled = false;
                }
            });
        }

        // Update input styles
        inputs.forEach(input => {
            if (input.value.trim() !== '') {
                input.style.borderColor = '#FED700';
            } else {
                input.style.borderColor = '#ddd';
            }
        });
    }

    function calculateMissingValues(values) {
        const results = { ...values };

        if ('voltage' in values && 'current' in values) {
            results.resistance = values.voltage / values.current;
            results.power = values.voltage * values.current;
        } else if ('voltage' in values && 'resistance' in values) {
            results.current = values.voltage / values.resistance;
            results.power = Math.pow(values.voltage, 2) / values.resistance;
        } else if ('voltage' in values && 'power' in values) {
            results.current = values.power / values.voltage;
            results.resistance = Math.pow(values.voltage, 2) / values.power;
        } else if ('current' in values && 'resistance' in values) {
            results.voltage = values.current * values.resistance;
            results.power = Math.pow(values.current, 2) * values.resistance;
        } else if ('current' in values && 'power' in values) {
            results.voltage = values.power / values.current;
            results.resistance = values.power / Math.pow(values.current, 2);
        } else if ('resistance' in values && 'power' in values) {
            results.voltage = Math.sqrt(values.power * values.resistance);
            results.current = Math.sqrt(values.power / values.resistance);
        }

        return results;
    }

    function updateResults(results) {
        if (results.voltage !== undefined) {
            voltageInput.value = convertFromBaseUnit(results.voltage, voltageUnit.value).toFixed(3);
            voltageInput.style.borderColor = '#FED700';
        }
        if (results.current !== undefined) {
            currentInput.value = convertFromBaseUnit(results.current, currentUnit.value).toFixed(3);
            currentInput.style.borderColor = '#FED700';
        }
        if (results.resistance !== undefined) {
            resistanceInput.value = convertFromBaseUnit(results.resistance, resistanceUnit.value).toFixed(3);
            resistanceInput.style.borderColor = '#FED700';
        }
        if (results.power !== undefined) {
            powerInput.value = results.power.toFixed(3);
            powerInput.style.borderColor = '#FED700';
        }
    }

    function clearFormulaHighlights() {
        document.querySelectorAll('.formula-group p').forEach(p => {
            p.classList.remove('highlight');
        });
    }

    function highlightRelevantFormulas(values) {
        clearFormulaHighlights();
        
        // Define which equation to use based on the given inputs
        const formulaMap = {
            'voltage': {
                'current,resistance': 0,     // V = I × R
                'power,resistance': 1,       // V = √(P × R)
                'power,current': 2           // V = P ÷ I
            },
            'current': {
                'voltage,resistance': 0,     // I = V ÷ R
                'power,resistance': 1,       // I = √(P ÷ R)
                'power,voltage': 2           // I = P ÷ V
            },
            'resistance': {
                'voltage,current': 0,        // R = V ÷ I
                'voltage,power': 1,          // R = V² ÷ P
                'power,current': 2           // R = P ÷ I²
            },
            'power': {
                'voltage,current': 0,        // P = V × I
                'voltage,resistance': 2,     // P = V² ÷ R
                'current,resistance': 1      // P = I² × R
            }
        };

        // Get the two input parameters
        const inputParams = Object.keys(values).sort().join(',');
        console.log('Input parameters:', inputParams);

        // Find which values need to be calculated (the ones not provided)
        const calculatedParams = ['voltage', 'current', 'resistance', 'power'].filter(param => !values[param]);
        console.log('Calculated parameters:', calculatedParams);

        // Highlight the relevant formulas
        calculatedParams.forEach(param => {
            const formulaGroup = document.querySelector(`.formula-group.${param}`);
            if (!formulaGroup) return;

            const equations = Array.from(formulaGroup.querySelectorAll('p'));
            
            // Find the correct equation based on input parameters
            let equationIndex = -1;
            if (formulaMap[param][inputParams] !== undefined) {
                equationIndex = formulaMap[param][inputParams];
            } else {
                // Try reversing the input parameters order
                const reversedParams = inputParams.split(',').reverse().join(',');
                if (formulaMap[param][reversedParams] !== undefined) {
                    equationIndex = formulaMap[param][reversedParams];
                }
            }

            if (equationIndex !== -1 && equations[equationIndex]) {
                console.log(`Highlighting equation ${equationIndex} for ${param}`);
                equations[equationIndex].classList.add('highlight');
            }
        });
    }

    // Initial state
    updateInputStates();
}); 