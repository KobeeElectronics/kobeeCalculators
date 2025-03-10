document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const modeSelect = document.getElementById('mode');
    const inputVoltage = document.getElementById('inputVoltage');
    const r1Input = document.getElementById('r1');
    const r2Input = document.getElementById('r2');
    const rloadInput = document.getElementById('rload');
    const r1Unit = document.getElementById('r1Unit');
    const r2Unit = document.getElementById('r2Unit');
    const rloadUnit = document.getElementById('rloadUnit');
    const rloadField = document.getElementById('rloadField');
    const configImage = document.getElementById('configImage');
    const formulaImage = document.getElementById('formulaImage');
    const configHeading = document.getElementById('configHeading');
    const outputVoltage = document.getElementById('outputVoltage');
    const currentFlow = document.getElementById('currentFlow');
    const powerDissipation = document.getElementById('powerDissipation');
    const powerPercentage = document.getElementById('powerPercentage');
    const resetButton = document.getElementById('reset');

    // Function to update input styling
    function updateInputStyle(input) {
        if (input.value.trim() !== '') {
            input.classList.add('has-value');
        } else {
            input.classList.remove('has-value');
        }
    }

    // Function to clear all inputs and results
    function clearInputs() {
        inputVoltage.value = '';
        r1Input.value = '';
        r2Input.value = '';
        rloadInput.value = '';
        r1Unit.value = '1';
        r2Unit.value = '1';
        rloadUnit.value = '1';
        
        // Remove has-value class from all inputs
        [inputVoltage, r1Input, r2Input, rloadInput].forEach(input => {
            input.classList.remove('has-value');
        });

        outputVoltage.querySelector('.value').textContent = '0 V';
        currentFlow.querySelector('.value').textContent = '0 mA';
        powerDissipation.querySelector('.value').textContent = '0 mW';
        powerPercentage.querySelector('.value').textContent = '0%';
    }

    // Mode change handler
    modeSelect.addEventListener('change', function() {
        if (this.value === 'noload') {
            configHeading.textContent = 'Voltage Divider (No Load)';
            configImage.src = 'Images/No-Load-Voltage-Divider.svg';
            formulaImage.src = 'Images/No-Load-Voltage-Divider-Equation.svg';
            rloadField.style.display = 'none';
            // Update labels for no load mode
            outputVoltage.querySelector('.label').textContent = 'Voltage Across R2';
            currentFlow.querySelector('.label').textContent = 'Current Through R2';
            powerDissipation.querySelector('.label').textContent = 'Power in R2';
            powerPercentage.querySelector('.label').textContent = 'R2 Power %';
        } else {
            configHeading.textContent = 'Voltage Divider (With Load)';
            configImage.src = 'Images/Load-Voltage-Divider.svg';
            formulaImage.src = 'Images/Load-Voltage-Divider-Equation.svg';
            rloadField.style.display = 'block';
            // Update labels for load mode
            outputVoltage.querySelector('.label').textContent = 'Voltage Across Load';
            currentFlow.querySelector('.label').textContent = 'Current Through Load';
            powerDissipation.querySelector('.label').textContent = 'Power in Load';
            powerPercentage.querySelector('.label').textContent = 'Load Power %';
        }
        clearInputs();
        calculateResults(); // Recalculate when mode changes
    });

    // Prevent negative numbers and trigger calculation on input
    function handleInput(e) {
        if (e.target.value < 0) {
            e.target.value = '';
        }
        updateInputStyle(e.target);
        calculateResults();
    }

    // Add input validation and auto-calculation
    inputVoltage.addEventListener('input', handleInput);
    r1Input.addEventListener('input', handleInput);
    r2Input.addEventListener('input', handleInput);
    rloadInput.addEventListener('input', handleInput);

    // Format number to 3 decimal places
    function formatNumber(num) {
        return Number(num.toFixed(3));
    }

    // Convert resistance value based on unit
    function getResistanceInOhms(value, unit) {
        return parseFloat(value) * parseFloat(unit);
    }

    // Calculate results based on mode
    function calculateResults() {
        const vin = parseFloat(inputVoltage.value);
        const r1 = getResistanceInOhms(r1Input.value, r1Unit.value);
        const r2 = getResistanceInOhms(r2Input.value, r2Unit.value);
        
        if (isNaN(vin) || isNaN(r1) || isNaN(r2) || vin < 0 || r1 <= 0 || r2 <= 0) {
            return; // Silently return if inputs are invalid
        }

        if (modeSelect.value === 'noload') {
            calculateNoLoad(vin, r1, r2);
        } else {
            const rload = getResistanceInOhms(rloadInput.value, rloadUnit.value);
            if (isNaN(rload) || rload <= 0) {
                return; // Silently return if load resistance is invalid
            }
            calculateWithLoad(vin, r1, r2, rload);
        }
    }

    function calculateNoLoad(vin, r1, r2) {
        // Calculate voltage divider without load
        const vout = (r2 / (r1 + r2)) * vin;
        const current = (vin / (r1 + r2)) * 1000; // Convert to mA
        const p1 = (current * current * r1) / 1000; // Convert to mW
        const p2 = (current * current * r2) / 1000; // Convert to mW
        const totalPower = p1 + p2;
        const p2Percentage = (p2 / totalPower) * 100;

        outputVoltage.querySelector('.value').textContent = vout.toFixed(3) + ' V';
        currentFlow.querySelector('.value').textContent = current.toFixed(3) + ' mA';
        powerDissipation.querySelector('.value').textContent = p2.toFixed(3) + ' mW';
        powerPercentage.querySelector('.value').textContent = p2Percentage.toFixed(1) + '%';
    }

    function calculateWithLoad(vin, r1, r2, rload) {
        // Calculate parallel resistance of R2 and Rload
        const r2Parallel = (r2 * rload) / (r2 + rload);
        const totalR = r1 + r2Parallel;
        
        // Calculate voltage and current
        const vout = (r2Parallel / totalR) * vin;
        const totalCurrent = (vin / totalR); // Keep in A for power calc
        const r2Current = vout / r2; // Keep in A for power calc
        const loadCurrent = vout / rload; // Keep in A for power calc
        
        // Calculate power
        const p1 = totalCurrent * totalCurrent * r1 * 1000; // Convert to mW
        const p2 = r2Current * r2Current * r2 * 1000; // Convert to mW
        const pLoad = loadCurrent * loadCurrent * rload * 1000; // Convert to mW
        const totalPower = p1 + p2 + pLoad;
        const loadPercentage = (pLoad / totalPower) * 100;

        // Debug calculations
        console.log('--- Voltage Divider Calculations ---');
        console.log('R2||RL:', r2Parallel.toFixed(2) + 'Ω');
        console.log('Total R:', totalR.toFixed(2) + 'Ω');
        console.log('Vout:', vout.toFixed(3) + 'V');
        console.log('Total Current:', (totalCurrent * 1000).toFixed(3) + 'mA');
        console.log('R2 Current:', (r2Current * 1000).toFixed(3) + 'mA');
        console.log('Load Current:', (loadCurrent * 1000).toFixed(3) + 'mA');
        console.log('P1:', p1.toFixed(3) + 'mW');
        console.log('P2:', p2.toFixed(3) + 'mW');
        console.log('PLoad:', pLoad.toFixed(3) + 'mW');
        console.log('Total Power:', totalPower.toFixed(3) + 'mW');
        console.log('Load Power %:', loadPercentage.toFixed(1) + '%');

        outputVoltage.querySelector('.value').textContent = vout.toFixed(3) + ' V';
        currentFlow.querySelector('.value').textContent = (loadCurrent * 1000).toFixed(3) + ' mA';
        powerDissipation.querySelector('.value').textContent = pLoad.toFixed(3) + ' mW';
        powerPercentage.querySelector('.value').textContent = loadPercentage.toFixed(1) + '%';
    }

    // Event listener for reset button
    resetButton.addEventListener('click', clearInputs);

    // Handle unit changes
    function handleUnitChange(e) {
        // Update the associated input's styling
        let input;
        switch(e.target.id) {
            case 'r1Unit':
                input = r1Input;
                break;
            case 'r2Unit':
                input = r2Input;
                break;
            case 'rloadUnit':
                input = rloadInput;
                break;
        }
        if (input && input.value.trim() !== '') {
            input.classList.add('has-value');
        }
        calculateResults();
    }

    // Add event listeners for unit changes
    r1Unit.addEventListener('change', handleUnitChange);
    r2Unit.addEventListener('change', handleUnitChange);
    rloadUnit.addEventListener('change', handleUnitChange);

    // Initialize the UI
    modeSelect.dispatchEvent(new Event('change'));
}); 