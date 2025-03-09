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
    const canvas = document.getElementById('waveformCanvas');
    const ctx = canvas.getContext('2d');
    const highTimeDisplay = document.getElementById('highTimeDisplay');
    const lowTimeDisplay = document.getElementById('lowTimeDisplay');

    // Function to draw timing diagram
    function drawTimingDiagram(isAstable, highTime, lowTime, totalPeriod) {
        const width = canvas.width;
        const height = canvas.height;
        const padding = 40;
        const graphHeight = height - 2 * padding;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw axes
        ctx.beginPath();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.stroke();
        
        // Add axes labels
        ctx.fillStyle = '#555';
        ctx.font = '12px Arial';
        ctx.textAlign = 'right';
        ctx.fillText('V', padding - 5, padding - 5);
        ctx.textAlign = 'left';
        ctx.fillText('t', width - padding + 5, height - padding + 15);
        
        // Draw waveform
        ctx.beginPath();
        ctx.strokeStyle = '#FED700';
        ctx.lineWidth = 2;
        
        let x = padding;
        let y = height - padding;
        ctx.moveTo(x, y);
        
        if (isAstable && highTime && lowTime) {
            // Draw repeating waveform for astable mode
            const cycleWidth = (width - 2 * padding) / 2; // Show 2 cycles
            const timeScale = cycleWidth / totalPeriod;
            
            // First cycle
            ctx.lineTo(x, y);
            ctx.lineTo(x, y - graphHeight);
            x += highTime * timeScale;
            ctx.lineTo(x, y - graphHeight);
            ctx.lineTo(x, y);
            x += lowTime * timeScale;
            ctx.lineTo(x, y);
            
            // Second cycle
            ctx.lineTo(x, y - graphHeight);
            x += highTime * timeScale;
            ctx.lineTo(x, y - graphHeight);
            ctx.lineTo(x, y);
            x += lowTime * timeScale;
            ctx.lineTo(x, y);
            
            ctx.stroke();
            
        } else if (!isAstable && highTime) {
            // Draw single pulse for monostable mode
            const timeScale = (width - 2 * padding) / (highTime * 2);
            
            // Initial delay
            x += 20;
            ctx.lineTo(x, y);
            ctx.lineTo(x, y - graphHeight);
            x += highTime * timeScale;
            ctx.lineTo(x, y - graphHeight);
            ctx.lineTo(x, y);
            ctx.lineTo(width - padding, y);
            
            ctx.stroke();
        }
    }

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
        highTimeDisplay.querySelector('.value').textContent = '0 ms (H)';
        lowTimeDisplay.querySelector('.value').textContent = '0 ms (L)';
        // Clear canvas
        drawTimingDiagram(modeSelect.value === 'astable', 0, 0, 0);
    }

    // Mode change handler
    modeSelect.addEventListener('change', function() {
        // Clear all inputs first
        clearInputs();
        
        const container = document.querySelector('.container');
        
        if (this.value === 'astable') {
            configHeading.textContent = '555 Timer - Astable Mode';
            rb.disabled = false;
            rb.parentElement.parentElement.style.display = 'block';
            highTimeDisplay.style.display = 'block';
            lowTimeDisplay.style.display = 'block';
            // Show all result cards in astable mode
            frequency.style.display = 'block';
            dutyCycle.style.display = 'block';
            period.style.display = 'block';
            pulseWidth.style.display = 'block';
            container.classList.remove('monostable-mode');
        } else {
            configHeading.textContent = '555 Timer - Monostable Mode';
            rb.value = '';
            rb.disabled = true;
            rb.parentElement.parentElement.style.display = 'none';
            highTimeDisplay.style.display = 'block';
            lowTimeDisplay.style.display = 'none';
            // Only show pulse width in monostable mode
            frequency.style.display = 'none';
            dutyCycle.style.display = 'none';
            period.style.display = 'none';
            pulseWidth.style.display = 'block';
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

            // Format and display results for monostable (passing null for lowTime)
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
            // Format and display frequency only in astable mode
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
            pulseWidth.querySelector('.label').textContent = 'High/Low Times';
            pulseWidth.querySelector('.value').textContent = 
                formatTime(highTime) + ' / ' + formatTime(lowTime);
        } else {
            // Only show pulse width in monostable mode
            pulseWidth.querySelector('.label').textContent = 'Pulse Width';
            pulseWidth.querySelector('.value').textContent = formatTime(highTime);
        }
        
        // Update timing displays
        highTimeDisplay.querySelector('.value').textContent = formatTime(highTime) + ' (H)';
        if (lowTime === null) {
            // Monostable mode
            lowTimeDisplay.style.display = 'none';
        } else {
            // Astable mode
            lowTimeDisplay.querySelector('.value').textContent = formatTime(lowTime) + ' (L)';
            lowTimeDisplay.style.display = 'block';
        }

        // Update timing diagram
        drawTimingDiagram(modeSelect.value === 'astable', highTime, lowTime, totalPeriod);
    }

    // Event listener for reset button
    resetButton.addEventListener('click', clearInputs);

    // Initialize the UI
    modeSelect.dispatchEvent(new Event('change'));
}); 