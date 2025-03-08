document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const modeSelect = document.getElementById('mode');
    const resistanceUnitSelect = document.getElementById('resistanceUnit');
    const inputVoltage = document.getElementById('inputVoltage');
    const r1Input = document.getElementById('r1');
    const r2Input = document.getElementById('r2');
    const loadResistanceGroup = document.getElementById('loadResistanceGroup');
    const loadResistance = document.getElementById('loadResistance');
    const outputVoltage = document.getElementById('outputVoltage');
    const currentFlow = document.getElementById('currentFlow');
    const powerDissipation = document.getElementById('powerDissipation');
    const powerPercentage = document.getElementById('powerPercentage');
    const headerImage = document.getElementById('headerImage');
    const calculationImage = document.getElementById('calculationImage');
    const configHeading = document.getElementById('configHeading');

    // Function to clear all inputs
    function clearInputs() {
        inputVoltage.value = '';
        r1Input.value = '';
        r2Input.value = '';
        loadResistance.value = '';
        outputVoltage.querySelector('.value').textContent = '';
        currentFlow.querySelector('.value').textContent = '';
        powerDissipation.querySelector('.value').textContent = '';
        powerPercentage.querySelector('.value').textContent = '';
    }

    // Mode change handler
    modeSelect.addEventListener('change', function() {
        if (this.value === 'noLoad') {
            loadResistanceGroup.style.display = 'none';
            headerImage.src = 'images/No-Load-Voltage-Divider.svg';
            calculationImage.src = 'images/No-Load-Voltage-Divider-Equation.svg';
            configHeading.textContent = 'Voltage Divider (No Load)';
            outputVoltage.querySelector('.label').textContent = 'Output Voltage (across R2)';
            currentFlow.querySelector('.label').textContent = 'Current (through R2)';
            powerDissipation.querySelector('.label').textContent = 'Power Dissipation (in R2)';
            powerPercentage.style.display = 'none';
        } else {
            loadResistanceGroup.style.display = 'block';
            headerImage.src = 'images/Load-Voltage-Divider.svg';
            calculationImage.src = 'images/Load-Voltage-Divider-Equation.svg';
            configHeading.textContent = 'Voltage Divider (Across Load)';
            outputVoltage.querySelector('.label').textContent = 'Output Voltage (across Load)';
            currentFlow.querySelector('.label').textContent = 'Current (through Load)';
            powerDissipation.querySelector('.label').textContent = 'Power Dissipation (in Load)';
            powerPercentage.querySelector('.label').textContent = 'Load Power Percentage';
            powerPercentage.style.display = 'block';
        }
        clearInputs();
    });

    // Prevent negative numbers on input
    function preventNegative(e) {
        if (e.target.value < 0) {
            e.target.value = '';
        }
    }

    // Add input validation for negative numbers
    inputVoltage.addEventListener('input', preventNegative);
    r1Input.addEventListener('input', preventNegative);
    r2Input.addEventListener('input', preventNegative);
    loadResistance.addEventListener('input', preventNegative);

    // Convert resistance based on unit
    function convertResistance(value, unit) {
        switch(unit) {
            case 'kohm':
                return value * 1000;
            case 'mohm':
                return value * 1000000;
            default:
                return value;
        }
    }

    // Calculate voltage divider without load
    function calculateNoLoad(vin, r1, r2) {
        const vout = (r2 / (r1 + r2)) * vin;
        const current = vout / r2;  // Current through R2
        const power = Math.pow(current, 2) * r2;  // Power in R2 only
        return {
            voltage: vout,
            current: current,
            power: power
        };
    }

    // Calculate voltage divider with load
    function calculateWithLoad(vin, r1, r2, rl) {
        const r2rl = (r2 * rl) / (r2 + rl);
        const rtotal = r1 + r2rl;
        const vout = (r2rl / rtotal) * vin;
        const loadCurrent = vout / rl;  // Current through load resistor
        const loadPower = Math.pow(loadCurrent, 2) * rl;  // Power in load resistor
        
        // Calculate total power and percentage
        const totalCurrent = vin / rtotal;
        const p1 = Math.pow(totalCurrent, 2) * r1;  // Power in R1
        const r2Current = vout / r2;  // Current through R2
        const p2 = Math.pow(r2Current, 2) * r2;  // Power in R2
        const totalPower = p1 + p2 + loadPower;
        const powerPercent = (loadPower / totalPower) * 100;

        return {
            voltage: vout,
            current: loadCurrent,
            power: loadPower,
            powerPercent: powerPercent
        };
    }

    // Format number to 3 decimal places
    function formatNumber(num) {
        return Number(num.toFixed(3));
    }

    // Calculate and display results
    function calculateResults() {
        // Get input values
        const vin = parseFloat(inputVoltage.value);
        const r1 = convertResistance(parseFloat(r1Input.value), resistanceUnitSelect.value);
        const r2 = convertResistance(parseFloat(r2Input.value), resistanceUnitSelect.value);
        
        // Clear results if inputs are invalid
        if (isNaN(vin) || isNaN(r1) || isNaN(r2) || vin <= 0 || r1 <= 0 || r2 <= 0) {
            outputVoltage.querySelector('.value').textContent = '';
            currentFlow.querySelector('.value').textContent = '';
            powerDissipation.querySelector('.value').textContent = '';
            powerPercentage.querySelector('.value').textContent = '';
            return;
        }

        let result;
        if (modeSelect.value === 'noLoad') {
            result = calculateNoLoad(vin, r1, r2);
            outputVoltage.querySelector('.label').textContent = 'Output Voltage (across R2)';
            currentFlow.querySelector('.label').textContent = 'Current (through R2)';
            powerDissipation.querySelector('.label').textContent = 'Power Dissipation (in R2)';
            outputVoltage.querySelector('.value').textContent = `${formatNumber(result.voltage)} V`;
            currentFlow.querySelector('.value').textContent = `${formatNumber(result.current * 1000)} mA`;
            powerDissipation.querySelector('.value').textContent = `${formatNumber(result.power)} W`;
            powerPercentage.style.display = 'none';
        } else {
            const rl = convertResistance(parseFloat(loadResistance.value), resistanceUnitSelect.value);
            if (isNaN(rl) || rl <= 0) {
                outputVoltage.querySelector('.value').textContent = '';
                currentFlow.querySelector('.value').textContent = '';
                powerDissipation.querySelector('.value').textContent = '';
                powerPercentage.querySelector('.value').textContent = '';
                return;
            }
            result = calculateWithLoad(vin, r1, r2, rl);
            outputVoltage.querySelector('.label').textContent = 'Output Voltage (across Load)';
            currentFlow.querySelector('.label').textContent = 'Current (through Load)';
            powerDissipation.querySelector('.label').textContent = 'Power Dissipation (in Load)';
            powerPercentage.querySelector('.label').textContent = 'Load Power Percentage';
            outputVoltage.querySelector('.value').textContent = `${formatNumber(result.voltage)} V`;
            currentFlow.querySelector('.value').textContent = `${formatNumber(result.current * 1000)} mA`;
            powerDissipation.querySelector('.value').textContent = `${formatNumber(result.power)} W`;
            powerPercentage.querySelector('.value').textContent = `${formatNumber(result.powerPercent)}%`;
            powerPercentage.style.display = 'block';
        }
    }

    // Add input event listeners
    inputVoltage.addEventListener('input', calculateResults);
    r1Input.addEventListener('input', calculateResults);
    r2Input.addEventListener('input', calculateResults);
    loadResistance.addEventListener('input', calculateResults);
    resistanceUnitSelect.addEventListener('change', calculateResults);

    // Initialize calculator
    modeSelect.dispatchEvent(new Event('change'));
}); 