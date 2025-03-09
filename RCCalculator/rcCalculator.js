document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const modeSelect = document.getElementById('mode');
    const inputVoltage = document.getElementById('inputVoltage');
    const resistance = document.getElementById('resistance');
    const capacitance = document.getElementById('capacitance');
    const resistanceUnit = document.getElementById('resistanceUnit');
    const capacitanceUnit = document.getElementById('capacitanceUnit');
    const configImage = document.getElementById('configImage');
    const configHeading = document.getElementById('configHeading');
    const timeConstant = document.getElementById('timeConstant');
    const energy = document.getElementById('energy');
    const resetButton = document.getElementById('reset');
    const ctx = document.getElementById('rcGraph').getContext('2d');

    // Initialize Chart
    const rcChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['0', '1τ', '2τ', '3τ', '4τ', '5τ', '6τ'],
            datasets: [
                {
                    label: 'Voltage',
                    borderColor: '#2196F3',
                    data: [0, 0, 0, 0, 0, 0, 0],
                    tension: 0.4,
                    yAxisID: 'voltage'
                },
                {
                    label: 'Current',
                    borderColor: '#4CAF50',
                    data: [0, 0, 0, 0, 0, 0, 0],
                    tension: 0.4,
                    yAxisID: 'current'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            scales: {
                voltage: {
                    type: 'linear',
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Voltage (V)'
                    },
                    beginAtZero: true
                },
                current: {
                    type: 'linear',
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Current (mA)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    // Function to clear all inputs and results
    function clearInputs() {
        inputVoltage.value = '';
        resistance.value = '';
        capacitance.value = '';
        resistanceUnit.value = '1';
        capacitanceUnit.value = '1';
        timeConstant.querySelector('.value').textContent = '0 ms';
        energy.querySelector('.value').textContent = '0 µJ';
        updateChart([0,0,0,0,0,0,0], [0,0,0,0,0,0,0]);
    }

    function updateChart(voltages, currents) {
        // Find the maximum values for scaling
        const maxVoltage = Math.max(...voltages.map(Math.abs));
        const maxCurrent = Math.max(...currents.map(Math.abs));

        // Update the chart data
        rcChart.data.datasets[0].data = voltages;
        rcChart.data.datasets[1].data = currents;

        // Update axis scales
        rcChart.options.scales.voltage.max = Math.ceil(maxVoltage * 1.2); // Add 20% margin
        rcChart.options.scales.voltage.min = 0;
        rcChart.options.scales.voltage.ticks = {
            stepSize: Math.ceil(maxVoltage * 1.2 / 5) // Create about 5 steps
        };

        // For current, we need to handle both positive and negative values based on mode
        const currentLimit = Math.ceil(maxCurrent * 1.2); // Add 20% margin
        const mode = document.getElementById('mode').value;
        
        if (mode === 'charging') {
            rcChart.options.scales.current.max = currentLimit;
            rcChart.options.scales.current.min = 0;
            rcChart.options.scales.current.ticks = {
                stepSize: Math.ceil(currentLimit / 5) // Create about 5 steps
            };
        } else { // discharging
            rcChart.options.scales.current.max = 0;
            rcChart.options.scales.current.min = -currentLimit;
            rcChart.options.scales.current.ticks = {
                stepSize: Math.ceil(currentLimit / 5) // Create about 5 steps
            };
        }

        rcChart.update();
    }

    // Mode change handler
    modeSelect.addEventListener('change', function() {
        if (this.value === 'charging') {
            configHeading.textContent = 'RC Circuit - Charging';
            configImage.src = 'Images/RC-Charging.svg';
        } else {
            configHeading.textContent = 'RC Circuit - Discharging';
            configImage.src = 'Images/RC-Discharging.svg';
        }
        clearInputs();
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
    [inputVoltage, resistance, capacitance, resistanceUnit, capacitanceUnit].forEach(input => {
        input.addEventListener('input', handleInput);
        input.addEventListener('change', handleInput);
    });

    // Calculate results based on mode
    function calculateResults() {
        const v0 = parseFloat(inputVoltage.value);
        const rBase = parseFloat(resistance.value);
        const cBase = parseFloat(capacitance.value);
        const rUnit = parseFloat(resistanceUnit.value);
        const cUnit = parseFloat(capacitanceUnit.value);
        
        if (isNaN(v0) || isNaN(rBase) || isNaN(cBase) || v0 < 0 || rBase <= 0 || cBase <= 0) {
            if (!isNaN(v0) || !isNaN(rBase) || !isNaN(cBase)) {
                updateChart([0,0,0,0,0,0,0], [0,0,0,0,0,0,0]);
            }
            return;
        }

        // Convert values to base units (ohms and microfarads)
        const r = rBase * rUnit;
        const c = cBase * cUnit;

        // Calculate time constant (τ = RC) in milliseconds
        // R in ohms, C in µF gives τ in microseconds, so multiply by 0.001 for milliseconds
        const tau = r * c * 0.001;
        
        // Format time constant based on value
        let timeConstantDisplay;
        if (tau >= 1000) {
            timeConstantDisplay = (tau / 1000).toFixed(3) + ' s';
        } else {
            timeConstantDisplay = tau.toFixed(3) + ' ms';
        }
        timeConstant.querySelector('.value').textContent = timeConstantDisplay;

        // Calculate energy (E = 1/2 * C * V^2) in Joules
        // Convert capacitance from µF to F first (multiply by 1e-6)
        const e = 0.5 * (c * 1e-6) * v0 * v0;
        
        // Format energy based on value
        let energyDisplay;
        if (e < 0.001) { // Less than 1 mJ
            energyDisplay = (e * 1000).toPrecision(6) + ' mJ';
        } else {
            energyDisplay = Number(e.toPrecision(6)).toString() + ' J';
        }
        energy.querySelector('.value').textContent = energyDisplay;

        if (modeSelect.value === 'charging') {
            calculateCharging(v0, r, c);
        } else {
            calculateDischarging(v0, r, c);
        }
    }

    function calculateCharging(v0, r, c) {
        const timePoints = [0, 1, 2, 3, 4, 5, 6];
        // Calculate time constant τ = RC (in seconds for the exponential)
        const tau = r * c * 1e-6; // Convert to seconds (µF to F)
        
        const voltages = timePoints.map(t => {
            const time = t * tau;
            return v0 * (1 - Math.exp(-time/tau));
        });
        
        const currents = timePoints.map(t => {
            const time = t * tau;
            return (v0/r) * Math.exp(-time/tau) * 1000; // Convert to mA
        });
        
        updateChart(voltages, currents);
    }

    function calculateDischarging(v0, r, c) {
        const timePoints = [0, 1, 2, 3, 4, 5, 6];
        // Calculate time constant τ = RC (in seconds for the exponential)
        const tau = r * c * 1e-6; // Convert to seconds (µF to F)
        
        const voltages = timePoints.map(t => {
            const time = t * tau;
            return v0 * Math.exp(-time/tau);
        });
        
        const currents = timePoints.map(t => {
            const time = t * tau;
            return -(v0/r) * Math.exp(-time/tau) * 1000; // Convert to mA and make negative
        });
        
        updateChart(voltages, currents);
    }

    // Event listener for reset button
    resetButton.addEventListener('click', clearInputs);

    // Initialize the UI
    modeSelect.dispatchEvent(new Event('change'));
}); 