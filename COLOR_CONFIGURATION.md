# Color Configuration Guide

## Current Implementation

All colors have been extracted as configurable CSS custom properties (variables) at the top of each component:

### Color Categories

1. **Primary Theme Colors**
   - `--page-background`: Main background color
   - `--dial-background-1/2`: Dial outer gradient colors
   - `--dial-inner-1/2/3`: Inner dial gradient colors

2. **Active/Accent Colors**
   - `--accent-primary`: Bright cyan for active elements (#06b6d4)
   - `--accent-glow`: Cyan glow effect
   - `--accent-secondary`: Darker cyan for hover states

3. **Text Colors**
   - `--text-primary`: Main temperature display
   - `--text-secondary`: Labels and secondary text
   - `--text-muted`: Status text

4. **Interactive Elements**
   - `--button-background-1/2`: Button gradients
   - `--button-hover-1/2`: Button hover states
   - `--button-text/button-text-hover`: Button text colors

5. **Inactive Elements**
   - `--tick-inactive`: Inactive tick marks
   - `--range-labels`: Min/max temperature labels

## Current Color Scheme (Based on Your Theme)

```css
--page-background: #0f172a;        /* Very dark slate */
--dial-background-1: #334155;      /* Slate 700 */
--dial-background-2: #1e293b;      /* Slate 800 */
--accent-primary: #06b6d4;         /* Cyan 500 */
--text-primary: #f1f5f9;           /* Slate 100 */
--text-secondary: #94a3b8;         /* Slate 400 */
```

## Potential Node-RED Configuration Options

### Option 1: Preset Themes
```javascript
// In Node-RED configuration
{
  theme: "cyan-dark",    // Default matching your current theme
  // alternatives: "blue-dark", "green-dark", "amber-dark", "custom"
}
```

### Option 2: Simple Color Picker
```javascript
// In Node-RED configuration  
{
  accentColor: "#06b6d4",      // Primary accent color
  theme: "dark",               // "dark" or "light" base theme
}
```

### Option 3: Full Custom Colors
```javascript
// In Node-RED configuration
{
  colors: {
    accent: "#06b6d4",
    background: "#1e293b",
    text: "#f1f5f9",
    // ... other customizable colors
  }
}
```

## Implementation Strategy

### Phase 1: Simple Theme Selection
Add a dropdown in the Node-RED configuration with preset themes:
- Cyan Dark (current)
- Blue Dark
- Green Dark
- Amber Dark
- Purple Dark

### Phase 2: Accent Color Customization
Add a color picker for the accent color while keeping the dark base theme.

### Phase 3: Full Theme Customization
Advanced users could define complete color schemes via JSON configuration.

## Files Updated with Color Variables

1. `thermostat2.html` - Standalone widget with CSS variables
2. `thermostat-testbed.html` - Test bed with matching theme
3. `ui/components/UIThermostat.vue` - Vue component with CSS variables

## Next Steps

1. Add theme configuration to `nodes/ui-thermostat.html`
2. Update `nodes/ui-thermostat.js` to handle theme configuration
3. Implement CSS variable injection based on configuration
4. Add validation for custom color values
5. Create additional preset themes

## Benefits of This Approach

- **Maintainable**: All colors centralized in CSS variables
- **Flexible**: Easy to swap entire color schemes
- **Future-proof**: Can add more themes without touching component logic
- **Performance**: CSS variables are efficient and don't require re-rendering
- **User-friendly**: Can provide simple presets or advanced customization