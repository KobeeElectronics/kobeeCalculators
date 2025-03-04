document.addEventListener('DOMContentLoaded', () => {
    const modeSelect = document.getElementById('mode');
    const addResistorButton = document.getElementById('add-resistor');
    const calculateButton = document.getElementById('calculate');
    const resistorInputsDiv = document.getElementById('resistor-inputs');
    const resultValue = document.getElementById('result-value');
    const configHeading = document.getElementById('configHeading');
    const headerImage = document.getElementById('headerImage');
    const calculationImage = document.getElementById('calculationImage');
    const unitSelect = document.getElementById('unit'); // Add this line to reference the unit selector
    let resistorCount = 2; // Start with 2 resistors

    // Add initial 2 resistors on page load
    for (let i = 1; i <= resistorCount; i++) {
        addResistorField(i);
    }

    modeSelect.addEventListener('change', () => {
        if (modeSelect.value === 'series') {
            configHeading.textContent = 'Series Resistor';
            headerImage.src = 'Images/Resistors-In-Series.svg';
            calculationImage.src = 'Images/Series-Resistor-Equation.svg';
        } else {
            configHeading.textContent = 'Parallel Resistor';
            headerImage.src = 'Images/Resistors-In-Parallel.svg';
            calculationImage.src = 'Images/Parallel-Resistor-Equation.svg';
        }
    });

    addResistorButton.addEventListener('click', () => {
        if (resistorCount < 10) {
            resistorCount++;
            addResistorField(resistorCount);
        } else {
            alert('You can only add up to 10 resistors.');
        }
    });

    calculateButton.addEventListener('click', () => {
        const mode = modeSelect.value;
        const resistorInputs = resistorInputsDiv.querySelectorAll('input');
        let resistors = [];

        let valid = true;
        resistorInputs.forEach(input => {
            const value = parseFloat(input.value);
            if (isNaN(value) || value <= 0) {
                input.style.border = '2px solid red';
                valid = false;
            } else {
                input.style.border = '1px solid #ccc';
                resistors.push(value);
            }
        });

        if (!valid) {
            resultValue.textContent = 'Please enter valid positive resistor values.';
            return;
        }

        if (resistors.length === 0) {
            resultValue.textContent = 'Please enter at least one resistor value.';
            return;
        }

        let result;
        if (mode === 'series') {
            result = resistors.reduce((acc, curr) => acc + curr, 0);
        } else if (mode === 'parallel') {
            result = 1 / resistors.reduce((acc, curr) => acc + (1 / curr), 0);
        }

        // Unit conversion logic
        const selectedUnit = unitSelect.value;
        let convertedResult = result;
        let unitSymbol = 'Ω'; // Default unit is Ohm

        if (selectedUnit === 'kohm') {
            convertedResult = result / 1000;
            unitSymbol = 'kΩ';
        } else if (selectedUnit === 'mohm') {
            convertedResult = result / 1000000;
            unitSymbol = 'MΩ';
        }

        resultValue.textContent = `Total Resistance: ${convertedResult.toFixed(4)} ${unitSymbol}`;
    });

    function addResistorField(resistorNumber) {
        const resistorDiv = document.createElement('div');
        resistorDiv.classList.add('resistor-input');
        
        const input = document.createElement('input');
        input.type = 'number';
        input.placeholder = `Resistor ${resistorNumber} (Ω)`;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'X';
        deleteButton.classList.add('delete-button');

        // Disable delete button for the first two resistors
        if (resistorNumber <= 2) {
            deleteButton.disabled = true;
            deleteButton.style.visibility = 'hidden'; // Hide the delete button for the first two
        } else {
            deleteButton.addEventListener('click', () => {
                resistorInputsDiv.removeChild(resistorDiv);
                resistorCount--;
            });
        }

        resistorDiv.appendChild(input);
        resistorDiv.appendChild(deleteButton);
        resistorInputsDiv.appendChild(resistorDiv);
    }
});
