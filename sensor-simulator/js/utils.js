/* ==========================================================================
   utils.js — shared helpers used across all sensor modules
   ========================================================================== */

const VSS = window.VSS || {};

VSS.rand = (min, max, decimals = 0) => {
  const v = Math.random() * (max - min) + min;
  return decimals > 0 ? +v.toFixed(decimals) : Math.round(v);
};

VSS.clamp = (v, min, max) => Math.min(max, Math.max(min, v));

VSS.pad = (n) => String(n).padStart(2, "0");

VSS.nowISO = () => new Date().toISOString().split(".")[0];

VSS.nowClock = () => {
  const d = new Date();
  return `${VSS.pad(d.getHours())}:${VSS.pad(d.getMinutes())}:${VSS.pad(d.getSeconds())}`;
};

VSS.nodeCounter = (() => {
  let n = 0;
  return () => ++n;
})();

/* ---- status classification: value against [green, yellow, red] thresholds ---- */
VSS.statusFor = (value, warnAt, critAt, invert = false) => {
  if (!invert) {
    if (value >= critAt) return "critical";
    if (value >= warnAt) return "warning";
    return "healthy";
  } else {
    if (value <= critAt) return "critical";
    if (value <= warnAt) return "warning";
    return "healthy";
  }
};

VSS.statusColor = { healthy: "green", warning: "orange", critical: "red" };

VSS.badgeHTML = (status) => {
  const label = status === "healthy" ? "Healthy" : status === "warning" ? "Warning" : "Critical";
  return `<span class="badge-status badge-${status}"><span class="led led-${VSS.statusColor[status] === "green" ? "green" : VSS.statusColor[status] === "orange" ? "yellow" : "red"}"></span>${label}</span>`;
};

/* ---------------- Toast notifications ---------------- */
VSS.toast = (message, type = "navy") => {
  const container = document.getElementById("toastContainer");
  const id = "t" + Date.now() + Math.random().toString(16).slice(2);
  const bg = { navy: "#0B2545", green: "#1E8E5A", red: "#D64545", orange: "#E08E27" }[type] || "#0B2545";
  const el = document.createElement("div");
  el.className = "toast align-items-center border-0 show mb-2";
  el.id = id;
  el.style.background = bg;
  el.style.color = "#fff";
  el.style.borderRadius = "10px";
  el.innerHTML = `
    <div class="d-flex">
      <div class="toast-body" style="font-size:.85rem;">${message}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>`;
  container.appendChild(el);
  setTimeout(() => el.remove(), 3200);
};

/* ---------------- Gauge (Chart.js doughnut needle-less arc gauge) ---------------- */
VSS.makeGauge = (canvasId, value, min, max, color) => {
  const ctx = document.getElementById(canvasId);
  if (!ctx || typeof Chart === "undefined") return null;
  const pct = VSS.clamp((value - min) / (max - min), 0, 1);
  return new Chart(ctx, {
    type: "doughnut",
    data: {
      datasets: [{
        data: [pct, 1 - pct],
        backgroundColor: [color, "#E4E8EE"],
        borderWidth: 0,
      }],
    },
    options: {
      cutout: "78%",
      circumference: 270,
      rotation: 225,
      animation: { duration: 500 },
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
    },
  });
};

VSS.updateGauge = (chart, value, min, max, color) => {
  if (!chart) return;
  const pct = VSS.clamp((value - min) / (max - min), 0, 1);
  chart.data.datasets[0].data = [pct, 1 - pct];
  chart.data.datasets[0].backgroundColor = [color, chart.data.datasets[0].backgroundColor[1]];
  chart.update("none");
};

/* ---------------- JSON console renderer with syntax coloring ---------------- */
VSS.renderJSON = (targetId, obj) => {
  const el = document.getElementById(targetId);
  if (!el) return;
  const json = JSON.stringify(obj, null, 2);
  const colored = json.replace(/"([^"]+)":/g, '<span class="k">"$1"</span>:');
  el.innerHTML = colored;
};

/* ---------------- Simulation log store (shared across modules) ---------------- */
VSS.logStore = JSON.parse(sessionStorage.getItem("vss_log") || "[]");

VSS.pushLog = (entry) => {
  VSS.logStore.unshift(entry);
  if (VSS.logStore.length > 200) VSS.logStore.pop();
  sessionStorage.setItem("vss_log", JSON.stringify(VSS.logStore));
  document.dispatchEvent(new CustomEvent("vss:log-updated"));
};

window.VSS = VSS;
