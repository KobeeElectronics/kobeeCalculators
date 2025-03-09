document.addEventListener('DOMContentLoaded', () => {
    const modeSelect = document.getElementById('mode');
    const addCapacitorButton = document.getElementById('add-capacitor');
    const removeCapacitorButton = document.getElementById('remove-capacitor');
    const capacitorInputsDiv = document.getElementById('capacitor-inputs');
    const resultValue = document.getElementById('result-value');
    const networkTitle = document.getElementById('network-title');
    const headerImage = document.getElementById('headerImage');
    const calculationImage = document.getElementById('calculationImage');
    const unitSelect = document.getElementById('unit');
    let capacitorCount = 2; // Start with 2 capacitors

    // Add initial 2 capacitors on page load
    for (let i = 1; i <= capacitorCount; i++) {
        addCapacitorField(i);
    }

    // Update placeholders and recalculate when unit changes
    unitSelect.addEventListener('change', () => {
        updateCapacitorPlaceholders();
        calculateResult();
    });

    function updateCapacitorPlaceholders() {
        const unit = unitSelect.value;
        const unitSymbol = getUnitSymbol(unit);
        const inputs = capacitorInputsDiv.querySelectorAll('input');
        inputs.forEach((input, index) => {
            input.placeholder = `Capacitor ${index + 1} (${unitSymbol})`;
        });
    }

    function getUnitSymbol(unit) {
        switch(unit) {
            case 'f': return 'F';
            case 'mf': return 'mF';
            case 'uf': return 'µF';
            case 'nf': return 'nF';
            case 'pf': return 'pF';
            default: return 'F';
        }
    }

    modeSelect.addEventListener('change', () => {
        if (modeSelect.value === 'series') {
            networkTitle.textContent = 'Series Network';
            headerImage.src = 'Images/Capacitors-In-Series.svg';
            calculationImage.src = 'Images/Series-Capacitor-Equation.svg';
        } else {
            networkTitle.textContent = 'Parallel Network';
            headerImage.src = 'Images/Capacitors-In-Parallel.svg';
            calculationImage.src = 'Images/Parallel-Capacitor-Equation.svg';
        }
        calculateResult();
    });

    addCapacitorButton.addEventListener('click', () => {
        if (capacitorCount < 10) {
            capacitorCount++;
            addCapacitorField(capacitorCount);
            calculateResult();
        } else {
            alert('You can only add up to 10 capacitors.');
        }
    });

    removeCapacitorButton.addEventListener('click', () => {
        if (capacitorCount > 2) {
            const capacitorInputs = capacitorInputsDiv.querySelectorAll('.capacitor-input');
            const lastCapacitor = capacitorInputs[capacitorInputs.length - 1];
            capacitorInputsDiv.removeChild(lastCapacitor);
            capacitorCount--;
            calculateResult();
        }
    });

    function calculateResult() {
        const mode = modeSelect.value;
        const capacitorInputs = capacitorInputsDiv.querySelectorAll('input');
        let capacitors = [];
        let hasEmptyInputs = false;

        let valid = true;
        capacitorInputs.forEach(input => {
            const value = input.value.trim();
            // Check if input is empty
            if (value === '') {
                input.style.borderColor = '#ddd';
                hasEmptyInputs = true;
            } else {
                const numValue = parseFloat(value);
                if (isNaN(numValue) || numValue <= 0) {
                    input.style.borderColor = '#f44336';
                    valid = false;
                } else {
                    input.style.borderColor = '#FED700';
                    // Convert input values to farads for calculation
                    const inputUnit = unitSelect.value;
                    let valueInFarads = numValue;
                    switch(inputUnit) {
                        case 'pf': valueInFarads = numValue * 1e-12; break;
                        case 'nf': valueInFarads = numValue * 1e-9; break;
                        case 'uf': valueInFarads = numValue * 1e-6; break;
                        case 'mf': valueInFarads = numValue * 1e-3; break;
                    }
                    capacitors.push(valueInFarads);
                }
            }
        });

        // Clear the result if there are any empty inputs
        if (hasEmptyInputs) {
            resultValue.textContent = 'Please enter capacitor values';
            return;
        }

        if (!valid) {
            resultValue.textContent = 'Please enter valid positive capacitor values.';
            return;
        }

        let result;
        if (mode === 'series') {
            // For series capacitors, 1/Ct = 1/C1 + 1/C2 + ... + 1/Cn
            result = 1 / capacitors.reduce((acc, curr) => acc + (1 / curr), 0);
        } else if (mode === 'parallel') {
            // For parallel capacitors, Ct = C1 + C2 + ... + Cn
            result = capacitors.reduce((acc, curr) => acc + curr, 0);
        }

        // Update result display
        updateResult(result);
    }

    function addCapacitorField(capacitorNumber) {
        const capacitorDiv = document.createElement('div');
        capacitorDiv.classList.add('capacitor-input');
        
        const input = document.createElement('input');
        input.type = 'number';
        input.min = '0';
        input.step = 'any';
        const unit = unitSelect.value;
        const unitSymbol = getUnitSymbol(unit);
        input.placeholder = `Capacitor ${capacitorNumber} (${unitSymbol})`;

        // Add input event listener for automatic calculation
        input.addEventListener('input', calculateResult);

        capacitorDiv.appendChild(input);
        capacitorInputsDiv.appendChild(capacitorDiv);
    }

    // Update result display
    function updateResult(result) {
        if (result === null || isNaN(result)) {
            resultValue.textContent = '';
            return;
        }
        
        const unit = document.getElementById('unit').value;
        let displayValue, displayUnit;
        
        // Convert to appropriate unit for display
        if (unit === 'pf') {
            displayValue = result * 1e12;  // Convert from F to pF
            displayUnit = 'pF';
            if (displayValue >= 1000) {
                displayValue /= 1000;
                displayUnit = 'nF';
            }
            if (displayValue >= 1000) {
                displayValue /= 1000;
                displayUnit = 'µF';
            }
            if (displayValue >= 1000) {
                displayValue /= 1000;
                displayUnit = 'mF';
            }
            if (displayValue >= 1000) {
                displayValue /= 1000;
                displayUnit = 'F';
            }
        } else if (unit === 'nf') {
            displayValue = result * 1e9;  // Convert from F to nF
            displayUnit = 'nF';
            if (displayValue >= 1000) {
                displayValue /= 1000;
                displayUnit = 'µF';
            }
            if (displayValue >= 1000) {
                displayValue /= 1000;
                displayUnit = 'mF';
            }
            if (displayValue >= 1000) {
                displayValue /= 1000;
                displayUnit = 'F';
            }
        } else if (unit === 'uf') {
            displayValue = result * 1e6;  // Convert from F to µF
            displayUnit = 'µF';
            if (displayValue >= 1000) {
                displayValue /= 1000;
                displayUnit = 'mF';
            }
            if (displayValue >= 1000) {
                displayValue /= 1000;
                displayUnit = 'F';
            }
        } else if (unit === 'mf') {
            displayValue = result * 1e3;  // Convert from F to mF
            displayUnit = 'mF';
            if (displayValue >= 1000) {
                displayValue /= 1000;
                displayUnit = 'F';
            }
        } else {
            displayValue = result;
            displayUnit = 'F';
        }
        
        resultValue.textContent = `${Number(displayValue.toFixed(3))} ${displayUnit}`;
    }

    // Initialize the images and title
    if (modeSelect.value === 'series') {
        networkTitle.textContent = 'Series Network';
        headerImage.src = 'Images/Capacitors-In-Series.svg';
        calculationImage.src = 'Images/Series-Capacitor-Equation.svg';
    } else {
        networkTitle.textContent = 'Parallel Network';
        headerImage.src = 'Images/Capacitors-In-Parallel.svg';
        calculationImage.src = 'Images/Parallel-Capacitor-Equation.svg';
    }
}); 