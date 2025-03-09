const colorValues = {
    black: { value: 0, multiplier: 1, tolerance: null, temperature: null },
    brown: { value: 1, multiplier: 10, tolerance: 1, temperature: 100 },
    red: { value: 2, multiplier: 100, tolerance: 2, temperature: 50 },
    orange: { value: 3, multiplier: 1000, tolerance: null, temperature: 15 },
    yellow: { value: 4, multiplier: 10000, tolerance: null, temperature: 25 },
    green: { value: 5, multiplier: 100000, tolerance: 0.5, temperature: 20 },
    blue: { value: 6, multiplier: 1000000, tolerance: 0.25, temperature: 10 },
    violet: { value: 7, multiplier: 10000000, tolerance: 0.1, temperature: 5 },
    gray: { value: 8, multiplier: 100000000, tolerance: 0.05, temperature: null },
    white: { value: 9, multiplier: 1000000000, tolerance: null, temperature: null },
    gold: { value: null, multiplier: 0.1, tolerance: 5, temperature: null },
    silver: { value: null, multiplier: 0.01, tolerance: 10, temperature: null }
};

let selectedBand = null;
let currentBands = {
    1: null,
    2: null,
    3: null,
    multiplier: null,
    tolerance: null,
    temperature: null
};

// Initialize the calculator
document.addEventListener('DOMContentLoaded', () => {
    updateBandVisibility();
    setupEventListeners();
    selectFirstBand();
});

function setupEventListeners() {
    // Band count selector
    document.getElementById('bandCount').addEventListener('change', updateBandVisibility);

    // Reset button
    document.getElementById('resetButton').addEventListener('click', resetCalculator);

    // Band selection
    document.querySelectorAll('.band').forEach(band => {
        band.addEventListener('click', () => selectBand(band.dataset.band));
    });

    // Color selection
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (selectedBand) {
                applyColor(btn.dataset.color);
                moveToNextBand();
            }
        });
    });
}

function selectBand(bandNumber) {
    selectedBand = bandNumber;
    document.getElementById('selectedBand').textContent = `Band ${bandNumber}`;
    
    // Remove previous selection highlight and next-band indicators
    document.querySelectorAll('.band').forEach(band => {
        band.classList.remove('selected');
        band.classList.remove('next-band');
    });
    
    // Add selection highlight
    document.querySelector(`[data-band="${bandNumber}"]`).classList.add('selected');
}

function applyColor(color) {
    if (!selectedBand) return;

    const bandElement = document.querySelector(`[data-band="${selectedBand}"]`);
    bandElement.style.backgroundColor = color;
    currentBands[selectedBand] = color;
    bandElement.classList.remove('selected');
    
    calculateResistorValue();
}

function moveToNextBand() {
    const bandCount = parseInt(document.getElementById('bandCount').value);
    const bandOrder = getBandOrder(bandCount);
    const currentIndex = bandOrder.indexOf(selectedBand);
    
    // Find the next empty band
    let nextBand = null;
    for (let i = 0; i < bandOrder.length; i++) {
        if (currentBands[bandOrder[i]] === null) {
            nextBand = bandOrder[i];
            break;
        }
    }

    if (nextBand) {
        selectBand(nextBand);
    } else {
        selectedBand = null;
        document.getElementById('selectedBand').textContent = 'All bands selected';
    }
}

function getBandOrder(bandCount) {
    if (bandCount === 4) return ['1', '2', 'multiplier', 'tolerance'];
    if (bandCount === 5) return ['1', '2', '3', 'multiplier', 'tolerance'];
    return ['1', '2', '3', 'multiplier', 'tolerance', 'temperature'];
}

function highlightNextBand() {
    const bandCount = parseInt(document.getElementById('bandCount').value);
    const bandOrder = getBandOrder(bandCount);
    
    // Remove all next-band indicators
    document.querySelectorAll('.band').forEach(band => {
        band.classList.remove('next-band');
    });

    // Find the next empty band
    for (const band of bandOrder) {
        if (currentBands[band] === null) {
            document.querySelector(`[data-band="${band}"]`).classList.add('next-band');
            break;
        }
    }
}

function selectFirstBand() {
    const bandCount = parseInt(document.getElementById('bandCount').value);
    const firstBand = getBandOrder(bandCount)[0];
    selectBand(firstBand);
}

function resetCalculator() {
    currentBands = {
        1: null,
        2: null,
        3: null,
        multiplier: null,
        tolerance: null,
        temperature: null
    };

    // Reset colors
    document.querySelectorAll('.band').forEach(band => {
        band.style.backgroundColor = '#ddd';
        band.classList.remove('selected');
    });

    calculateResistorValue();
    selectFirstBand();
}

function updateBandVisibility() {
    const bandCount = parseInt(document.getElementById('bandCount').value);
    const band3 = document.querySelector('[data-band="3"]');
    const tempBand = document.querySelector('[data-band="temperature"]');
    
    // Reset current bands
    resetCalculator();

    // Show/hide bands based on selection
    band3.style.display = bandCount >= 5 ? 'block' : 'none';
    tempBand.style.display = bandCount === 6 ? 'block' : 'none';
}

function calculateResistorValue() {
    const bandCount = parseInt(document.getElementById('bandCount').value);
    
    // Check if all required bands are selected
    const requiredBands = getBandOrder(bandCount);
    const allBandsSelected = requiredBands.every(band => currentBands[band] !== null);
    
    if (!allBandsSelected) {
        document.getElementById('resistorValue').textContent = 'Select all bands to calculate';
        document.getElementById('toleranceValue').textContent = '';
        document.getElementById('temperatureValue').textContent = '';
        return;
    }

    // Calculate value
    let value = '';
    value += colorValues[currentBands['1']].value;
    value += colorValues[currentBands['2']].value;
    if (bandCount >= 5) {
        value += colorValues[currentBands['3']].value;
    }
    
    let numericValue = parseInt(value) * colorValues[currentBands.multiplier].multiplier;
    
    // Format the value
    let formattedValue = formatResistorValue(numericValue);
    
    // Get tolerance
    const tolerance = colorValues[currentBands.tolerance].tolerance;
    
    // Display results
    document.getElementById('resistorValue').textContent = `${formattedValue}Ω`;
    document.getElementById('toleranceValue').textContent = `Tolerance: ±${tolerance}%`;
    
    if (bandCount === 6 && currentBands.temperature) {
        const tempCoef = colorValues[currentBands.temperature].temperature;
        document.getElementById('temperatureValue').textContent = 
            `Temperature Coefficient: ${tempCoef}ppm/°C`;
    } else {
        document.getElementById('temperatureValue').textContent = '';
    }
}

function formatResistorValue(value) {
    if (value >= 1000000000) {
        return (value / 1000000000) + 'G';
    } else if (value >= 1000000) {
        return (value / 1000000) + 'M';
    } else if (value >= 1000) {
        return (value / 1000) + 'k';
    }
    return value.toString();
} 