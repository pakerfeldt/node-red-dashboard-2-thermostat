# Vue Thermostat Widget Test Bed

## Overview
The `vue-testbed.html` file provides a testing environment for the actual Vue.js thermostat component, unlike the original `thermostat-testbed.html` which duplicates the logic in vanilla JavaScript.

## Key Features

### ✅ **Loads Actual Vue Component**
- Uses the real `UIThermostat.vue` component via the UMD build
- No logic duplication - tests the exact same code that runs in Node-RED Dashboard 2
- Ensures testing accuracy and prevents drift between testbed and production

### 🔧 **Node-RED Dashboard 2 Mocks**
- **Vuex Store**: Mimics Node-RED's data flow with a `data/messages` module
- **$socket**: Mock WebSocket service for widget-to-Node-RED communication
- **$dataTracker**: Mock data tracking service for component lifecycle

### 🎨 **Authentic UI Structure**
- Uses real Node-RED Dashboard 2 DOM classes (`.nrdb-ui-group`, `.v-card`, etc.)
- Responsive grid system with column controls (1-6 columns)
- Height constraints testing (simulates 2x2 widget sizing)

### 🛠 **Debug Features**
- **Real-time data injection**: Send temperature, target, and heating percentage updates
- **Preset scenarios**: Cold room, actively heating, target reached, overshoot
- **Auto simulation**: Realistic temperature drift and heating cycles
- **Activity log**: Track all widget interactions and data flow

## Usage

### Quick Start
```bash
# Build the component
npm run build

# Option 1: Open directly (if browser allows local file access)
open vue-testbed.html

# Option 2: Serve via HTTP (recommended)
python3 -m http.server 8000
# Then visit: http://localhost:8000/vue-testbed.html
```

### Testing Scenarios

**Responsive Layout Testing:**
- Test 1-6 column widths to see how the circular thermostat adapts
- Apply height constraints to simulate 2x2, 4x2, 8x2 widget sizing

**Data Flow Testing:**
- Use "Send Update" to inject specific temperature values
- Monitor the activity log to see Vue component reactions
- Verify that +/- buttons emit proper `widget-action` events

**Visual State Testing:**
- Load presets to quickly test different heating scenarios
- Use auto simulation to see realistic temperature changes over time
- Watch tick marks, indicator position, and heating status updates

## Architecture

### Component Loading
```javascript
// Loads from UMD build - exact same component used in Node-RED
app.component('ui-thermostat', window['ui-thermostat'].UIThermostat);
```

### Data Flow
```javascript
// Vue Store (mimics Node-RED data store)
store.commit('data/updateMessage', { id: 'thermostat-test-1', msg });

// Component receives via computed property
msg() {
  return this.messages[this.id] || {}
}
```

### Node-RED Integration Mocks
- **Socket Mock**: Logs all `widget-action` emissions
- **Data Tracker Mock**: Simulates component registration
- **Store Mock**: Provides reactive message passing

## Benefits Over Vanilla Testbed

1. **Testing Accuracy**: Tests the actual production component
2. **Vue Integration**: Verifies Vue.js specific functionality (computed properties, watchers, etc.)
3. **Node-RED Compatibility**: Ensures mocks match real Node-RED Dashboard 2 APIs
4. **Build Verification**: Confirms UMD build works correctly
5. **No Logic Drift**: Eliminates risk of testbed and component diverging

## Files
- `vue-testbed.html` - Main Vue.js testbed file
- `resources/ui-thermostat.umd.js` - Built component (auto-generated)
- `ui/components/UIThermostat.vue` - Source component