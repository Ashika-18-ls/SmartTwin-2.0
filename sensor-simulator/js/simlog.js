/* ==========================================================================
   simlog.js — Simulation Log page: renders every transmitted packet
   ========================================================================== */

const VSSLog = {
  render() {
    const tbody = document.getElementById("simLogBody");
    const empty = document.getElementById("simLogEmpty");
    if (!tbody) return;

    const rows = VSS.logStore;
    document.getElementById("simLogCount").textContent = rows.length;

    if (!rows.length) {
      tbody.innerHTML = "";
      empty.classList.remove("d-none");
      return;
    }
    empty.classList.add("d-none");

    tbody.innerHTML = rows.map(r => {
      const dot = { healthy: "var(--green)", warning: "var(--orange)", critical: "var(--red)" }[r.status];
      const sensorSummary = Object.entries(r.payload)
        .filter(([k]) => !["node_id", "asset_type", "timestamp"].includes(k))
        .map(([k, v]) => `${k}: ${typeof v === "boolean" ? (v ? "T" : "F") : v}`)
        .join(" · ");
      return `
        <tr>
          <td class="mono text-muted-2">${r.timestamp}</td>
          <td class="mono fw-semibold">${r.nodeId}</td>
          <td class="text-capitalize">${r.assetType.replace("_", " ")}</td>
          <td class="mono" style="max-width:340px;">${sensorSummary}</td>
          <td>${r.fault}</td>
          <td>${VSS.badgeHTML(r.status)}</td>
          <td><span class="console-dot" style="background:${dot}"></span></td>
        </tr>`;
    }).join("");
  },

  clear() {
    VSS.logStore = [];
    sessionStorage.removeItem("vss_log");
    this.render();
    VSS.toast("Simulation log cleared", "navy");
  },
};

document.addEventListener("vss:log-updated", () => VSSLog.render());
document.addEventListener("vss:init-simlog", () => VSSLog.render());
