document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const configSelect = document.getElementById('configuration');
    const supplyVoltage = document.getElementById('supplyVoltage');
    const ledCount = document.getElementById('ledCount');
    const forwardVoltage = document.getElementById('forwardVoltage');
    const forwardCurrent = document.getElementById('forwardCurrent');
    const configImage = document.getElementById('configImage');
    const formulaImage = document.getElementById('formulaImage');
    const configHeading = document.getElementById('configHeading');
    const resistorValue = document.getElementById('resistorValue');
    const powerDissipation = document.getElementById('powerDissipation');
    const totalCurrent = document.getElementById('totalCurrent');
    const efficiency = document.getElementById('efficiency');
    const resetButton = document.getElementById('reset');

    // Function to clear all inputs and results
    function clearInputs() {
        supplyVoltage.value = '';
        ledCount.value = '1';
        forwardVoltage.value = '';
        forwardCurrent.value = '';
        resistorValue.querySelector('.value').textContent = '0 Ω';
        powerDissipation.querySelector('.value').textContent = '0 mW';
        totalCurrent.querySelector('.value').textContent = '0 mA';
        efficiency.querySelector('.value').textContent = '0%';
    }

    // Configuration change handler
    configSelect.addEventListener('change', function() {
        const config = this.value;
        if (config === 'single') {
            configHeading.textContent = 'Single LED Circuit';
            configImage.src = 'Images/Single-LED-Circuit.svg';
            formulaImage.src = 'Images/Single-LED-Formula.svg';
            ledCount.value = '1';
            ledCount.disabled = true;
        } else if (config === 'series') {
            configHeading.textContent = 'LEDs in Series';
            configImage.src = 'Images/Series-LED-Circuit.svg';
            formulaImage.src = 'Images/Series-LED-Formula.svg';
            ledCount.disabled = false;
        } else {
            configHeading.textContent = 'LEDs in Parallel';
            configImage.src = 'Images/Parallel-LED-Circuit.svg';
            formulaImage.src = 'Images/Parallel-LED-Formula.svg';
            ledCount.disabled = false;
        }
        calculateResults();
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
    [supplyVoltage, ledCount, forwardVoltage, forwardCurrent].forEach(input => {
        input.addEventListener('input', handleInput);
        input.addEventListener('change', handleInput);
    });

    // Calculate results based on configuration
    function calculateResults() {
        const vs = parseFloat(supplyVoltage.value);
        const n = parseInt(ledCount.value) || 1;
        const vf = parseFloat(forwardVoltage.value);
        const if_ma = parseFloat(forwardCurrent.value);
        
        if (isNaN(vs) || isNaN(vf) || isNaN(if_ma) || vs < 0 || vf < 0 || if_ma <= 0) {
            return;
        }

        const if_a = if_ma / 1000; // Convert mA to A
        let r, p_r, i_total, eff;

        switch(configSelect.value) {
            case 'single':
            case 'series':
                // Total LED voltage drop
                const v_leds = vf * n;
                if (v_leds >= vs) {
                    displayError('Supply voltage must be greater than total LED voltage drop');
                    return;
                }
                
                // Calculate resistor value
                r = (vs - v_leds) / if_a;
                
                // Calculate power dissipation in resistor
                p_r = (vs - v_leds) * if_a;
                
                // Total current is the same as forward current
                i_total = if_ma;
                
                // Calculate efficiency (LED power / total power)
                const p_leds = v_leds * if_a;
                eff = (p_leds / (p_leds + p_r)) * 100;
                break;

            case 'parallel':
                if (vf >= vs) {
                    displayError('Supply voltage must be greater than LED forward voltage');
                    return;
                }
                
                // Calculate resistor value (one resistor per LED)
                r = (vs - vf) / if_a;
                
                // Calculate power dissipation in all resistors
                p_r = (vs - vf) * if_a * n;
                
                // Total current is n times the forward current
                i_total = if_ma * n;
                
                // Calculate efficiency (LED power / total power)
                const p_leds_parallel = vf * if_a * n;
                eff = (p_leds_parallel / (p_leds_parallel + p_r)) * 100;
                break;
        }

        // Format and display results
        displayResults(r, p_r, i_total, eff);
    }

    function displayResults(resistance, power, current, efficiency) {
        // Format resistance with appropriate unit
        let resistanceDisplay;
        if (resistance >= 1000000) {
            resistanceDisplay = (resistance / 1000000).toFixed(2) + ' MΩ';
        } else if (resistance >= 1000) {
            resistanceDisplay = (resistance / 1000).toFixed(2) + ' kΩ';
        } else {
            resistanceDisplay = resistance.toFixed(1) + ' Ω';
        }

        // Format power with appropriate unit
        let powerDisplay;
        if (power >= 1) {
            powerDisplay = power.toFixed(2) + ' W';
        } else {
            powerDisplay = (power * 1000).toFixed(1) + ' mW';
        }

        resistorValue.querySelector('.value').textContent = resistanceDisplay;
        powerDissipation.querySelector('.value').textContent = powerDisplay;
        totalCurrent.querySelector('.value').textContent = current.toFixed(1) + ' mA';
        efficiency.querySelector('.value').textContent = efficiency.toFixed(1) + '%';
    }

    function displayError(message) {
        resistorValue.querySelector('.value').textContent = 'Error';
        powerDissipation.querySelector('.value').textContent = 'Error';
        totalCurrent.querySelector('.value').textContent = 'Error';
        efficiency.querySelector('.value').textContent = 'Error';
        console.error(message);
    }

    // Event listener for reset button
    resetButton.addEventListener('click', clearInputs);

    // Initialize the UI
    configSelect.dispatchEvent(new Event('change'));
}); 