document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const celsius = document.getElementById('celsius');
    const fahrenheit = document.getElementById('fahrenheit');
    const kelvin = document.getElementById('kelvin');
    const rankine = document.getElementById('rankine');
    const resetButton = document.getElementById('reset');

    // Function to update equation highlighting
    function updateHighlighting(sourceId) {
        // Remove all active classes
        document.querySelectorAll('.formula-card').forEach(card => card.classList.remove('active'));

        if (sourceId) {
            // Highlight source card
            const sourceCard = document.querySelector(`.formula-card[data-source="${sourceId}"]`);
            if (sourceCard) sourceCard.classList.add('active');
        }
    }

    // Conversion functions
    function celsiusToAll(c) {
        return {
            f: (c * 9/5) + 32,
            k: c + 273.15,
            r: (c + 273.15) * 9/5
        };
    }

    function fahrenheitToAll(f) {
        return {
            c: (f - 32) * 5/9,
            k: (f - 32) * 5/9 + 273.15,
            r: f + 459.67
        };
    }

    function kelvinToAll(k) {
        return {
            c: k - 273.15,
            f: (k * 9/5) - 459.67,
            r: k * 9/5
        };
    }

    function rankineToAll(r) {
        return {
            c: (r - 491.67) * 5/9,
            f: r - 459.67,
            k: r * 5/9
        };
    }

    // Function to update all fields except the source
    function updateFields(source, value) {
        // Clear NaN or empty inputs
        if (isNaN(value) || value === '') {
            clearInputs(source);
            updateHighlighting(null);
            return;
        }

        let converted;
        switch(source) {
            case 'celsius':
                converted = celsiusToAll(value);
                fahrenheit.value = converted.f.toFixed(2);
                kelvin.value = converted.k.toFixed(2);
                rankine.value = converted.r.toFixed(2);
                break;
            case 'fahrenheit':
                converted = fahrenheitToAll(value);
                celsius.value = converted.c.toFixed(2);
                kelvin.value = converted.k.toFixed(2);
                rankine.value = converted.r.toFixed(2);
                break;
            case 'kelvin':
                converted = kelvinToAll(value);
                celsius.value = converted.c.toFixed(2);
                fahrenheit.value = converted.f.toFixed(2);
                rankine.value = converted.r.toFixed(2);
                break;
            case 'rankine':
                converted = rankineToAll(value);
                celsius.value = converted.c.toFixed(2);
                fahrenheit.value = converted.f.toFixed(2);
                kelvin.value = converted.k.toFixed(2);
                break;
        }

        updateHighlighting(source);
    }

    // Function to clear inputs except source
    function clearInputs(source = null) {
        const inputs = [celsius, fahrenheit, kelvin, rankine];
        inputs.forEach(input => {
            if (input.id !== source) {
                input.value = '';
            }
        });
        updateHighlighting(null);
    }

    // Add input event listeners
    [celsius, fahrenheit, kelvin, rankine].forEach(input => {
        input.addEventListener('input', function(e) {
            updateFields(this.id, parseFloat(this.value));
        });
    });

    // Reset button handler
    resetButton.addEventListener('click', function() {
        clearInputs();
        celsius.value = '';
    });
}); 