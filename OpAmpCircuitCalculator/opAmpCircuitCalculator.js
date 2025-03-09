document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const configSelect = document.getElementById('configuration');
    const rf = document.getElementById('rf');
    const r1 = document.getElementById('r1');
    const r2 = document.getElementById('r2');
    const rfUnit = document.getElementById('rfUnit');
    const r1Unit = document.getElementById('r1Unit');
    const r2Unit = document.getElementById('r2Unit');
    const inputVoltage = document.getElementById('inputVoltage');
    const inputVoltage2 = document.getElementById('inputVoltage2');
    const configImage = document.getElementById('configImage');
    const formulaImage = document.getElementById('formulaImage');
    const configHeading = document.getElementById('configHeading');
    const gain = document.getElementById('gain');
    const outputVoltage = document.getElementById('outputVoltage');
    const inputImpedance = document.getElementById('inputImpedance');
    const bandwidth = document.getElementById('bandwidth');
    const resetButton = document.getElementById('reset');

    // Constants
    const GBW = 1000000; // Gain-Bandwidth product (1 MHz typical for basic op-amps)

    // Function to update resistor visibility
    function updateResistorVisibility(config) {
        const resistorFields = document.querySelectorAll('.resistance-group');
        resistorFields.forEach(field => {
            const requiredFor = field.dataset.requiredFor.split(',');
            if (requiredFor.includes(config)) {
                field.classList.remove('hidden');
            } else {
                field.classList.add('hidden');
                // Clear the input when hiding
                const input = field.querySelector('input');
                if (input) input.value = '';
            }
        });

        // Handle voltage input width
        const voltageInputs = document.querySelectorAll('.voltage-input');
        voltageInputs.forEach(field => {
            const fullWidthFor = field.dataset.fullWidth?.split(',') || [];
            if (fullWidthFor.includes(config)) {
                field.style.gridColumn = '1 / -1';  // Span full width
            } else {
                field.style.gridColumn = '';  // Reset to default
            }
        });
    }

    // Function to clear all inputs and results
    function clearInputs() {
        rf.value = '';
        r1.value = '';
        r2.value = '';
        rfUnit.value = '1';
        r1Unit.value = '1';
        r2Unit.value = '1';
        inputVoltage.value = '';
        inputVoltage2.value = '';
        gain.querySelector('.value').textContent = '0';
        outputVoltage.querySelector('.value').textContent = '0 V';
        inputImpedance.querySelector('.value').textContent = '0 Ω';
        bandwidth.querySelector('.value').textContent = '0 Hz';
    }

    // Configuration change handler
    configSelect.addEventListener('change', function() {
        const config = this.value;
        
        // Clear all inputs when mode changes
        clearInputs();
        
        configHeading.textContent = 'Op-Amp - ' + config.charAt(0).toUpperCase() + config.slice(1) + ' Configuration';
        configImage.src = 'Images/' + config.charAt(0).toUpperCase() + config.slice(1) + '-Amplifier.svg';
        formulaImage.src = 'Images/' + config.charAt(0).toUpperCase() + config.slice(1) + '-Formula.svg';
        
        // Update resistor visibility
        updateResistorVisibility(config);
        
        // Hide second input voltage field and R2
        inputVoltage2.parentElement.style.display = 'none';
        r2.parentElement.classList.add('hidden');

        // Show/hide bandwidth based on configuration
        bandwidth.style.display = config === 'inverting' ? 'none' : 'block';
        inputImpedance.style.display = 'none';  // Always hide input impedance for basic modes
    });

    // Prevent negative numbers and trigger calculation on input
    function handleInput(e) {
        const value = e.target.value;
        if (value < 0) {
            e.target.value = '';
        }
        calculateResults();
    }

    // Add input validation and auto-calculation
    [rf, r1, r2, inputVoltage, inputVoltage2, rfUnit, r1Unit, r2Unit].forEach(input => {
        input.addEventListener('input', handleInput);
        input.addEventListener('change', handleInput);
    });

    // Calculate results based on configuration
    function calculateResults() {
        const rfValue = parseFloat(rf.value);
        const r1Value = parseFloat(r1.value);
        const v1 = parseFloat(inputVoltage.value);
        const rfMult = parseFloat(rfUnit.value);
        const r1Mult = parseFloat(r1Unit.value);

        if (isNaN(rfValue) || isNaN(r1Value) || rfValue <= 0 || r1Value <= 0) {
            return;
        }

        // Convert to base units (ohms)
        const Rf = rfValue * rfMult;
        const R1 = r1Value * r1Mult;

        let gainValue, vout, bw;

        switch(configSelect.value) {
            case 'inverting':
                gainValue = -Rf / R1;
                vout = gainValue * v1;
                break;

            case 'noninverting':
                gainValue = 1 + (Rf / R1);
                vout = gainValue * v1;
                break;
        }

        // Calculate bandwidth based on gain-bandwidth product
        bw = GBW / Math.abs(gainValue);

        // Format and display results
        displayResults(gainValue, vout, 0, bw);
    }

    function displayResults(gainValue, vout, zin, bw) {
        // Format gain (no unit)
        gain.querySelector('.value').textContent = gainValue.toFixed(3);

        // Format output voltage
        outputVoltage.querySelector('.value').textContent = vout.toFixed(3) + ' V';

        // Format bandwidth with appropriate unit (only if not in inverting mode)
        if (configSelect.value !== 'inverting') {
            let bwDisplay;
            if (bw >= 1000000) {
                bwDisplay = (bw / 1000000).toFixed(2) + ' MHz';
            } else if (bw >= 1000) {
                bwDisplay = (bw / 1000).toFixed(2) + ' kHz';
            } else {
                bwDisplay = bw.toFixed(1) + ' Hz';
            }
            bandwidth.querySelector('.value').textContent = bwDisplay;
        }
    }

    // Event listener for reset button
    resetButton.addEventListener('click', clearInputs);

    // Initialize the UI
    configSelect.dispatchEvent(new Event('change'));
}); 