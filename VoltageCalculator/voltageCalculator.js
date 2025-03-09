// Get DOM elements
const vpInput = document.getElementById('vp');
const vppInput = document.getElementById('vpp');
const vrmsInput = document.getElementById('vrms');
const vavgInput = document.getElementById('vavg');
const frequencyInput = document.getElementById('frequency');
const resetButton = document.getElementById('reset');

// Constants
const SQRT2 = Math.sqrt(2);
const PI = Math.PI;

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Chart initialization
const ctx = document.getElementById('waveformChart').getContext('2d');
let waveformChart = new Chart(ctx, {
    type: 'line',
    data: {
        datasets: [
            {
                label: 'Sine Wave',
                borderColor: '#2196F3',
                borderWidth: 1.5,
                fill: false,
                pointRadius: 0,
                tension: 0.4,
                data: []
            },
            {
                label: 'Vp',
                borderColor: '#FED700',
                borderWidth: 1,
                borderDash: [5, 5],
                fill: false,
                pointRadius: 0,
                data: []
            },
            {
                label: 'Vrms',
                borderColor: '#4CAF50',
                borderWidth: 1,
                borderDash: [5, 5],
                fill: false,
                pointRadius: 0,
                data: []
            },
            {
                label: 'Vavg',
                borderColor: '#F44336',
                borderWidth: 1,
                borderDash: [5, 5],
                fill: false,
                pointRadius: 0,
                data: []
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 0 // Disable animations for better performance
        },
        elements: {
            point: {
                radius: 0 // Remove all points globally
            },
            line: {
                tension: 0 // Make lines straight between points
            }
        },
        scales: {
            x: {
                type: 'linear',
                title: {
                    display: true,
                    text: 'Time (ms)'
                }
            },
            y: {
                type: 'linear',
                title: {
                    display: true,
                    text: 'Voltage (V)'
                }
            }
        }
    }
});

// Voltage calculations
function calculateFromVp(vp) {
    return {
        vp: vp,
        vpp: vp * 2,
        vrms: vp / SQRT2,
        vavg: (2 * vp) / PI
    };
}

function calculateFromVpp(vpp) {
    const vp = vpp / 2;
    return calculateFromVp(vp);
}

function calculateFromVrms(vrms) {
    const vp = vrms * SQRT2;
    return calculateFromVp(vp);
}

function calculateFromVavg(vavg) {
    const vp = (vavg * PI) / 2;
    return calculateFromVp(vp);
}

// Update waveform visualization
function updateWaveform(values) {
    const frequency = parseFloat(frequencyInput.value) || 50;
    const period = 1000 / frequency; // Period in milliseconds
    const points = 100; // Reduced number of points for better performance
    const timeStep = period / points;
    
    // Generate sine wave data
    const sineData = [];
    const vpLine = [];
    const vrmsLine = [];
    const vavgLine = [];
    
    for (let i = 0; i <= points; i++) {
        const time = i * timeStep;
        const voltage = values.vp * Math.sin(2 * PI * frequency * time / 1000);
        
        sineData.push({ x: time, y: voltage });
        vpLine.push({ x: time, y: values.vp });
        vrmsLine.push({ x: time, y: values.vrms });
        vavgLine.push({ x: time, y: values.vavg });
    }
    
    waveformChart.data.datasets[0].data = sineData;
    waveformChart.data.datasets[1].data = vpLine;
    waveformChart.data.datasets[2].data = vrmsLine;
    waveformChart.data.datasets[3].data = vavgLine;
    waveformChart.update('none'); // Use 'none' mode for faster updates
}

// Update formula highlighting
function updateFormulaHighlighting(sourceId) {
    // Remove all active classes
    document.querySelectorAll('.formula-card').forEach(card => card.classList.remove('active'));
    document.querySelectorAll('.equations p').forEach(eq => eq.classList.remove('active'));
    
    // Add active class to relevant card and equations based on source
    const cardId = sourceId + '-card';
    const card = document.getElementById(cardId);
    
    if (card) {
        card.classList.add('active');
        // Highlight specific equations based on the source
        if (sourceId === 'vp') {
            // When Vp is the source, highlight all equations that use Vp
            document.querySelectorAll('.formula-card .equations p').forEach(eq => {
                if (eq.textContent.includes('Vp =') || 
                    eq.textContent.includes('Vp-p = 2 × Vp') ||
                    eq.textContent.includes('Vrms = Vp ÷') ||
                    eq.textContent.includes('Vavg = 2 × Vp')) {
                    eq.classList.add('active');
                }
            });
        } else {
            // For other sources, highlight their specific equations
            card.querySelectorAll('.equations p').forEach(eq => eq.classList.add('active'));
        }
    }
}

// Event listeners with longer debounce and separate update functions
const debouncedUpdate = debounce((source, value) => {
    let values;
    
    if (value === '' || isNaN(value)) {
        resetFields();
        return;
    }
    
    // Calculate values based on source
    switch (source) {
        case 'vp':
            values = calculateFromVp(parseFloat(value));
            break;
        case 'vpp':
            values = calculateFromVpp(parseFloat(value));
            break;
        case 'vrms':
            values = calculateFromVrms(parseFloat(value));
            break;
        case 'vavg':
            values = calculateFromVavg(parseFloat(value));
            break;
    }
    
    // Update other input fields without triggering events
    if (source !== 'vp') vpInput.value = values.vp.toFixed(4);
    if (source !== 'vpp') vppInput.value = values.vpp.toFixed(4);
    if (source !== 'vrms') vrmsInput.value = values.vrms.toFixed(4);
    if (source !== 'vavg') vavgInput.value = values.vavg.toFixed(4);
    
    // Update visualizations
    updateWaveform(values);
    updateFormulaHighlighting(source);
}, 500); // Increased to 500ms

// Separate quick update for formula highlighting
const quickHighlight = debounce((source) => {
    updateFormulaHighlighting(source);
}, 100);

// Event listeners
vpInput.addEventListener('input', (e) => {
    quickHighlight('vp');
    debouncedUpdate('vp', e.target.value);
});
vppInput.addEventListener('input', (e) => {
    quickHighlight('vpp');
    debouncedUpdate('vpp', e.target.value);
});
vrmsInput.addEventListener('input', (e) => {
    quickHighlight('vrms');
    debouncedUpdate('vrms', e.target.value);
});
vavgInput.addEventListener('input', (e) => {
    quickHighlight('vavg');
    debouncedUpdate('vavg', e.target.value);
});

// Frequency changes
const debouncedFrequencyUpdate = debounce((e) => {
    const value = e.target.value;
    if (vpInput.value) debouncedUpdate('vp', vpInput.value);
    else if (vppInput.value) debouncedUpdate('vpp', vppInput.value);
    else if (vrmsInput.value) debouncedUpdate('vrms', vrmsInput.value);
    else if (vavgInput.value) debouncedUpdate('vavg', vavgInput.value);
}, 500);

frequencyInput.addEventListener('input', debouncedFrequencyUpdate);
resetButton.addEventListener('click', resetFields);

// Reset all fields
function resetFields() {
    vpInput.value = '';
    vppInput.value = '';
    vrmsInput.value = '';
    vavgInput.value = '';
    
    // Reset chart
    waveformChart.data.datasets.forEach(dataset => {
        dataset.data = [];
    });
    waveformChart.update('none');
    
    // Remove formula highlighting
    document.querySelectorAll('.formula-card').forEach(card => card.classList.remove('active'));
    document.querySelectorAll('.equations p').forEach(eq => eq.classList.remove('active'));
}

// Initialize calculator
resetFields(); 