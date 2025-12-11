<template>
  <div class="thermostat">
    <div class="dial">
      <!-- Tick marks -->
      <div class="ticks">
        <div 
          v-for="(tick, index) in ticks" 
          :key="index"
          class="tick"
          :class="{ active: tick.active }"
          :style="tick.style"
        />
      </div>
      
      <!-- Arrow indicator -->
      <div 
        class="indicator" 
        :style="indicatorStyle"
      />

      <!-- Inner dial with content -->
      <div class="dial-inner">
        <div class="dial-content">
          <div class="dial-label">{{ currentTempLabel }}</div>
          <div class="dial-temperature">
            <span>{{ targetTemp.toFixed(1) }}</span><span class="degree">°</span>
          </div>
          <div class="dial-status">{{ heatingStatus }}</div>
        </div>
      </div>

      <!-- Min/Max labels -->
      <span class="range-label min">{{ minTemp }}°</span>
      <span class="range-label max">{{ maxTemp }}°</span>

      <!-- Control buttons -->
      <div class="controls">
        <button 
          class="btn" 
          @click="adjustTemp(-tempStep)"
          :disabled="targetTemp <= minTemp"
          aria-label="Decrease temperature"
        >
          <span>−</span>
        </button>
        <button 
          class="btn" 
          @click="adjustTemp(tempStep)"
          :disabled="targetTemp >= maxTemp"
          aria-label="Increase temperature"
        >
          <span>+</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'UIThermostat',
  inject: ['$socket', '$dataTracker'],
  props: {
    id: { type: String, required: true },
    props: { type: Object, default: () => ({}) },
    state: { type: Object, default: () => ({ enabled: false, visible: false }) }
  },
  data() {
    return {
      // Configuration
      minTemp: 15,
      maxTemp: 30,
      tempStep: 0.5,
      arcStartAngle: 225,  // degrees from top (bottom-left, 7 o'clock)
      arcEndAngle: 495,    // degrees from top (bottom-right, 5 o'clock) - 270 degree arc
      
      // State
      targetTemp: 22.5,
      currentTemp: 21.8,
      heatingPercent: 0,
      
      // Computed values
      ticks: [],
      totalTicks: 30
    }
  },
  computed: {
    ...mapState('data', ['messages']),
    currentTempLabel() {
      return `Current ${this.currentTemp.toFixed(1)}°`
    },
    heatingStatus() {
      return this.heatingPercent > 0 ? `Heating ${this.heatingPercent}%` : ''
    },
    indicatorStyle() {
      const progress = (this.targetTemp - this.minTemp) / (this.maxTemp - this.minTemp)
      const activeTicks = Math.round(progress * this.totalTicks)
      const arcSpan = this.arcEndAngle - this.arcStartAngle
      const indicatorAngle = this.arcStartAngle + (activeTicks / this.totalTicks) * arcSpan
      
      return {
        transform: `translateX(-50%) rotate(${indicatorAngle}deg)`
      }
    },
    msg() {
      return this.messages[this.id] || {}
    }
  },
  watch: {
    msg: {
      handler(newMsg) {
        if (newMsg && newMsg.payload) {
          this.updateFromPayload(newMsg.payload)
        }
      },
      deep: true,
      immediate: true
    },
    targetTemp() {
      this.generateTicks()
    }
  },
  mounted() {
    this.totalTicks = (this.maxTemp - this.minTemp) / this.tempStep
    this.generateTicks()
    
    // Set up data tracking
    this.$dataTracker(this.id, this.onInput, this.onLoad)
  },
  methods: {
    generateTicks() {
      const arcSpan = this.arcEndAngle - this.arcStartAngle
      const progress = (this.targetTemp - this.minTemp) / (this.maxTemp - this.minTemp)
      const activeTicks = Math.round(progress * this.totalTicks)
      
      this.ticks = []
      for (let i = 0; i <= this.totalTicks; i++) {
        const angle = this.arcStartAngle + (i / this.totalTicks) * arcSpan
        this.ticks.push({
          active: i <= activeTicks,
          style: {
            transform: `translateX(-50%) rotate(${angle}deg)`
          }
        })
      }
    },
    
    adjustTemp(delta) {
      const newTemp = Math.max(this.minTemp, Math.min(this.maxTemp, this.targetTemp + delta))
      if (newTemp !== this.targetTemp) {
        this.targetTemp = newTemp
        this.sendTargetTemp()
      }
    },
    
    updateFromPayload(payload) {
      if (payload.currentTemp !== undefined) {
        this.currentTemp = payload.currentTemp
      }
      if (payload.targetTemp !== undefined) {
        this.targetTemp = payload.targetTemp
      }
      if (payload.heatingPercent !== undefined) {
        this.heatingPercent = payload.heatingPercent
      }
    },
    
    sendTargetTemp() {
      // Send the new target temperature back to Node-RED
      const msg = {
        payload: {
          targetTemp: this.targetTemp
        }
      }
      this.$socket.emit('widget-action', this.id, msg)
    },
    
    onInput(msg) {
      // Handle incoming messages from Node-RED
      if (msg && msg.payload) {
        this.updateFromPayload(msg.payload)
      }
    },
    
    onLoad(msg) {
      // Handle initial load
      if (msg && msg.payload) {
        this.updateFromPayload(msg.payload)
      }
    }
  }
}
</script>

