document.addEventListener('DOMContentLoaded', () => {
    const modeSelect = document.getElementById('mode');
    const addCapacitorButton = document.getElementById('add-capacitor');
    const removeCapacitorButton = document.getElementById('remove-capacitor');
    const capacitorInputsDiv = document.getElementById('capacitor-inputs');
    const resultValue = document.getElementById('result-value');
    const configHeading = document.getElementById('configHeading');
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
            configHeading.textContent = 'Series Capacitor';
            headerImage.src = 'Images/Capacitors-In-Series.svg';
            calculationImage.src = 'Images/Series-Capacitor-Equation.svg';
        } else {
            configHeading.textContent = 'Parallel Capacitor';
            headerImage.src = 'Images/Capacitors-In-Parallel.svg';
            calculationImage.src = 'Images/Parallel-Capacitor-Equation.svg';
        }
        calculateResult();
        updateIframeHeight();
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
            updateIframeHeight();
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
                input.style.border = '1px solid #ccc';
                hasEmptyInputs = true;
            } else {
                const numValue = parseFloat(value);
                if (isNaN(numValue) || numValue === 0) {
                    input.style.border = '2px solid red';
                    valid = false;
                } else {
                    input.style.border = '1px solid #ccc';
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

        // Convert result to appropriate unit
        const selectedUnit = unitSelect.value;
        let convertedResult = result;
        let unitSymbol = getUnitSymbol(selectedUnit);

        switch(selectedUnit) {
            case 'pf': convertedResult = result * 1e12; break;
            case 'nf': convertedResult = result * 1e9; break;
            case 'uf': convertedResult = result * 1e6; break;
            case 'mf': convertedResult = result * 1e3; break;
        }

        resultValue.textContent = `Total Capacitance: ${convertedResult.toFixed(4)} ${unitSymbol}`;
        updateIframeHeight();
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

        updateIframeHeight();
    }

    function updateIframeHeight() {
        // Get the maximum height between scroll height and offset height
        const height = Math.max(
            document.body.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight
        );
        
        // Send the height to any parent window
        window.parent.postMessage({ type: 'resize', height: height }, '*');
    }
}); 