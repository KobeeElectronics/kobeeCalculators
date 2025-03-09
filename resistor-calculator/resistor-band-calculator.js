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

const validColorsForBand = {
    significantFigure: ['black', 'brown', 'red', 'orange', 'yellow', 'green', 'blue', 'violet', 'gray', 'white'],
    multiplier: ['black', 'brown', 'red', 'orange', 'yellow', 'green', 'blue', 'violet', 'gray', 'white', 'gold', 'silver'],
    tolerance: ['brown', 'red', 'green', 'blue', 'violet', 'gray', 'gold', 'silver'],
    temperature: ['brown', 'red', 'orange', 'yellow', 'green', 'blue', 'violet']
};

const eia96Values = {
    // First two digits represent the resistance value
    // Letter represents the multiplier (F=0.1, H=0.01, A=1, B=10, C=100, D=1000, E=10000)
    "01": 100.0, "02": 102.0, "03": 105.0, "04": 107.0, "05": 110.0, "06": 113.0, "07": 115.0, "08": 118.0,
    "09": 121.0, "10": 124.0, "11": 127.0, "12": 130.0, "13": 133.0, "14": 137.0, "15": 140.0, "16": 143.0,
    "17": 147.0, "18": 150.0, "19": 154.0, "20": 158.0, "21": 162.0, "22": 165.0, "23": 169.0, "24": 174.0,
    "25": 178.0, "26": 182.0, "27": 187.0, "28": 191.0, "29": 196.0, "30": 200.0, "31": 205.0, "32": 210.0,
    "33": 215.0, "34": 221.0, "35": 226.0, "36": 232.0, "37": 237.0, "38": 243.0, "39": 249.0, "40": 255.0,
    "41": 261.0, "42": 267.0, "43": 274.0, "44": 280.0, "45": 287.0, "46": 294.0, "47": 301.0, "48": 309.0,
    "49": 316.0, "50": 324.0, "51": 332.0, "52": 340.0, "53": 348.0, "54": 357.0, "55": 365.0, "56": 374.0,
    "57": 383.0, "58": 392.0, "59": 402.0, "60": 412.0, "61": 422.0, "62": 432.0, "63": 442.0, "64": 453.0,
    "65": 464.0, "66": 475.0, "67": 487.0, "68": 499.0, "69": 511.0, "70": 523.0, "71": 536.0, "72": 549.0,
    "73": 562.0, "74": 576.0, "75": 590.0, "76": 604.0, "77": 619.0, "78": 634.0, "79": 649.0, "80": 665.0,
    "81": 681.0, "82": 698.0, "83": 715.0, "84": 732.0, "85": 750.0, "86": 768.0, "87": 787.0, "88": 806.0,
    "89": 825.0, "90": 845.0, "91": 866.0, "92": 887.0, "93": 909.0, "94": 931.0, "95": 953.0, "96": 976.0
};

const eia96Multipliers = {
    'Z': 0.001,    // ×0.001
    'Y': 0.01,     // ×0.01
    'R': 0.01,     // ×0.01
    'X': 0.1,      // ×0.1
    'S': 0.1,      // ×0.1
    'A': 1,        // ×1
    'B': 10,       // ×10
    'H': 10,       // ×10
    'C': 100,      // ×100
    'D': 1000,     // ×1k
    'E': 10000,    // ×10k
    'F': 100000    // ×100k
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

let smdDigits = {
    first: '0',
    second: '0',
    third: '0',
    fourth: '0'
};

// Initialize the calculator
document.addEventListener('DOMContentLoaded', () => {
    updateBandVisibility();
    setupEventListeners();
    selectFirstBand();
    setupSMDInputs();
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
            if (selectedBand && isValidColorForBand(btn.dataset.color, selectedBand)) {
                applyColor(btn.dataset.color);
                moveToNextBand();
            }
        });
    });

    // Type selector buttons
    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const type = btn.dataset.type;
            document.getElementById('throughHoleCalculator').style.display = 
                type === 'through-hole' ? 'block' : 'none';
            document.getElementById('smdCalculator').style.display = 
                type === 'smd' ? 'block' : 'none';
            
            resetCalculator();
        });
    });

    // SMD format selector
    document.getElementById('smdFormat').addEventListener('change', setupSMDInputs);
    
    // SMD reset button
    document.getElementById('smdResetButton').addEventListener('click', resetSMDCalculator);
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

    // Update color button states
    updateColorButtonStates(bandNumber);
}

function isValidColorForBand(color, bandType) {
    if (['1', '2', '3'].includes(bandType)) {
        return validColorsForBand.significantFigure.includes(color);
    } else if (bandType === 'multiplier') {
        return validColorsForBand.multiplier.includes(color);
    } else if (bandType === 'tolerance') {
        return validColorsForBand.tolerance.includes(color);
    } else if (bandType === 'temperature') {
        return validColorsForBand.temperature.includes(color);
    }
    return false;
}

