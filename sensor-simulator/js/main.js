/* ==========================================================================
   main.js — application shell: routing, clock, theme, simulation engine,
   dashboard KPIs and the digital-twin sync strip.
   ========================================================================== */

(() => {
  const PAGES = ["dashboard", "streetlight", "pipeline", "wastebin", "toilet", "simlog", "settings"];
  const assetStatuses = { streetlight: "healthy", pipeline: "healthy", waste_bin: "healthy", public_toilet: "healthy" };

  /* ---------------- Routing ---------------- */
  const showPage = (page) => {
    PAGES.forEach(p => {
      const section = document.getElementById(`page-${p}`);
      if (section) section.classList.toggle("active", p === page);
    });
    document.querySelectorAll(".nav-link[data-page]").forEach(link => {
      link.classList.toggle("active", link.dataset.page === page);
    });
    const titles = {
      dashboard: "Dashboard Overview", streetlight: "Smart Streetlight", pipeline: "Smart Water Pipeline",
      wastebin: "Smart Waste Bin", toilet: "Smart Public Toilet", simlog: "Simulation Log", settings: "Settings",
    };
    document.getElementById("pageTitle").textContent = titles[page] || "Dashboard";
    location.hash = page;
    if (window.innerWidth < 992) document.getElementById("sidebar").classList.remove("open");

    // lazy-init each module the first time its page is visited
    if (!showPage._inited) showPage._inited = new Set();
    if (!showPage._inited.has(page)) {
      showPage._inited.add(page);
      document.dispatchEvent(new CustomEvent(`vss:init-${page === "wastebin" ? "wastebin" : page}`));
    }
  };

  document.querySelectorAll(".nav-link[data-page]").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      showPage(link.dataset.page);
    });
  });

  document.getElementById("sidebarToggle")?.addEventListener("click", () => {
    document.getElementById("sidebar").classList.toggle("open");
  });

  /* ---------------- Clock ---------------- */
  const clockEl = document.getElementById("liveClock");
  setInterval(() => { if (clockEl) clockEl.textContent = VSS.nowClock(); }, 1000);

  /* ---------------- Theme toggle ---------------- */
  const themeBtn = document.getElementById("themeToggle");
  const applyTheme = (t) => {
    document.documentElement.setAttribute("data-theme", t);
    localStorage.setItem("vss_theme", t);
    themeBtn.innerHTML = t === "dark" ? '<i class="bi bi-sun"></i>' : '<i class="bi bi-moon-stars"></i>';
  };
  applyTheme(localStorage.getItem("vss_theme") || "light");
  themeBtn?.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(current);
  });

  /* ---------------- Simulation engine (auto data every second) ---------------- */
  let simTimer = null;
  const simSwitch = document.getElementById("simSwitch");
  const simStatusText = document.getElementById("simStatusText");

  const tick = () => {
    // rotate through whichever asset modules have been initialised
    Object.values(VSS.assets).forEach(a => {
      // small organic drift instead of full randomize, feels more "live"
      a.generateRandom();
      a.sendData();
    });
  };

  simSwitch?.addEventListener("change", (e) => {
    if (e.target.checked) {
      simStatusText.textContent = "Running";
      simStatusText.parentElement.querySelector(".led").className = "led led-green";
      simTimer = setInterval(tick, 3000);
      VSS.toast("Auto simulation started — broadcasting every 3s", "green");
    } else {
      simStatusText.textContent = "Idle";
      simStatusText.parentElement.querySelector(".led").className = "led led-yellow";
      clearInterval(simTimer);
      VSS.toast("Auto simulation stopped", "orange");
    }
  });

  /* ---------------- Generic per-page action buttons ---------------- */
  document.querySelectorAll("[data-action]").forEach(btn => {
    btn.addEventListener("click", () => {
      const asset = VSS.assets[btn.dataset.assetType];
      if (!asset) return;
      const action = btn.dataset.action;
      if (action === "random") asset.generateRandom();
      if (action === "fault") asset.injectRandomFault();
      if (action === "reset") asset.resetAll();
      if (action === "send") asset.sendData();
    });
  });

  /* ---------------- Dashboard KPIs + digital twin strip ---------------- */
  const kpiEls = {
    streetlight: document.getElementById("kpi-streetlight-status"),
    pipeline: document.getElementById("kpi-pipeline-status"),
    waste_bin: document.getElementById("kpi-wastebin-status"),
    public_toilet: document.getElementById("kpi-toilet-status"),
  };
  const nodeSyncEls = {
    streetlight: document.getElementById("sync-streetlight"),
    pipeline: document.getElementById("sync-pipeline"),
    waste_bin: document.getElementById("sync-wastebin"),
    public_toilet: document.getElementById("sync-toilet"),
  };

  const refreshOverallHealth = () => {
    const statuses = Object.values(assetStatuses);
    const worst = statuses.includes("critical") ? "critical" : statuses.includes("warning") ? "warning" : "healthy";
    const el = document.getElementById("kpi-overall-health");
    if (el) el.innerHTML = VSS.badgeHTML(worst);
  };

  document.addEventListener("vss:asset-status", (e) => {
    const { assetType, status } = e.detail;
    assetStatuses[assetType] = status;
    if (kpiEls[assetType]) kpiEls[assetType].innerHTML = VSS.badgeHTML(status);
    if (nodeSyncEls[assetType]) nodeSyncEls[assetType].textContent = `synced ${VSS.nowClock()}`;
    refreshOverallHealth();
  });

  document.addEventListener("vss:log-updated", () => {
    document.getElementById("kpi-total-events") && (
      document.getElementById("kpi-total-events").textContent = VSS.logStore.length
    );
  });

  /* ---------------- Boot ---------------- */
  window.addEventListener("load", () => {
    setTimeout(() => {
      const loader = document.getElementById("bootLoader");
      if (loader) { loader.style.opacity = "0"; setTimeout(() => loader.remove(), 400); }
    }, 700);

    // Initialise dashboard's own visible modules right away so KPIs aren't empty
    document.dispatchEvent(new Event("vss:init-streetlight"));
    document.dispatchEvent(new Event("vss:init-pipeline"));
    document.dispatchEvent(new Event("vss:init-wastebin"));
    document.dispatchEvent(new Event("vss:init-toilet"));
    showPage._inited = new Set(["streetlight", "pipeline", "wastebin", "toilet"]);

    const startPage = (location.hash || "#dashboard").replace("#", "");
    showPage(PAGES.includes(startPage) ? startPage : "dashboard");
  });
})();
