document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const modeSelect = document.getElementById('mode');
    const resistanceUnitSelect = document.getElementById('resistanceUnit');
    const inputVoltage = document.getElementById('inputVoltage');
    const r1Input = document.getElementById('r1');
    const r2Input = document.getElementById('r2');
    const loadResistanceGroup = document.getElementById('loadResistanceGroup');
    const loadResistance = document.getElementById('loadResistance');
    const calculateButton = document.getElementById('calculate');
    const resetButton = document.getElementById('reset');
    const outputVoltage = document.getElementById('outputVoltage');
    const currentFlow = document.getElementById('currentFlow');
    const powerDissipation = document.getElementById('powerDissipation');
    const headerImage = document.getElementById('headerImage');
    const calculationImage = document.getElementById('calculationImage');
    const configHeading = document.getElementById('configHeading');

    // Mode change handler
    modeSelect.addEventListener('change', function() {
        if (this.value === 'noLoad') {
            loadResistanceGroup.style.display = 'none';
            headerImage.src = 'Images/voltage-divider-no-load.svg';
            calculationImage.src = 'Images/voltage-divider-equation.svg';
            configHeading.textContent = 'Voltage Divider (No Load)';
        } else {
            loadResistanceGroup.style.display = 'block';
            headerImage.src = 'Images/voltage-divider-load.svg';
            calculationImage.src = 'Images/voltage-divider-load-equation.svg';
            configHeading.textContent = 'Voltage Divider (Across Load)';
        }
        resetResults();
    });

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
        const current = vin / (r1 + r2);
        const p1 = Math.pow(current, 2) * r1;
        const p2 = Math.pow(current, 2) * r2;
        return {
            voltage: vout,
            current: current,
            power: p1 + p2
        };
    }

    // Calculate voltage divider with load
    function calculateWithLoad(vin, r1, r2, rl) {
        const r2rl = (r2 * rl) / (r2 + rl);
        const rtotal = r1 + r2rl;
        const vout = (r2rl / rtotal) * vin;
        const current = vin / rtotal;
        const loadCurrent = vout / rl;
        const p1 = Math.pow(current, 2) * r1;
        const p2 = Math.pow(loadCurrent, 2) * r2;
        const pl = Math.pow(loadCurrent, 2) * rl;
        return {
            voltage: vout,
            current: current,
            power: p1 + p2 + pl
        };
    }

    // Format number to 3 decimal places
    function formatNumber(num) {
        return Number(num.toFixed(3));
    }

    // Calculate button handler
    calculateButton.addEventListener('click', function() {
        // Get and validate inputs
        const vin = parseFloat(inputVoltage.value);
        const r1 = convertResistance(parseFloat(r1Input.value), resistanceUnitSelect.value);
        const r2 = convertResistance(parseFloat(r2Input.value), resistanceUnitSelect.value);
        
        if (isNaN(vin) || isNaN(r1) || isNaN(r2) || vin <= 0 || r1 <= 0 || r2 <= 0) {
            alert('Please enter valid positive numbers for voltage and resistances');
            return;
        }

        let result;
        if (modeSelect.value === 'noLoad') {
            result = calculateNoLoad(vin, r1, r2);
        } else {
            const rl = convertResistance(parseFloat(loadResistance.value), resistanceUnitSelect.value);
            if (isNaN(rl) || rl <= 0) {
                alert('Please enter a valid positive number for load resistance');
                return;
            }
            result = calculateWithLoad(vin, r1, r2, rl);
        }

        // Display results
        outputVoltage.textContent = `Output Voltage: ${formatNumber(result.voltage)} V`;
        currentFlow.textContent = `Current: ${formatNumber(result.current * 1000)} mA`;
        powerDissipation.textContent = `Power Dissipation: ${formatNumber(result.power)} W`;
    });

    // Reset button handler
    resetButton.addEventListener('click', function() {
        inputVoltage.value = '';
        r1Input.value = '';
        r2Input.value = '';
        loadResistance.value = '';
        resetResults();
    });

    // Reset results
    function resetResults() {
        outputVoltage.textContent = '';
        currentFlow.textContent = '';
        powerDissipation.textContent = '';
    }

    // Initialize the calculator
    modeSelect.dispatchEvent(new Event('change'));
}); 