/* ==========================================================================
   wastebin.js — Smart Waste Bin sensor configuration
   Sensors: Fill Level (%), Gas Level (ppm), Weight (kg), Battery (%)
   ========================================================================== */

document.addEventListener("vss:init-wastebin", () => {
  VSS.buildAssetModule({
    key: "wb",
    assetType: "waste_bin",
    nodeIdPrefix: "WB",
    containerId: "wastebinSensors",
    faultContainerId: "wastebinFaults",
    consoleId: "wastebinConsole",
    statusBadgeId: "wastebinStatusBadge",
    sensors: [
      { sensorKey: "fill_level", label: "Fill Level", unit: "%", hint: "Ultrasonic fill sensor",
        min: 0, max: 100, step: 1, decimals: 0, default: 42, warn: 75, crit: 92 },
      { sensorKey: "gas_level", label: "Gas Level", unit: "ppm", hint: "Methane / odor sensor (MQ series)",
        min: 0, max: 1000, step: 1, decimals: 0, default: 120, warn: 450, crit: 700 },
      { sensorKey: "weight", label: "Weight", unit: "kg", hint: "Load cell reading",
        min: 0, max: 120, step: 1, decimals: 0, default: 18, warn: 85, crit: 105 },
      { sensorKey: "battery", label: "Battery", unit: "%", hint: "Node power reserve",
        min: 0, max: 100, step: 1, decimals: 0, default: 88, warn: 30, crit: 12, invert: true },
    ],
    faults: [
      { key: "overflow", label: "Overflow",
        overrides: { fill_level: 99, weight: 112 } },
      { key: "gas_leak", label: "Gas Leak",
        overrides: { gas_level: 860 } },
      { key: "sensor_failure", label: "Sensor Failure",
        overrides: { fill_level: 0, weight: 0 } },
      { key: "battery_low", label: "Battery Low",
        overrides: { battery: 6 } },
    ],
  });
});
