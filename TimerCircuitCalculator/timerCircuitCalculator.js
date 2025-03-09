document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const modeSelect = document.getElementById('mode');
    const ra = document.getElementById('ra');
    const rb = document.getElementById('rb');
    const capacitance = document.getElementById('capacitance');
    const raUnit = document.getElementById('raUnit');
    const rbUnit = document.getElementById('rbUnit');
    const capacitanceUnit = document.getElementById('capacitanceUnit');
    const configHeading = document.getElementById('configHeading');
    const configImage = document.getElementById('configImage');
    const formulaImage = document.getElementById('formulaImage');
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
        // Clear all inputs first
        clearInputs();
        
        const container = document.querySelector('.container');
        const mode = this.value;
        
        if (mode === 'astable') {
            configHeading.textContent = '555 Timer - Astable Mode';
            configImage.src = 'Images/555-Astable.svg';
            formulaImage.src = 'Images/555-Astable-Equation.svg';
            rb.disabled = false;
            rb.parentElement.parentElement.style.display = 'block';
            // Show all result cards in astable mode
            frequency.style.display = 'block';
            dutyCycle.style.display = 'block';
            period.style.display = 'block';
            pulseWidth.style.display = 'block';
            pulseWidth.querySelector('.label').textContent = 'High Time / Low Time';
            container.classList.remove('monostable-mode');
        } else {
            configHeading.textContent = '555 Timer - Monostable Mode';
            configImage.src = 'Images/555-Monostable.svg';
            formulaImage.src = 'Images/555-Monostable-Equation.svg';
            rb.value = '';
            rb.disabled = true;
            rb.parentElement.parentElement.style.display = 'none';
            // Only show pulse width in monostable mode
            frequency.style.display = 'none';
            dutyCycle.style.display = 'none';
            period.style.display = 'none';
            pulseWidth.style.display = 'block';
            pulseWidth.querySelector('.label').textContent = 'Pulse Width';
            container.classList.add('monostable-mode');
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
            const C = cValue * cMultiplier * 1e-6;

            // Calculate timing parameters
            const t1 = 0.693 * (R1 + R2) * C;  // High time
            const t2 = 0.693 * R2 * C;         // Low time
            const T = t1 + t2;                 // Total period
            const f = 1 / T;                   // Frequency
            const duty = (t1 / T) * 100;       // Duty cycle

            // Format and display results
            displayResults(f, T, duty, t1, t2);
        } else {
            if (isNaN(raValue) || isNaN(cValue) || raValue <= 0 || cValue <= 0) {
                return;
            }

            // Convert to base units (ohms and farads)
            const R = raValue * raMultiplier;
            const C = cValue * cMultiplier * 1e-6;

            // Calculate timing parameters
            const t = 1.1 * R * C;  // Pulse width
            const f = 1 / t;        // Frequency (single shot)

            // Format and display results for monostable
            displayResults(f, t, 100, t, null);
        }
    }

    function displayResults(freq, totalPeriod, dutyRatio, highTime, lowTime) {
        // Format time periods with proper scaling
        function formatTime(seconds) {
            if (seconds >= 1) {
                return seconds.toFixed(1) + ' s';
            } else if (seconds >= 0.001) {
                return (seconds * 1000).toFixed(1) + ' ms';
            } else if (seconds >= 0.000001) {
                return (seconds * 1000000).toFixed(1) + ' µs';
            } else if (seconds >= 0.000000001) {
                return (seconds * 1000000000).toFixed(1) + ' ns';
            } else {
                return (seconds * 1000000000000).toFixed(1) + ' ps';
            }
        }

        if (modeSelect.value === 'astable') {
            // Format and display frequency
            let freqDisplay;
            if (freq < 0.001) { // Less than 1 mHz
                freqDisplay = (freq * 1000).toFixed(3) + ' µHz';
            } else if (freq < 1) { // Less than 1 Hz
                freqDisplay = (freq * 1000).toFixed(3) + ' mHz';
            } else if (freq < 1000) { // Less than 1 kHz
                freqDisplay = freq.toFixed(3) + ' Hz';
            } else if (freq < 1000000) { // Less than 1 MHz
                freqDisplay = (freq / 1000).toFixed(3) + ' kHz';
            } else { // 1 MHz or greater
                freqDisplay = (freq / 1000000).toFixed(3) + ' MHz';
            }
            
            frequency.querySelector('.value').textContent = freqDisplay;
            period.querySelector('.value').textContent = formatTime(totalPeriod);
            dutyCycle.querySelector('.value').textContent = dutyRatio.toFixed(1) + '%';
            pulseWidth.querySelector('.value').textContent = formatTime(highTime) + ' / ' + formatTime(lowTime);
        } else {
            pulseWidth.querySelector('.value').textContent = formatTime(highTime);
        }
    }

    // Event listener for reset button
    resetButton.addEventListener('click', clearInputs);

    // Initialize the UI
    modeSelect.dispatchEvent(new Event('change'));
}); 