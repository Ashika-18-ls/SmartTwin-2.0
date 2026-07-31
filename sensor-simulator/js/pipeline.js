/* ==========================================================================
   pipeline.js — Smart Water Pipeline sensor configuration
   Sensors: Pressure (bar), Flow Rate (L/min), Leak Status, Water Quality (ppm TDS)
   ========================================================================== */

document.addEventListener("vss:init-pipeline", () => {
  VSS.buildAssetModule({
    key: "pl",
    assetType: "pipeline",
    nodeIdPrefix: "PL",
    containerId: "pipelineSensors",
    faultContainerId: "pipelineFaults",
    consoleId: "pipelineConsole",
    statusBadgeId: "pipelineStatusBadge",
    sensors: [
      { sensorKey: "pressure", label: "Pressure", unit: "bar", hint: "Line pressure at node",
        min: 0, max: 12, step: 0.1, decimals: 1, default: 4.8, warn: 2.0, crit: 1.0, invert: true },
      { sensorKey: "flow_rate", label: "Flow Rate", unit: "L/min", hint: "Volumetric flow",
        min: 0, max: 300, step: 1, decimals: 0, default: 145, warn: 40, crit: 10, invert: true },
      { sensorKey: "water_quality", label: "Water Quality", unit: "ppm", hint: "Total dissolved solids",
        min: 0, max: 1200, step: 1, decimals: 0, default: 210, warn: 500, crit: 800 },
      { sensorKey: "leak_status", label: "Leak Status", type: "boolean", hint: "Acoustic leak detection",
        default: false },
    ],
    faults: [
      { key: "leak", label: "Leak",
        overrides: { leak_status: true, pressure: 1.6, flow_rate: 190 } },
      { key: "blockage", label: "Blockage",
        overrides: { flow_rate: 8, pressure: 9.6 } },
      { key: "pressure_drop", label: "Pressure Drop",
        overrides: { pressure: 0.6 } },
      { key: "valve_failure", label: "Valve Failure",
        overrides: { flow_rate: 0, pressure: 0.2 } },
    ],
  });
});
