document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const modeSelect = document.getElementById('mode');
    const ra = document.getElementById('ra');
    const rb = document.getElementById('rb');
    const capacitance = document.getElementById('capacitance');
    const raUnit = document.getElementById('raUnit');
    const rbUnit = document.getElementById('rbUnit');
    const capacitanceUnit = document.getElementById('capacitanceUnit');
    const configImage = document.getElementById('configImage');
    const formulaImage = document.getElementById('formulaImage');
    const configHeading = document.getElementById('configHeading');
    const frequency = document.getElementById('frequency');
    const period = document.getElementById('period');
    const dutyCycle = document.getElementById('dutyCycle');
    const pulseWidth = document.getElementById('pulseWidth');
    const resetButton = document.getElementById('reset');

    // Function to clear all inputs and results
    function clearInputs() {
        ra.value = '';
        rb.value = '';
        capacitance.value = '';
        raUnit.value = '1';
        rbUnit.value = '1';
        capacitanceUnit.value = '1';
        frequency.querySelector('.value').textContent = '0 Hz';
        period.querySelector('.value').textContent = '0 ms';
        dutyCycle.querySelector('.value').textContent = '0%';
        pulseWidth.querySelector('.value').textContent = '0 ms';
    }

    // Mode change handler
    modeSelect.addEventListener('change', function() {
        if (this.value === 'astable') {
            configHeading.textContent = '555 Timer - Astable Mode';
            configImage.src = 'Images/Astable-Circuit.svg';
            formulaImage.src = 'Images/Astable-Formula.svg';
            rb.disabled = false;
            rb.parentElement.style.opacity = '1';
        } else {
            configHeading.textContent = '555 Timer - Monostable Mode';
            configImage.src = 'Images/Monostable-Circuit.svg';
            formulaImage.src = 'Images/Monostable-Formula.svg';
            rb.value = '';
            rb.disabled = true;
            rb.parentElement.style.opacity = '0.5';
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
    [ra, rb, capacitance, raUnit, rbUnit, capacitanceUnit].forEach(input => {
        input.addEventListener('input', handleInput);
        input.addEventListener('change', handleInput);
    });

    // Calculate results based on mode
    function calculateResults() {
        const raValue = parseFloat(ra.value);
        const rbValue = parseFloat(rb.value);
        const cValue = parseFloat(capacitance.value);
        const raMultiplier = parseFloat(raUnit.value);
        const rbMultiplier = parseFloat(rbUnit.value);
        const cMultiplier = parseFloat(capacitanceUnit.value);
        
        if (modeSelect.value === 'astable') {
            if (isNaN(raValue) || isNaN(rbValue) || isNaN(cValue) || 
                raValue <= 0 || rbValue <= 0 || cValue <= 0) {
                return;
            }

            // Convert to base units (ohms and farads)
            const R1 = raValue * raMultiplier;
            const R2 = rbValue * rbMultiplier;
            const C = cValue * cMultiplier;

            // Calculate timing parameters
            const t1 = 0.693 * (R1 + R2) * C;  // High time
            const t2 = 0.693 * R2 * C;         // Low time
            const T = t1 + t2;                 // Total period
            const f = 1 / T;                   // Frequency
            const duty = (t1 / T) * 100;       // Duty cycle

            // Format and display results
            displayResults(f, T, duty, t1);
        } else {
            if (isNaN(raValue) || isNaN(cValue) || raValue <= 0 || cValue <= 0) {
                return;
            }

            // Convert to base units (ohms and farads)
            const R = raValue * raMultiplier;
            const C = cValue * cMultiplier;

            // Calculate timing parameters
            const t = 1.1 * R * C;  // Pulse width
            const f = 1 / t;        // Frequency (single shot)

            // Format and display results
            displayResults(f, t, 100, t);
        }
    }

    function displayResults(freq, totalPeriod, dutyRatio, highTime) {
        // Format frequency
        let freqDisplay;
        if (freq >= 1000000) {
            freqDisplay = (freq / 1000000).toFixed(3) + ' MHz';
        } else if (freq >= 1000) {
            freqDisplay = (freq / 1000).toFixed(3) + ' kHz';
        } else {
            freqDisplay = freq.toFixed(3) + ' Hz';
        }

        // Format time periods
        function formatTime(seconds) {
            if (seconds >= 1) {
                return seconds.toFixed(3) + ' s';
            } else if (seconds >= 0.001) {
                return (seconds * 1000).toFixed(3) + ' ms';
            } else if (seconds >= 0.000001) {
                return (seconds * 1000000).toFixed(3) + ' µs';
            } else {
                return (seconds * 1000000000).toFixed(3) + ' ns';
            }
        }

        frequency.querySelector('.value').textContent = freqDisplay;
        period.querySelector('.value').textContent = formatTime(totalPeriod);
        dutyCycle.querySelector('.value').textContent = dutyRatio.toFixed(1) + '%';
        pulseWidth.querySelector('.value').textContent = formatTime(highTime);
    }

    // Event listener for reset button
    resetButton.addEventListener('click', clearInputs);

    // Initialize the UI
    modeSelect.dispatchEvent(new Event('change'));
}); 