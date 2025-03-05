document.addEventListener('DOMContentLoaded', () => {
    const modeSelect = document.getElementById('mode');
    const addcapacitorButton = document.getElementById('add-capacitor');
    const calculateButton = document.getElementById('calculate');
    const capacitorInputsDiv = document.getElementById('capacitor-inputs');
    const resultValue = document.getElementById('result-value');
    const configHeading = document.getElementById('configHeading');
    const headerImage = document.getElementById('headerImage');
    const calculationImage = document.getElementById('calculationImage');
    const unitSelect = document.getElementById('unit');
    let capacitorCount = 2; // Start with 2 capacitors

    // Add initial 2 capacitors on page load
    for (let i = 1; i <= capacitorCount; i++) {
        addcapacitorField(i);
    }

    modeSelect.addEventListener('change', () => {
        if (modeSelect.value === 'series') {
            configHeading.textContent = 'Series capacitor';
            headerImage.src = 'Images/capacitors-In-Series.svg';
            calculationImage.src = 'Images/Series-capacitor-Equation.svg';
        } else {
            configHeading.textContent = 'Parallel capacitor';
            headerImage.src = 'Images/capacitors-In-Parallel.svg';
            calculationImage.src = 'Images/Parallel-capacitor-Equation.svg';
        }

        updateIframeHeight();  // Call to update iframe height after mode change
    });

    addcapacitorButton.addEventListener('click', () => {
        if (capacitorCount < 10) {
            capacitorCount++;
            addcapacitorField(capacitorCount);
        } else {
            alert('You can only add up to 10 capacitors.');
        }
    });

    calculateButton.addEventListener('click', () => {
        const mode = modeSelect.value;
        const capacitorInputs = capacitorInputsDiv.querySelectorAll('input');
        let capacitors = [];

        let valid = true;
        capacitorInputs.forEach(input => {
            const value = parseFloat(input.value);
            if (isNaN(value) || value <= 0) {
                input.style.border = '2px solid red';
                valid = false;
            } else {
                input.style.border = '1px solid #ccc';
                capacitors.push(value);
            }
        });

        if (!valid) {
            resultValue.textContent = 'Please enter valid positive capacitor values.';
            return;
        }

        if (capacitors.length === 0) {
            resultValue.textContent = 'Please enter at least one capacitor value.';
            return;
        }

        let result;
        if (mode === 'series') {
            result = capacitors.reduce((acc, curr) => acc + curr, 0);
        } else if (mode === 'parallel') {
            result = 1 / capacitors.reduce((acc, curr) => acc + (1 / curr), 0);
        }

        // Unit conversion logic
        const selectedUnit = unitSelect.value;
        let convertedResult = result;
        let unitSymbol = 'F'; // Default unit is Ohm

        if (selectedUnit === 'kohm') {
            convertedResult = result / 1000;
            unitSymbol = 'kΩ';
        } else if (selectedUnit === 'mohm') {
            convertedResult = result / 1000000;
            unitSymbol = 'MΩ';
        }

        resultValue.textContent = `Total Resistance: ${convertedResult.toFixed(4)} ${unitSymbol}`;

        updateIframeHeight();  // Call to update iframe height after calculation
    });

    function addcapacitorField(capacitorNumber) {
        const capacitorDiv = document.createElement('div');
        capacitorDiv.classList.add('capacitor-input');
        
        const input = document.createElement('input');
        input.type = 'number';
        input.placeholder = `Capacitor ${capacitorNumber} (F)`;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'X';
        deleteButton.classList.add('delete-button');

        // Disable delete button for the first two capacitors
        if (capacitorNumber <= 2) {
            deleteButton.disabled = true;
            deleteButton.style.visibility = 'hidden'; // Hide the delete button for the first two
        } else {
            deleteButton.addEventListener('click', () => {
                capacitorInputsDiv.removeChild(capacitorDiv);
                capacitorCount--;
                updateIframeHeight();  // Call to update iframe height after removing capacitor
            });
        }

        capacitorDiv.appendChild(input);
        capacitorDiv.appendChild(deleteButton);
        capacitorInputsDiv.appendChild(capacitorDiv);

        updateIframeHeight();  // Call to update iframe height after adding a capacitor
    }

    function updateIframeHeight() {
        // Send the height of the iframe content to the parent page
        window.parent.postMessage({ height: document.body.scrollHeight }, 'https://kobee.com.au');
    }
});
