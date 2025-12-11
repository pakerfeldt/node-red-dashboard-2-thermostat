# Node-RED Dashboard 2 Thermostat Widget

A circular thermostat widget for Node-RED Dashboard 2.0, specifically designed for floor heating systems with room sensors.

## Features

- **Circular dial interface** with 280px × 280px dimensions
- **Current temperature display** from room sensor
- **Target temperature control** with +/- buttons and keyboard support
- **Heating status indicator** showing actuator percentage (0-100%)
- **Visual feedback** with graduated dial and pointer
- **Configurable temperature range** and step size

## Installation

```bash
npm install @pakerfeldt/node-red-dashboard-2-thermostat
```

## Usage

### Input Message Format

Send messages to the thermostat node with the following payload structure:

```javascript
{
  "currentTemp": 21.8,     // Current room temperature (required)
  "targetTemp": 22.5,      // Target temperature (optional)
  "heatingPercent": 65     // Heating actuator opening 0-100% (required)
}
```

### Output Message Format

When users adjust the target temperature, the node outputs:

```javascript
{
  "targetTemp": 23.0,      // New target temperature
  "source": "user"         // Indicates manual adjustment
}
```

### Widget Display

The widget shows three key pieces of information:
1. **Current temperature** (top label) - from room sensor
2. **Target temperature** (center, large) - user controllable
3. **Heating status** (bottom) - only shown when heating > 0%

Example display:
```
    Current 21.8°
       22.5°
    Heating 65%
```

## Configuration

- **Min/Max Temperature**: Sets the range for the dial (default: 15°C - 30°C)
- **Temperature Step**: Increment for +/- buttons (default: 0.5°C)

## Development

### Prerequisites
- Node.js ≥ 14
- Node-RED ≥ 3.0.0
- @flowfuse/node-red-dashboard ≥ 1.22.0

### Build

```bash
npm install
npm run build
```

### Development Mode

```bash
npm run dev
```

## Integration Example

This widget works well with floor heating systems where you have:
- Room temperature sensors providing `currentTemp`
- Heating controller providing current `targetTemp` and `heatingPercent`
- User interface for adjusting target temperature

The widget automatically handles the visual representation and user interactions, sending temperature adjustments back to your heating control flow.

## License

Apache-2.0