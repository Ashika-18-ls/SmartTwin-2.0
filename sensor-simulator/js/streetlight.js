/* ==========================================================================
   streetlight.js — Smart Streetlight sensor configuration
   Sensors: Current (A), LDR (Lux), Vibration, Temperature (°C), Voltage (V)
   ========================================================================== */

document.addEventListener("vss:init-streetlight", () => {
  VSS.buildAssetModule({
    key: "sl",
    assetType: "streetlight",
    nodeIdPrefix: "SL",
    containerId: "streetlightSensors",
    faultContainerId: "streetlightFaults",
    consoleId: "streetlightConsole",
    statusBadgeId: "streetlightStatusBadge",

    latitude: 12.988029,
    longitude: 79.972829,
    
    sensors: [
      { sensorKey: "current", label: "Current", unit: "A", hint: "Load draw of the lamp driver",
        min: 0, max: 5, step: 0.01, decimals: 2, default: 2.31, warn: 3.5, crit: 4.4 },
      { sensorKey: "ldr", label: "LDR (Lux)", unit: "lux", hint: "Ambient light reading",
        min: 0, max: 1000, step: 1, decimals: 0, default: 182, warn: 600, crit: 850 },
      { sensorKey: "voltage", label: "Voltage", unit: "V", hint: "Supply line voltage",
        min: 180, max: 260, step: 1, decimals: 0, default: 228, warn: 210, crit: 195, invert: true },
      { sensorKey: "temperature", label: "Temperature", unit: "°C", hint: "Driver enclosure temp",
        min: 15, max: 90, step: 1, decimals: 0, default: 31, warn: 55, crit: 70 },
      { sensorKey: "vibration", label: "Vibration", type: "boolean", hint: "Pole impact / tamper sensor",
        default: false },
    ],
    faults: [
      { key: "lamp_failure", label: "Lamp Failure",
        overrides: { current: 0.02, ldr: 940 } },
      { key: "pole_hit", label: "Pole Hit",
        overrides: { vibration: true, current: 4.7 } },
      { key: "power_failure", label: "Power Failure",
        overrides: { voltage: 0, current: 0 } },
      { key: "low_voltage", label: "Low Voltage",
        overrides: { voltage: 189 } },
      { key: "sensor_failure", label: "Sensor Failure",
        overrides: { ldr: 999, temperature: 88 } },
    ],
  });
});
