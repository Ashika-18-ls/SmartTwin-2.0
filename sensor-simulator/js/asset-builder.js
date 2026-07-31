/* ==========================================================================
   asset-builder.js
   A single reusable engine that every asset page (streetlight, pipeline,
   waste bin, public toilet) is built from. Each asset file only supplies a
   config object (sensors, fault scenarios, node id prefix) — this file does
   the actual rendering, gauge wiring, fault injection and JSON transmission.
   ========================================================================== */

VSS.assets = {}; // registry: assetType -> { config, state, nodeId }

VSS.buildAssetModule = (config) => {
  const { key, assetType, nodeIdPrefix, containerId, faultContainerId,
          consoleId, statusBadgeId, sensors, faults } = config;

  const state = {};
  const gauges = {};
  const nodeId = `${nodeIdPrefix}${String(VSS.nodeCounter()).padStart(2, "0")}`;
  let activeFault = null;

  sensors.forEach(s => { state[s.sensorKey] = s.default; });

  const container = document.getElementById(containerId);

  /* ---- render one sensor card ---- */
  const cardHTML = (s) => {
    const gaugeId = `${key}-${s.sensorKey}-gauge`;
    const sliderId = `${key}-${s.sensorKey}-slider`;
    const inputId = `${key}-${s.sensorKey}-input`;
    const valId = `${key}-${s.sensorKey}-val`;
    const badgeId = `${key}-${s.sensorKey}-badge`;

    if (s.type === "boolean") {
      return `
      <div class="col-md-6 col-xl-3">
        <div class="surface card-pad h-100 sensor-card">
          <div class="sensor-head">
            <div>
              <div class="sensor-name">${s.label}</div>
              <div class="text-muted-2" style="font-size:.72rem;">${s.hint || ""}</div>
            </div>
            <span id="${badgeId}"></span>
          </div>
          <div class="form-check form-switch mt-3">
            <input class="form-check-input" type="checkbox" role="switch" id="${inputId}" data-sensor="${s.sensorKey}">
            <label class="form-check-label sensor-reading" id="${valId}" for="${inputId}">${s.default ? "TRUE" : "FALSE"}</label>
          </div>
          <button class="btn btn-vss btn-vss-outline btn-sm mt-3 w-100" data-random-one="${s.sensorKey}">
            <i class="bi bi-shuffle me-1"></i>Randomize
          </button>
        </div>
      </div>`;
    }

    return `
    <div class="col-md-6 col-xl-3">
      <div class="surface card-pad h-100 sensor-card">
        <div class="sensor-head">
          <div>
            <div class="sensor-name">${s.label}</div>
            <div class="text-muted-2" style="font-size:.72rem;">${s.hint || ""}</div>
          </div>
          <span id="${badgeId}"></span>
        </div>
        <div class="d-flex align-items-center gap-3">
          <div class="gauge-wrap">
            <canvas id="${gaugeId}"></canvas>
            <div class="gauge-center">
              <div class="g-val" id="${valId}">${s.default}</div>
              <div class="g-unit">${s.unit || ""}</div>
            </div>
          </div>
          <div class="flex-grow-1">
            <input type="range" class="form-range" id="${sliderId}"
                   min="${s.min}" max="${s.max}" step="${s.step || 1}" value="${s.default}" data-sensor="${s.sensorKey}">
            <input type="number" class="form-control form-control-sm mt-1" id="${inputId}"
                   min="${s.min}" max="${s.max}" step="${s.step || 1}" value="${s.default}" data-sensor="${s.sensorKey}">
          </div>
        </div>
        <button class="btn btn-vss btn-vss-outline btn-sm mt-3 w-100" data-random-one="${s.sensorKey}">
          <i class="bi bi-shuffle me-1"></i>Randomize
        </button>
      </div>
    </div>`;
  };

  if (container) container.innerHTML = sensors.map(cardHTML).join("");

  /* ---- gauges + badges ---- */
  sensors.forEach(s => {
    if (s.type === "boolean") return;
    const gaugeId = `${key}-${s.sensorKey}-gauge`;
    const status = VSS.statusFor(s.default, s.warn, s.crit, s.invert);
    gauges[s.sensorKey] = VSS.makeGauge(gaugeId, s.default, s.min, s.max, `var(--${VSS.statusColor[status]})`);
  });

  const refreshBadge = (s) => {
    const badgeId = `${key}-${s.sensorKey}-badge`;
    const el = document.getElementById(badgeId);
    if (!el) return;
    if (s.type === "boolean") {
      el.innerHTML = state[s.sensorKey]
        ? VSS.badgeHTML("critical")
        : VSS.badgeHTML("healthy");
      return;
    }
    const status = VSS.statusFor(state[s.sensorKey], s.warn, s.crit, s.invert);
    el.innerHTML = VSS.badgeHTML(status);
  };

  const refreshOverallStatus = () => {
    let worst = "healthy";
    sensors.forEach(s => {
      let st;
      if (s.type === "boolean") st = state[s.sensorKey] ? "critical" : "healthy";
      else st = VSS.statusFor(state[s.sensorKey], s.warn, s.crit, s.invert);
      if (st === "critical") worst = "critical";
      else if (st === "warning" && worst !== "critical") worst = "warning";
    });
    const el = document.getElementById(statusBadgeId);
    if (el) el.innerHTML = VSS.badgeHTML(worst);
    document.dispatchEvent(new CustomEvent("vss:asset-status", { detail: { assetType, status: worst } }));
    return worst;
  };

  const setSensorValue = (sensorKey, value) => {
    const s = sensors.find(x => x.sensorKey === sensorKey);
    if (!s) return;
    state[sensorKey] = value;
    if (s.type === "boolean") {
      document.getElementById(`${key}-${sensorKey}-input`).checked = value;
      document.getElementById(`${key}-${sensorKey}-val`).textContent = value ? "TRUE" : "FALSE";
    } else {
      document.getElementById(`${key}-${sensorKey}-slider`).value = value;
      document.getElementById(`${key}-${sensorKey}-input`).value = value;
      document.getElementById(`${key}-${sensorKey}-val`).textContent = value;
      const status = VSS.statusFor(value, s.warn, s.crit, s.invert);
      VSS.updateGauge(gauges[sensorKey], value, s.min, s.max, `var(--${VSS.statusColor[status]})`);
    }
    refreshBadge(s);
    refreshOverallStatus();
  };

  /* ---- wire slider/input/checkbox events ---- */
  sensors.forEach(s => {
    if (s.type === "boolean") {
      const input = document.getElementById(`${key}-${s.sensorKey}-input`);
      input && input.addEventListener("change", e => setSensorValue(s.sensorKey, e.target.checked));
      return;
    }
    const slider = document.getElementById(`${key}-${s.sensorKey}-slider`);
    const input = document.getElementById(`${key}-${s.sensorKey}-input`);
    slider && slider.addEventListener("input", e => setSensorValue(s.sensorKey, +e.target.value));
    input && input.addEventListener("input", e => setSensorValue(s.sensorKey, +e.target.value));
  });

  /* ---- per-sensor randomize buttons ---- */
  container && container.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-random-one]");
    if (!btn) return;
    const sensorKey = btn.dataset.randomOne;
    const s = sensors.find(x => x.sensorKey === sensorKey);
    if (s.type === "boolean") setSensorValue(sensorKey, Math.random() > 0.7);
    else setSensorValue(sensorKey, VSS.rand(s.min, s.max, s.decimals || 0));
  });

  /* ---- fault chips ---- */
  const faultContainer = document.getElementById(faultContainerId);
  if (faultContainer) {
    faultContainer.innerHTML = faults.map(f =>
      `<button class="fault-chip" data-fault="${f.key}"><i class="bi bi-exclamation-triangle me-1"></i>${f.label}</button>`
    ).join("");

    faultContainer.addEventListener("click", (e) => {
      const chip = e.target.closest("[data-fault]");
      if (!chip) return;
      const fKey = chip.dataset.fault;
      const fault = faults.find(f => f.key === fKey);
      applyFault(fault);
      [...faultContainer.children].forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
    });
  }

  const applyFault = (fault) => {
    activeFault = fault;
    Object.entries(fault.overrides).forEach(([k, v]) => setSensorValue(k, v));
    VSS.toast(`Fault injected on ${nodeId}: <b>${fault.label}</b>`, "red");
  };

  /* ---- generate random (all sensors) ---- */
  const generateRandom = () => {
    sensors.forEach(s => {
      if (s.type === "boolean") setSensorValue(s.sensorKey, Math.random() > 0.85);
      else setSensorValue(s.sensorKey, VSS.rand(s.min, s.max, s.decimals || 0));
    });
    activeFault = null;
    if (faultContainer) [...faultContainer.children].forEach(c => c.classList.remove("active"));
    VSS.toast(`Random telemetry generated for ${nodeId}`, "navy");
  };

  const injectRandomFault = () => {
    const fault = faults[Math.floor(Math.random() * faults.length)];
    applyFault(fault);
    if (faultContainer) {
      [...faultContainer.children].forEach(c => c.classList.toggle("active", c.dataset.fault === fault.key));
    }
  };

  const resetAll = () => {
    sensors.forEach(s => setSensorValue(s.sensorKey, s.default));
    activeFault = null;
    if (faultContainer) [...faultContainer.children].forEach(c => c.classList.remove("active"));
    VSS.toast(`${assetType} node ${nodeId} reset to baseline`, "navy");
  };

  const sendData = () => {
    const payload = { node_id: nodeId, asset_type: assetType };
    sensors.forEach(s => { payload[s.sensorKey] = state[s.sensorKey]; });
    payload.timestamp = VSS.nowISO();
    VSS.renderJSON(consoleId, payload);

    const status = refreshOverallStatus();
    VSS.pushLog({
      timestamp: payload.timestamp, nodeId, assetType, status,
      fault: activeFault ? activeFault.label : "—",
      payload,
    });
    VSS.toast(`Telemetry transmitted from ${nodeId}`, "green");
  };

  refreshOverallStatus();

  VSS.assets[assetType] = { config, state, nodeId, generateRandom, injectRandomFault, resetAll, sendData };
  return VSS.assets[assetType];
};
