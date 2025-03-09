document.addEventListener('DOMContentLoaded', () => {
    const voltageInput = document.getElementById('voltage');
    const currentInput = document.getElementById('current');
    const resistanceInput = document.getElementById('resistance');
    const powerInput = document.getElementById('power');
    const calculateButton = document.getElementById('calculate');
    const resetButton = document.getElementById('reset');
    const formulaGroups = document.querySelectorAll('.formula-group');

    const inputs = [voltageInput, currentInput, resistanceInput, powerInput];
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

    // Reset button click handler
    resetButton.addEventListener('click', () => {
        inputs.forEach(input => {
            input.value = '';
            input.disabled = false;
            input.style.borderColor = '#ddd';
        });
        filledInputs.clear();
        updateInputStates();
        clearFormulaHighlights();
    });

    // Calculate button click handler
    calculateButton.addEventListener('click', () => {
        if (filledInputs.size !== 2) return;

        const values = {};
        inputs.forEach(input => {
            if (input.value !== '') {
                values[input.id] = parseFloat(input.value);
            }
        });

        const results = calculateMissingValues(values);
        updateResults(results);
        highlightRelevantFormulas(values);
    });

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
        inputs.forEach(input => {
            if (results[input.id]) {
                input.value = results[input.id].toFixed(3);
                input.style.borderColor = '#FED700';
            }
        });
    }

    function clearFormulaHighlights() {
        formulaGroups.forEach(group => {
            group.classList.remove('highlight');
        });
    }

    function highlightRelevantFormulas(values) {
        clearFormulaHighlights();
        const filledParams = Object.keys(values);
        
        formulaGroups.forEach(group => {
            const type = group.classList[1]; // voltage, current, resistance, or power
            if (!values[type]) {
                group.classList.add('highlight');
            }
        });
    }

    // Initial state
    updateInputStates();
}); 