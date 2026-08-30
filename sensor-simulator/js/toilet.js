/* ==========================================================================
   toilet.js — Smart Public Toilet sensor configuration
   Sensors: Temperature, Humidity, Gas Level, Occupancy, Water Tank %
   ========================================================================== */

document.addEventListener("vss:init-toilet", () => {
  VSS.buildAssetModule({
    key: "pt",
    assetType: "public_toilet",
    nodeIdPrefix: "PT",
    containerId: "toiletSensors",
    faultContainerId: "toiletFaults",
    consoleId: "toiletConsole",
    statusBadgeId: "toiletStatusBadge",
    latitude: 12.988029,
    longitude: 79.972829,

    sensors: [
      { sensorKey: "temperature", label: "Temperature", unit: "°C", hint: "Ambient cabin temperature",
        min: 10, max: 50, step: 1, decimals: 0, default: 29, warn: 38, crit: 44 },
      { sensorKey: "humidity", label: "Humidity", unit: "%", hint: "Relative humidity",
        min: 0, max: 100, step: 1, decimals: 0, default: 55, warn: 80, crit: 92 },
      { sensorKey: "ammonia", label: "Ammonia", unit: "ppm", hint: "Odor / ammonia sensor",
        min: 0, max: 1000, step: 1, decimals: 0, default: 90, warn: 400, crit: 650 },
      { sensorKey: "water_level", label: "Water Level", unit: "%", hint: "Overhead tank level",
        min: 0, max: 100, step: 1, decimals: 0, default: 72, warn: 25, crit: 8, invert: true },
      { sensorKey: "occupancy", label: "Occupancy", type: "boolean", hint: "PIR occupancy sensor",
        default: false },
    ],
    faults: [
      { key: "bad_odor", label: "Bad Odor",
        overrides: { ammonia: 780 } },
      { key: "overflow", label: "Overflow",
        overrides: { humidity: 96, water_level: 100 } },
      { key: "water_shortage", label: "Water Shortage",
        overrides: { water_level: 4 } },
      { key: "cleaning_required", label: "Cleaning Required",
        overrides: { ammonia: 520, humidity: 88 } },
    ],
  });
});
