import "./styles.css";

const state = {
  data: null,
  loading: true,
  error: null,
  selectedMarket: "",
  selectedPeriod: "",
};

const app = document.querySelector("#app");

function currencyMillions(value) {
  if (value == null) return "n/a";
  return `$${(value / 1000).toLocaleString(undefined, {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  })}M`;
}

function percent(value, digits = 1) {
  if (value == null) return "n/a";
  return `${value.toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  })}%`;
}

function number(value, digits = 1) {
  if (value == null) return "n/a";
  return value.toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });
}

function deltaClass(value) {
  if (value == null || Math.abs(value) < 0.05) return "neutral";
  return value > 0 ? "positive" : "negative";
}

function icon(name) {
  const icons = {
    sales: "M4 15h3V8H4v7Zm6 0h3V4h-3v11Zm6 0h3v-5h-3v5Z",
    share: "M11 3v8H3c.5-4.2 3.8-7.5 8-8Zm2 0c4.2.5 7.5 3.8 8 8h-8V3Zm0 10h8c-.5 4.2-3.8 7.5-8 8v-8Zm-2 8c-4.2-.5-7.5-3.8-8-8h8v8Z",
    price: "M12 3 4 7v10l8 4 8-4V7l-8-4Zm0 2.2L17.6 8 12 10.8 6.4 8 12 5.2ZM6 9.6l5 2.5v6.6l-5-2.5V9.6Zm7 9.1v-6.6l5-2.5v6.6l-5 2.5Z",
    promo: "M7 3h10l4 4v10l-4 4H7l-4-4V7l4-4Zm.8 2L5 7.8v8.4L7.8 19h8.4l2.8-2.8V7.8L16.2 5H7.8Zm1.7 11.5 7-7 1.4 1.4-7 7-1.4-1.4ZM10 8a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm5 5a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z",
  };
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${icons[name]}"></path></svg>`;
}

function kpiTile(title, value, delta, iconName, caption) {
  return `
    <article class="kpi">
      <div class="kpi-icon">${icon(iconName)}</div>
      <div>
        <span>${title}</span>
        <strong>${value}</strong>
        <small class="${deltaClass(delta)}">${caption}</small>
      </div>
    </article>
  `;
}

