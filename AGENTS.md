# Thermostat UI Widget for Node-RED Dashboard 2

## Overview
A circular thermostat UI widget prototype built with HTML, CSS, and JavaScript, designed to match a specific visual reference. This will eventually be integrated into Node-RED Dashboard 2.

## Implementation
- **File**: `thermostat2.html`
- **Technology**: Vanilla HTML/CSS/JS (no frameworks)
- **Dimensions**: 280px × 280px circular dial

## Key Features
- Circular dial with gradient background and inner shadow
- 30 tick marks around the perimeter (matches temperature steps)
- Yellow/gold indicators for active temperature range
- Triangular pointer showing current target temperature
- Temperature range: 15°C to 30°C (0.5° increments)
- Interactive +/- buttons for temperature adjustment
- Keyboard support (arrow keys)

## Architecture Notes
- **Tick alignment**: Indicator uses identical CSS positioning as ticks (`transform-origin`, `translateX(-50%)`) to ensure perfect alignment
- **Temperature mapping**: 30 tick marks = 30 temperature steps (15°-30° in 0.5° increments)
- **Visual hierarchy**: Z-index layering ensures proper element stacking (ticks → indicator → inner content → buttons)

## Visual Design
Matches the reference image with:
- Dark gray gradient dial with subtle lighting effects
- Yellow/gold accent color (#d4a84b) for active elements
- Clean typography with temperature display prominence
- Proper spacing and proportions for dial elements

## Next Steps
Ready for Node-RED Dashboard 2 integration as a custom widget component.