function updateColorButtonStates(bandType) {
    document.querySelectorAll('.color-btn').forEach(btn => {
        const color = btn.dataset.color;
        if (isValidColorForBand(color, bandType)) {
            btn.classList.remove('disabled');
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
        } else {
            btn.classList.add('disabled');
            btn.style.opacity = '0.3';
            btn.style.cursor = 'not-allowed';
        }
    });
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

function setupSMDInputs() {
    const format = document.getElementById('smdFormat').value;
    const digitInputs = document.getElementById('digitInputs');
    digitInputs.innerHTML = '';

    smdDigits = {
        first: '0',
        second: '0',
        third: '0',
        fourth: '0'
    };

    if (format === 'eia96') {
        // Create two separate number selectors for EIA-96 code
        const firstDigitSelect = createDigitSelect('firstDigit', ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'], 1);
        const secondDigitSelect = createDigitSelect('secondDigit', ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'], 1);
        
        // Create dropdown for the multiplier letter
        const letterSelect = createDigitSelect('letter', ['Z', 'Y', 'R', 'X', 'S', 'A', 'B', 'H', 'C', 'D', 'E', 'F'], 1);
        letterSelect.title = 'Z=×0.001, Y=×0.01, R=×0.01, X=×0.1, S=×0.1, A=×1, B=×10, H=×10, C=×100, D=×1k, E=×10k, F=×100k';
        
        digitInputs.appendChild(firstDigitSelect);
        digitInputs.appendChild(secondDigitSelect);
        digitInputs.appendChild(letterSelect);
    } else {
        // Create 3 or 4 digit inputs
        const digitCount = format === '3digit' ? 3 : 4;
        for (let i = 1; i <= digitCount; i++) {
            const select = createDigitSelect(
                `digit${i}`,
                ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
                1
            );
            digitInputs.appendChild(select);
        }
    }

    updateSMDDisplay();
}

function createDigitSelect(name, options, size) {
    const select = document.createElement('select');
    select.className = 'digit-select';
    select.name = name;
    
    options.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt;
        option.textContent = opt.padStart(size, '0');
        select.appendChild(option);
    });

    select.addEventListener('change', () => {
        updateSMDValue(name, select.value);
    });

    return select;
}

function updateSMDValue(position, value) {
    const format = document.getElementById('smdFormat').value;
    
    if (format === 'eia96') {
        if (position === 'firstDigit') {
            smdDigits.first = value;
        } else if (position === 'secondDigit') {
            smdDigits.second = value;
        } else if (position === 'letter') {
            smdDigits.third = value;
        }
    } else {
        const index = position.replace('digit', '');
        smdDigits[`${['first', 'second', 'third', 'fourth'][index - 1]}`] = value;
    }

    updateSMDDisplay();
    calculateSMDValue();
}

function updateSMDDisplay() {
    const format = document.getElementById('smdFormat').value;
    const smdText = document.getElementById('smdValue');
    
    if (format === 'eia96') {
        smdText.textContent = `${smdDigits.first}${smdDigits.second}${smdDigits.third}`;
    } else if (format === '3digit') {
        smdText.textContent = `${smdDigits.first}${smdDigits.second}${smdDigits.third}`;
    } else {
        smdText.textContent = `${smdDigits.first}${smdDigits.second}${smdDigits.third}${smdDigits.fourth}`;
    }
}

function calculateSMDValue() {
    const format = document.getElementById('smdFormat').value;
    let value;

    if (format === 'eia96') {
        const code = `${smdDigits.first}${smdDigits.second}`;
        const multiplierLetter = smdDigits.third;
        // Only calculate if it's a valid EIA-96 code (01-96)
        const codeNum = parseInt(code);
        if (codeNum >= 1 && codeNum <= 96 && eia96Multipliers[multiplierLetter]) {
            value = eia96Values[code] * eia96Multipliers[multiplierLetter];
        } else {
            value = 0;
        }
    } else if (format === '3digit') {
        const significantDigits = parseInt(`${smdDigits.first}${smdDigits.second}`);
        const multiplier = parseInt(smdDigits.third);
        value = significantDigits * Math.pow(10, multiplier);
    } else {
        // 4-digit format: first three digits are significant figures, last digit is multiplier
        const significantDigits = parseInt(`${smdDigits.first}${smdDigits.second}${smdDigits.third}`);
        const multiplier = parseInt(smdDigits.fourth);
        value = significantDigits * Math.pow(10, multiplier);
    }

    document.getElementById('resistorValue').textContent = value === 0 ? 'Invalid combination' : `${formatResistorValue(value)}Ω`;
    document.getElementById('toleranceValue').textContent = '';
    document.getElementById('temperatureValue').textContent = '';
}

function resetSMDCalculator() {
    smdDigits = {
        first: '0',
        second: '0',
        third: '0',
        fourth: '0'
    };

    document.querySelectorAll('.digit-select').forEach(select => {
        select.value = '0';
    });

    updateSMDDisplay();
    calculateSMDValue();
} 