<style scoped>
/* ==================== COLOR THEME CONFIGURATION ==================== */
/* Note: CSS variables must be on the component root, not :root, for scoped styles */
.thermostat {
  /* Primary Theme Colors */
  --dial-background-1: #334155;    /* Dial outer gradient start */
  --dial-background-2: #1e293b;    /* Dial outer gradient end */
  --dial-inner-1: #374151;         /* Inner dial gradient start */
  --dial-inner-2: #1f2937;         /* Inner dial gradient middle */
  --dial-inner-3: #111827;         /* Inner dial gradient end */
  
  /* Active/Accent Colors */
  --accent-primary: #06b6d4;       /* Bright cyan for active elements */
  --accent-glow: rgba(6, 182, 212, 0.4); /* Cyan glow effect */
  
  /* Text Colors */
  --text-primary: #f1f5f9;         /* Primary text (temperature) */
  --text-secondary: #94a3b8;       /* Secondary text (labels) */
  --text-muted: #64748b;           /* Muted text (status) */
  
  /* Inactive Elements */
  --tick-inactive: #475569;        /* Inactive tick marks */
  --range-labels: #64748b;         /* Min/max labels */
  
  /* Buttons */
  --button-background-1: #334155;  /* Button gradient start */
  --button-background-2: #1e293b;  /* Button gradient end */
  --button-hover-1: #475569;       /* Button hover gradient start */
  --button-hover-2: #334155;       /* Button hover gradient end */
  --button-text: #94a3b8;          /* Button text */
  --button-text-hover: #e2e8f0;    /* Button text on hover */
  
  /* Shadows and Effects */
  --shadow-primary: rgba(0, 0, 0, 0.4);
  --shadow-inset-light: rgba(255, 255, 255, 0.05);
  --shadow-inset-dark: rgba(0, 0, 0, 0.4);
/* ===================================================================== */

  /* Component dimensions - responsive sizing */
  position: relative;
  width: 100%;
  max-width: 280px;
  aspect-ratio: 1;
  margin: 0 auto;
  container-type: size;

  /* Font family for the widget */
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.dial {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(145deg, var(--dial-background-1), var(--dial-background-2));
  box-shadow:
    0 2.86cqw 10.71cqw var(--shadow-primary),
    inset 0 0.71cqw 1.43cqw var(--shadow-inset-light);
}

.dial-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 75%;
  height: 75%;
  border-radius: 50%;
  background: linear-gradient(165deg, var(--dial-inner-1) 0%, var(--dial-inner-2) 50%, var(--dial-inner-3) 100%);
  box-shadow:
    inset 0 1.43cqw 4.29cqw var(--shadow-inset-dark),
    inset 0 -0.71cqw 2.14cqw var(--shadow-inset-light);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

/* Tick marks */
.ticks {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.tick {
  position: absolute;
  top: 2.86cqw;
  left: 50%;
  width: 0.71cqw;
  height: 3.57cqw;
  background: var(--tick-inactive);
  border-radius: 0.36cqw;
  transform-origin: 50% 47.14cqw;
}

.tick.active {
  background: var(--accent-primary);
  box-shadow: 0 0 1.43cqw var(--accent-glow);
}

/* Arrow indicator */
.indicator {
  position: absolute;
  top: 2.86cqw;
  left: 50%;
  width: 0.71cqw;
  height: 3.57cqw;
  background: transparent;
  transform-origin: 50% 47.14cqw;
  z-index: 15;
  transition: transform 0.3s ease;
}

.indicator::after {
  content: '';
  position: absolute;
  top: -2.14cqw;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 2.14cqw solid transparent;
  border-right: 2.14cqw solid transparent;
  border-top: 3.57cqw solid var(--accent-primary);
  filter: drop-shadow(0 0 1.43cqw var(--accent-glow));
}

/* Center content */
.dial-content {
  text-align: center;
  color: var(--text-primary);
  z-index: 15;
}

.dial-label {
  font-size: 4.64cqw;
  color: var(--text-secondary);
  margin-bottom: 1.43cqw;
  letter-spacing: 0.18cqw;
}

.dial-temperature {
  font-size: 18.57cqw;
  font-weight: 300;
  line-height: 1;
  margin-bottom: 1.43cqw;
  color: var(--text-primary);
}

.dial-temperature .degree {
  font-size: 10cqw;
  vertical-align: super;
}

.dial-status {
  font-size: 4.29cqw;
  color: var(--text-muted);
  min-height: 5cqw; /* Prevents layout shift when empty */
}

/* Min/Max labels */
.range-label {
  position: absolute;
  font-size: 4.64cqw;
  color: var(--range-labels);
}

.range-label.min {
  bottom: 10cqw;
  left: 23.21cqw;
}

.range-label.max {
  bottom: 10cqw;
  right: 23.21cqw;
}

/* Control buttons */
.controls {
  position: absolute;
  bottom: 10.71cqw;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 7.14cqw;
  z-index: 20;
}

.btn {
  width: 14.29cqw;
  height: 14.29cqw;
  border-radius: 50%;
  border: none;
  background: linear-gradient(145deg, var(--button-background-1), var(--button-background-2));
  box-shadow:
    0 1.07cqw 2.86cqw var(--shadow-primary),
    inset 0 0.36cqw 0.71cqw var(--shadow-inset-light);
  color: var(--button-text);
  font-size: 8.57cqw;
  font-weight: 300;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  user-select: none;
}

.btn:hover:not(:disabled) {
  background: linear-gradient(145deg, var(--button-hover-1), var(--button-hover-2));
  color: var(--button-text-hover);
}

.btn:active:not(:disabled) {
  transform: scale(0.95);
  box-shadow:
    0 0.71cqw 1.43cqw var(--shadow-primary),
    inset 0 0.36cqw 0.71cqw var(--shadow-inset-light);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn span {
  line-height: 1;
  margin-top: -0.71cqw;
}
</style>