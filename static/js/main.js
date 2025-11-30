// Load saved settings on page load
document.addEventListener('DOMContentLoaded', function() {
    loadSettings();
});

// Print page function
function printPage() {
    window.print();
}

// Share page function
function sharePage() {
    if (navigator.share) {
        navigator.share({
            title: 'Risks of Using Cryptocurrencies in the Public Sector',
            text: 'Research on Risks of Using Cryptocurrencies',
            url: window.location.href
        }).catch(err => console.log('Error sharing', err));
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert('Link copied to clipboard!');
        });
    }
}

// Open settings modal
function openSettings() {
    const modal = document.getElementById('settingsModal');
    modal.style.display = 'block';
    loadCurrentSettings();
}

// Close settings modal
function closeSettings() {
    const modal = document.getElementById('settingsModal');
    modal.style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('settingsModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Load current settings into form
function loadCurrentSettings() {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    
    document.getElementById('fontSize').value = computedStyle.getPropertyValue('--font-size').trim() || '16px';
    document.getElementById('fontFamily').value = computedStyle.getPropertyValue('--font-family').trim() || 'Arial, sans-serif';
    document.getElementById('primaryColor').value = rgbToHex(computedStyle.getPropertyValue('--primary-color').trim() || '#2c3e50');
    document.getElementById('secondaryColor').value = rgbToHex(computedStyle.getPropertyValue('--secondary-color').trim() || '#3498db');
    document.getElementById('backgroundColor').value = rgbToHex(computedStyle.getPropertyValue('--background-color').trim() || '#ecf0f1');
    document.getElementById('textColor').value = rgbToHex(computedStyle.getPropertyValue('--text-color').trim() || '#2c3e50');
}

// Apply settings
function applySettings() {
    const settings = {
        fontSize: document.getElementById('fontSize').value,
        fontFamily: document.getElementById('fontFamily').value,
        primaryColor: document.getElementById('primaryColor').value,
        secondaryColor: document.getElementById('secondaryColor').value,
        backgroundColor: document.getElementById('backgroundColor').value,
        textColor: document.getElementById('textColor').value
    };
    
    // Apply to CSS variables
    const root = document.documentElement;
    root.style.setProperty('--font-size', settings.fontSize);
    root.style.setProperty('--font-family', settings.fontFamily);
    root.style.setProperty('--primary-color', settings.primaryColor);
    root.style.setProperty('--secondary-color', settings.secondaryColor);
    root.style.setProperty('--background-color', settings.backgroundColor);
    root.style.setProperty('--text-color', settings.textColor);
    
    // Save to localStorage
    localStorage.setItem('uiSettings', JSON.stringify(settings));
    
    // Send to server (optional)
    fetch('/api/settings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings)
    });
    
    closeSettings();
}

// Reset settings to default
function resetSettings() {
    const defaultSettings = {
        fontSize: '16px',
        fontFamily: 'Arial, sans-serif',
        primaryColor: '#2c3e50',
        secondaryColor: '#3498db',
        backgroundColor: '#ecf0f1',
        textColor: '#2c3e50'
    };
    
    document.getElementById('fontSize').value = defaultSettings.fontSize;
    document.getElementById('fontFamily').value = defaultSettings.fontFamily;
    document.getElementById('primaryColor').value = defaultSettings.primaryColor;
    document.getElementById('secondaryColor').value = defaultSettings.secondaryColor;
    document.getElementById('backgroundColor').value = defaultSettings.backgroundColor;
    document.getElementById('textColor').value = defaultSettings.textColor;
    
    applySettings();
}

// Load settings from localStorage
function loadSettings() {
    const savedSettings = localStorage.getItem('uiSettings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        const root = document.documentElement;
        root.style.setProperty('--font-size', settings.fontSize);
        root.style.setProperty('--font-family', settings.fontFamily);
        root.style.setProperty('--primary-color', settings.primaryColor);
        root.style.setProperty('--secondary-color', settings.secondaryColor);
        root.style.setProperty('--background-color', settings.backgroundColor);
        root.style.setProperty('--text-color', settings.textColor);
    }
}

// Helper function to convert RGB to hex
function rgbToHex(rgb) {
    if (rgb.startsWith('#')) {
        return rgb;
    }
    
    // If it's rgb() format, convert it
    if (rgb.startsWith('rgb')) {
        const matches = rgb.match(/\d+/g);
        if (matches && matches.length >= 3) {
            return '#' + matches.map(x => {
                const hex = parseInt(x).toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            }).join('');
        }
    }
    
    return rgb;
}

