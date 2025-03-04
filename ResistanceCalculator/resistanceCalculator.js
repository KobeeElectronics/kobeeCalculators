// script.js
document.addEventListener('DOMContentLoaded', () => {
    const modeSelect = document.getElementById('mode');
    const addResistorButton = document.getElementById('add-resistor');
    const calculateButton = document.getElementById('calculate');
    const resistorInputsDiv = document.getElementById('resistor-inputs');
    const resultValue = document.getElementById('result-value');
    const configHeading = document.getElementById('configHeading');
    const headerImage = document.getElementById('headerImage');
    const calculationImage = document.getElementById('calculationImage');
    let resistorCount = 0;

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
            const resistorDiv = document.createElement('div');
            resistorDiv.classList.add('resistor-input');
            
            const input = document.createElement('input');
            input.type = 'number';
            input.placeholder = `Resistor ${resistorCount} (Ω)`;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'X';
            deleteButton.classList.add('delete-button');
            deleteButton.addEventListener('click', () => {
                resistorInputsDiv.removeChild(resistorDiv);
                resistorCount--;
            });

            resistorDiv.appendChild(input);
            resistorDiv.appendChild(deleteButton);
            resistorInputsDiv.appendChild(resistorDiv);
        } else {
            alert('You can only add up to 10 resistors.');
        }
    });

    calculateButton.addEventListener('click', () => {
        const mode = modeSelect.value;
        const resistorInputs = resistorInputsDiv.querySelectorAll('input');
        let resistors = [];

        resistorInputs.forEach(input => {
            if (input.value) {
                resistors.push(parseFloat(input.value));
            }
        });

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

        resultValue.textContent = `Total Resistance: ${result.toFixed(2)} Ω`;
    });
});
