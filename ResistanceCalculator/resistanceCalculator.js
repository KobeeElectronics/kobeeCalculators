document.addEventListener('DOMContentLoaded', () => {
    const modeSelect = document.getElementById('mode');
    const addResistorButton = document.getElementById('add-resistor');
    const removeResistorButton = document.getElementById('remove-resistor');
    const resistorInputsDiv = document.getElementById('resistor-inputs');
    const resultValue = document.getElementById('result-value');
    const headerImage = document.getElementById('headerImage');
    const calculationImage = document.getElementById('calculationImage');
    const networkTitle = document.getElementById('network-title');
    const unitSelect = document.getElementById('unit');
    let resistorCount = 2; // Start with 2 resistors

    // Add initial 2 resistors on page load
    for (let i = 1; i <= resistorCount; i++) {
        addResistorField(i);
    }

    // Update placeholders and recalculate when unit changes
    unitSelect.addEventListener('change', () => {
        updateResistorPlaceholders();
        calculateResult();
    });

    function updateResistorPlaceholders() {
        const unit = unitSelect.value;
        const unitSymbol = unit === 'ohm' ? 'Ω' : unit === 'kohm' ? 'kΩ' : 'MΩ';
        const inputs = resistorInputsDiv.querySelectorAll('input');
        inputs.forEach((input, index) => {
            input.placeholder = `Resistor ${index + 1} (${unitSymbol})`;
        });
    }

    modeSelect.addEventListener('change', () => {
        if (modeSelect.value === 'series') {
            networkTitle.textContent = 'Series Network';
            headerImage.src = 'Images/Resistors-In-Series.svg';
            calculationImage.src = 'Images/Series-Resistor-Equation.svg';
        } else {
            networkTitle.textContent = 'Parallel Network';
            headerImage.src = 'Images/Resistors-In-Parallel.svg';
            calculationImage.src = 'Images/Parallel-Resistor-Equation.svg';
        }
        calculateResult();
    });

    addResistorButton.addEventListener('click', () => {
        if (resistorCount < 10) {
            resistorCount++;
            addResistorField(resistorCount);
            calculateResult();
        } else {
            alert('You can only add up to 10 resistors.');
        }
    });

    removeResistorButton.addEventListener('click', () => {
        if (resistorCount > 2) {
            const resistorInputs = resistorInputsDiv.querySelectorAll('.resistor-input');
            const lastResistor = resistorInputs[resistorInputs.length - 1];
            resistorInputsDiv.removeChild(lastResistor);
            resistorCount--;
            calculateResult();
        }
    });

    function calculateResult() {
        const mode = modeSelect.value;
        const resistorInputs = resistorInputsDiv.querySelectorAll('input');
        let resistors = [];
        let hasEmptyInputs = false;

        let valid = true;
        resistorInputs.forEach(input => {
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
                    // Convert input values to ohms for calculation
                    const inputUnit = unitSelect.value;
                    let valueInOhms = numValue;
                    if (inputUnit === 'kohm') {
                        valueInOhms = numValue * 1000;
                    } else if (inputUnit === 'Mohm') {
                        valueInOhms = numValue * 1000000;
                    }
                    resistors.push(valueInOhms);
                }
            }
        });

        // Clear the result if there are any empty inputs
        if (hasEmptyInputs) {
            resultValue.textContent = 'Please enter resistor values';
            return;
        }

        if (!valid) {
            resultValue.textContent = 'Please enter valid positive resistor values.';
            return;
        }

        let result;
        if (mode === 'series') {
            result = resistors.reduce((acc, curr) => acc + curr, 0);
        } else if (mode === 'parallel') {
            result = 1 / resistors.reduce((acc, curr) => acc + (1 / curr), 0);
        }

        // Update result display
        updateResult(result);
    }

    function addResistorField(resistorNumber) {
        const resistorDiv = document.createElement('div');
        resistorDiv.classList.add('resistor-input');
        
        const input = document.createElement('input');
        input.type = 'number';
        input.min = '0';
        input.step = 'any';
        const unit = unitSelect.value;
        const unitSymbol = unit === 'ohm' ? 'Ω' : unit === 'kohm' ? 'kΩ' : 'MΩ';
        input.placeholder = `Resistor ${resistorNumber} (${unitSymbol})`;

        // Add input event listener for automatic calculation
        input.addEventListener('input', calculateResult);

        resistorDiv.appendChild(input);
        resistorInputsDiv.appendChild(resistorDiv);
    }

    // Update result display
    function updateResult(result) {
        if (result === null || isNaN(result)) {
            resultValue.textContent = '';
            return;
        }
        
        const unit = document.getElementById('unit').value;
        let displayValue, displayUnit;
        
        if (unit === 'Mohm' && result < 1000000) {
            displayValue = result / 1000;
            displayUnit = 'kΩ';
        } else if (unit === 'Mohm') {
            displayValue = result / 1000000;
            displayUnit = 'MΩ';
        } else if (unit === 'kohm' && result < 1000000) {
            displayValue = result / 1000;
            displayUnit = 'kΩ';
        } else if (unit === 'kohm') {
            displayValue = result / 1000000;
            displayUnit = 'MΩ';
        } else if (unit === 'ohm' && result >= 1000000) {
            displayValue = result / 1000000;
            displayUnit = 'MΩ';
        } else if (unit === 'ohm' && result >= 1000) {
            displayValue = result / 1000;
            displayUnit = 'kΩ';
        } else {
            displayValue = result;
            displayUnit = 'Ω';
        }
        
        resultValue.textContent = `${Number(displayValue.toFixed(3))} ${displayUnit}`;
    }

    // Initialize the images and title
    if (modeSelect.value === 'series') {
        networkTitle.textContent = 'Series Network';
        headerImage.src = 'Images/Resistors-In-Series.svg';
        calculationImage.src = 'Images/Series-Resistor-Equation.svg';
    } else {
        networkTitle.textContent = 'Parallel Network';
        headerImage.src = 'Images/Resistors-In-Parallel.svg';
        calculationImage.src = 'Images/Parallel-Resistor-Equation.svg';
    }
});