function selectControl(id, label, options, value) {
  return `
    <label class="control">
      <span>${label}</span>
      <select id="${id}">
        ${options.map((option) => `<option value="${escapeHtml(option)}" ${option === value ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}
      </select>
    </label>
  `;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderBarRows(rows, valueKey, labelKey = "product") {
  const max = Math.max(...rows.map((row) => row[valueKey] || 0), 1);
  return rows
    .map((row, index) => {
      const width = Math.max(3, ((row[valueKey] || 0) / max) * 100);
      return `
        <div class="bar-row">
          <span class="rank">${index + 1}</span>
          <span class="bar-label">${escapeHtml(row[labelKey])}</span>
          <div class="bar-track"><i style="width:${width}%"></i></div>
          <strong>${currencyMillions(row[valueKey])}</strong>
        </div>
      `;
    })
    .join("");
}

function comparisonTable(rows) {
  if (!rows.length) return emptyPanel("No comparison rows for this filter.");
  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Segment</th>
            <th>$ Sales</th>
            <th>$ Chg YA</th>
            <th>$ Share</th>
            <th>Price Chg</th>
            <th>Promo Chg</th>
            <th>ACV Chg</th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              (row) => `
                <tr>
                  <td>${escapeHtml(row.product)}</td>
                  <td>${currencyMillions(row.dollarSales000)}</td>
                  <td class="${deltaClass(row.dollarPctChangeYa)}">${percent(row.dollarPctChangeYa)}</td>
                  <td>${percent(row.dollarShareProduct)}</td>
                  <td class="${deltaClass(row.avgUnitsPriceChangeYa)}">${number(row.avgUnitsPriceChangeYa)}</td>
                  <td class="${deltaClass(row.soldOnPromoChangeYaPct)}">${number(row.soldOnPromoChangeYaPct)}</td>
                  <td class="${deltaClass(row.acvPctChangeYa)}">${percent(row.acvPctChangeYa)}</td>
                </tr>
              `,
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function marketTable(rows) {
  if (!rows.length) return emptyPanel("No market rows for this period.");
  return `
    <div class="table-wrap market-table">
      <table>
        <thead>
          <tr>
            <th>Market / Banner</th>
            <th>$ Sales</th>
            <th>$ Chg YA</th>
            <th>Share</th>
            <th>ACV</th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              (row) => `
                <tr>
                  <td>${escapeHtml(row.market)}</td>
                  <td>${currencyMillions(row.dollarSales000)}</td>
                  <td class="${deltaClass(row.dollarPctChangeYa)}">${percent(row.dollarPctChangeYa)}</td>
                  <td>${percent(row.dollarShareProduct)}</td>
                  <td>${percent(row.acvPct)}</td>
                </tr>
              `,
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function emptyPanel(message) {
  return `<div class="empty">${escapeHtml(message)}</div>`;
}

function render() {
  if (state.loading) {
    app.innerHTML = `
      <main class="shell">
        <section class="topbar">
          <div>
            <p>Tim Hortons CPG</p>
            <h1>Master Insights Dashboard</h1>
          </div>
        </section>
        <section class="loading-grid">
          <div></div><div></div><div></div><div></div>
        </section>
      </main>
    `;
    return;
  }

  if (state.error) {
    app.innerHTML = `
      <main class="shell">
        <section class="topbar">
          <div>
            <p>Tim Hortons CPG</p>
            <h1>Master Insights Dashboard</h1>
          </div>
        </section>
        <section class="error-panel">
          <strong>Dashboard data unavailable</strong>
          <span>${escapeHtml(state.error)}</span>
        </section>
      </main>
    `;
    return;
  }

  const data = state.data;
  const { filters, kpis } = data;

  if (!data.counts.loadedRows) {
    app.innerHTML = `
      <main class="shell">
        <section class="topbar">
          <div>
            <p>Tim Hortons CPG</p>
            <h1>Master Insights Dashboard</h1>
          </div>
          <div class="status-dot">Connected</div>
        </section>
        <section class="empty-state">
          <strong>No scorecard rows imported yet</strong>
          <span>Run the Nielsen pull importer, then refresh this page.</span>
        </section>
      </main>
    `;
    return;
  }

  app.innerHTML = `
    <main class="shell">
      <section class="topbar">
        <div>
          <p>Tim Hortons CPG</p>
          <h1>Master Insights Dashboard</h1>
        </div>
        <div class="meta">
          <span>${data.counts.loadedRows.toLocaleString()} rows</span>
          <span>${data.latestImport?.status || "live"}</span>
        </div>
      </section>

      <section class="toolbar">
        ${selectControl("market", "Market / Customer / Banner", filters.markets, filters.market)}
        ${selectControl("period", "Time Frame", filters.periods, filters.period)}
      </section>

      <section class="kpi-grid">
        ${kpiTile("Tim Hortons Sales", currencyMillions(kpis.tims?.dollarSales000), kpis.tims?.dollarPctChangeYa, "sales", `${percent(kpis.tims?.dollarPctChangeYa)} vs YA`)}
        ${kpiTile("Dollar Share", percent(kpis.tims?.dollarShareProduct), kpis.tims?.dollarShareChangeYa, "share", `${number(kpis.tims?.dollarShareChangeYa)} pts vs YA`)}
        ${kpiTile("Avg Unit Price", `$${number(kpis.tims?.avgUnitsPrice, 2)}`, kpis.tims?.avgUnitsPriceChangeYa, "price", `${number(kpis.tims?.avgUnitsPriceChangeYa)} vs YA`)}
        ${kpiTile("Promotion Mix", percent(kpis.tims?.soldOnPromoPct), kpis.tims?.soldOnPromoChangeYaPct, "promo", `${number(kpis.tims?.soldOnPromoChangeYaPct)} pts vs YA`)}
      </section>

      <section class="grid two">
        <article class="panel">
          <header><h2>Category Scorecard</h2><span>${escapeHtml(filters.market)}</span></header>
          ${comparisonTable(data.comparison)}
        </article>
        <article class="panel">
          <header><h2>Top Brand Sales</h2><span>${escapeHtml(filters.period)}</span></header>
          <div class="bars">${renderBarRows(data.brandLeaders, "dollarSales000") || emptyPanel("No brand rows for this filter.")}</div>
        </article>
      </section>

      <section class="grid two lower">
        <article class="panel">
          <header><h2>Tim Hortons Formats</h2><span>Sales by product group</span></header>
          <div class="bars accent">${renderBarRows(data.formatBreakdown, "dollarSales000") || emptyPanel("No Tim Hortons format rows for this filter.")}</div>
        </article>
        <article class="panel">
          <header><h2>Market Ranking</h2><span>Tim Hortons by selected period</span></header>
          ${marketTable(data.marketTable)}
        </article>
      </section>
    </main>
  `;

  document.querySelector("#market")?.addEventListener("change", (event) => {
    state.selectedMarket = event.target.value;
    loadDashboard();
  });
  document.querySelector("#period")?.addEventListener("change", (event) => {
    state.selectedPeriod = event.target.value;
    loadDashboard();
  });
}

async function loadDashboard() {
  state.loading = !state.data;
  state.error = null;
  render();

  const params = new URLSearchParams();
  if (state.selectedMarket) params.set("market", state.selectedMarket);
  if (state.selectedPeriod) params.set("period", state.selectedPeriod);

  try {
    const query = params.toString();
    const response = await fetch(`/api/dashboard${query ? `?${query}` : ""}`);
    const contentType = response.headers.get("content-type") || "";
    const payload = contentType.includes("application/json")
      ? await response.json()
      : { detail: await response.text() };
    if (!response.ok) {
      throw new Error(payload.detail || payload.error || response.statusText);
    }
    state.data = payload;
    state.selectedMarket = payload.filters.market;
    state.selectedPeriod = payload.filters.period;
  } catch (error) {
    state.error = error instanceof Error ? error.message : String(error);
  } finally {
    state.loading = false;
    render();
  }
}

loadDashboard();
