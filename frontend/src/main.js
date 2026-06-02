import "./styles.css";

const VIEW_CONFIGS = [
  {
    id: "overview",
    label: "Executive Overview",
    source: "Dashboard",
    defaultPeriod: "Rolling 26 w/e 26/07/25",
    defaultMarket: "LCL NATIONAL SUPERMARKETS DIV",
    defaultBenchmarkMarket: "LCL NATIONAL",
    controls: ["market", "benchmarkMarket", "period"],
  },
  {
    id: "categorySummary",
    label: "Category Summary",
    source: "Summary Coffee Category",
    defaultPeriod: "Rolling 52 w/e 26/07/25",
    defaultMarket: "NATIONAL EX NFLD GDM",
    controls: ["market", "period"],
  },
  {
    id: "categoryDetail",
    label: "Category Detail",
    source: "Coffee Category",
    defaultPeriod: "Jul 25 - 4 w/e 26/07/25",
    defaultMarket: "NATIONAL EX NFLD GDM",
    controls: ["market", "period", "categorySource"],
  },
  {
    id: "customerSummary",
    label: "Customer Summary",
    source: "Summary Coffee Customer",
    defaultPeriod: "Jul 25 - 4 w/e 26/07/25",
    defaultProduct: "Tim Hortons",
    controls: ["product", "period"],
  },
  {
    id: "customerDetail",
    label: "Customer Detail",
    source: "Coffee Customer",
    defaultPeriod: "Jul 25 - 4 w/e 26/07/25",
    defaultProduct: "Tim Hortons Instant Regular",
    controls: ["product", "period"],
  },
];

const SOURCE_OPTIONS = [
  { value: "all", label: "All Pulls" },
  { value: "topline_brands", label: "Topline Brands" },
  { value: "rg", label: "R&G" },
  { value: "single_serve", label: "Single Serve" },
  { value: "instant", label: "Instant" },
];

const SOURCE_LABELS = {
  topline_brands: "Topline Brands",
  rg: "R&G",
  single_serve: "Single Serve",
  instant: "Instant",
};

const CATEGORY_SUMMARY_ROWS = [
  { group: "Total Coffee", label: "Packaged Coffee & Instant Coffee", product: "Packaged Coffee & Instant Coffee", sourcePullType: "topline_brands" },
  { group: "Total Coffee", label: "Packaged Coffee", product: "Packaged Coffee", sourcePullType: "topline_brands" },
  { group: "Formats", label: "R&G", product: "R&G", sourcePullType: "rg" },
  { group: "Formats", label: "Bag", product: "Bag", sourcePullType: "rg" },
  { group: "Formats", label: "Can", product: "Can", sourcePullType: "rg" },
  { group: "Formats", label: "Club Format R&G", product: "Club Format R&G", sourcePullType: "rg" },
  { group: "Formats", label: "Single Serve", product: "Single Serve", sourcePullType: "single_serve" },
  { group: "Formats", label: "K Cup", product: "K Cup", sourcePullType: "single_serve" },
  { group: "Formats", label: "Tassimo", product: "Tassimo", sourcePullType: "single_serve" },
  { group: "Formats", label: "Caps", product: "Caps", sourcePullType: "single_serve" },
  { group: "Formats", label: "Instant Coffee", product: "Instant Coffee", sourcePullType: "instant" },
  { group: "Formats", label: "Instant Regular", product: "Instant Regular", sourcePullType: "instant" },
  { group: "Formats", label: "Instant Grand", product: "Instant Grand", sourcePullType: "instant" },
  { group: "Brands", label: "Tim Hortons", product: "Tim Hortons", sourcePullType: "topline_brands" },
  { group: "Brands", label: "Tim Hortons R&G", product: "Tim Hortons R&G", sourcePullType: "rg" },
  { group: "Brands", label: "Tim Hortons Single Serve", product: "Tim Hortons Single Serve", sourcePullType: "single_serve" },
  { group: "Brands", label: "Tim Hortons Instant Coffee", product: "Tim Hortons Instant Coffee", sourcePullType: "instant" },
  { group: "Brands", label: "Private Label", product: "Private Label", sourcePullType: "topline_brands" },
  { group: "Brands", label: "Starbucks", product: "Starbucks", sourcePullType: "topline_brands" },
  { group: "Brands", label: "McCafe", product: "McCafe", sourcePullType: "topline_brands" },
  { group: "Brands", label: "All Other Brands", product: "All Other Brands", sourcePullType: "topline_brands" },
];

const CUSTOMER_SUMMARY_MARKETS = [
  "NATIONAL EX NFLD GDM",
  "NATIONAL CONVENTIONAL GDM",
  "NATIONAL DISCOUNT GDM",
  "LCL NATIONAL",
  "SOBEYS INC NATIONAL INCL NFLD EX LAWTONS",
  "METRO INC GROCERY BANNERS",
  "CANADIAN TIRE NATIONAL",
  "SAVE ON FOODS WEST",
  "FEDERATED COOP",
];

const SUMMARY_COLUMNS = [
  { key: "dollarShareProduct", label: "$ Share", format: percent },
  { key: "dollarShareChangeYa", label: "Share Chg", format: pointChange },
  { key: "dollarSales000", label: "$ ('000)", format: money000 },
  { key: "dollarPctChangeYa", label: "$ % Chg YA", format: percent },
  { key: "units000", label: "Units ('000)", format: valueNumber },
  { key: "unitsPctChangeYa", label: "Units % Chg YA", format: percent },
  { key: "avgUnitsPrice", label: "Avg Unit Price", format: currency },
  { key: "avgUnitsPriceChangeYa", label: "Unit Price Chg", format: pointChange },
  { key: "soldOnPromoPct", label: "Promo %", format: percent },
  { key: "soldOnPromoChangeYaPct", label: "Promo Chg", format: pointChange },
  { key: "acvPct", label: "ACV %", format: percent },
  { key: "acvPctChangeYa", label: "ACV Chg", format: percent },
  { key: "itemsPerStore", label: "Items / Store", format: valueNumber },
  { key: "dollarSppdp", label: "$ SPPDP", format: valueNumber },
  { key: "dollarSppdpPctChangeYa", label: "$ SPPDP % Chg", format: percent },
];

const DETAIL_COLUMNS = [
  { key: "dollarShareProduct", label: "$ Share", format: percent },
  { key: "dollarShareChangeYa", label: "Share Chg", format: pointChange },
  { key: "dollarSales000", label: "$ ('000)", format: money000 },
  { key: "dollarPctChangeYa", label: "$ % Chg YA", format: percent },
  { key: "pounds000", label: "Pounds ('000)", format: valueNumber },
  { key: "poundsPctChangeYa", label: "Pounds % Chg", format: percent },
  { key: "units000", label: "Units ('000)", format: valueNumber },
  { key: "unitsPctChangeYa", label: "Units % Chg", format: percent },
  { key: "avgPoundsPrice", label: "Avg Pounds Price", format: currency },
  { key: "avgUnitsPrice", label: "Avg Units Price", format: currency },
  { key: "avgUnitsPriceChangeYa", label: "Avg Units Price Chg", format: pointChange },
  { key: "noPromoUnitsPrice", label: "No Promo Price", format: currency },
  { key: "anyPromoUnitsPrice", label: "Any Promo Price", format: currency },
  { key: "soldOnPromoPct", label: "% Sold on Promo", format: percent },
  { key: "soldOnPromoChangeYaPct", label: "Promo Chg", format: pointChange },
  { key: "displayOnlyUnits", label: "Display Units", format: valueNumber },
  { key: "featureOnlyUnits", label: "Feature Units", format: valueNumber },
  { key: "priceDecreaseOnlyUnits", label: "Price Decr Units", format: valueNumber },
  { key: "acvPct", label: "% ACV", format: percent },
  { key: "acvPctChangeYa", label: "ACV Chg", format: percent },
  { key: "itemsPerStore", label: "Items / Store", format: valueNumber },
  { key: "dollarSppdp", label: "$ SPPDP", format: valueNumber },
  { key: "dollarSppdpPctChangeYa", label: "$ SPPDP % Chg", format: percent },
];

const state = {
  activeView: "overview",
  data: null,
  loading: true,
  error: null,
  viewFilters: {},
};

const app = document.querySelector("#app");

function viewConfig(id = state.activeView) {
  return VIEW_CONFIGS.find((view) => view.id === id) || VIEW_CONFIGS[0];
}

function defaultFilters(config) {
  return {
    market: config.defaultMarket || "LCL NATIONAL SUPERMARKETS DIV",
    benchmarkMarket: config.defaultBenchmarkMarket || "LCL NATIONAL",
    period: config.defaultPeriod || "",
    product: config.defaultProduct || "Tim Hortons",
    categorySource: "all",
  };
}

function activeFilters() {
  if (!state.viewFilters[state.activeView]) {
    state.viewFilters[state.activeView] = defaultFilters(viewConfig());
  }
  return state.viewFilters[state.activeView];
}

function valueNumber(value, digits = 1) {
  if (value == null) return "n/a";
  return value.toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });
}

function pointChange(value) {
  if (value == null) return "n/a";
  return valueNumber(value, 1);
}

function currency(value, digits = 2) {
  if (value == null) return "n/a";
  return `$${value.toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  })}`;
}

function money000(value) {
  if (value == null) return "n/a";
  return `$${value.toLocaleString(undefined, {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  })}`;
}

function moneyMillions(value) {
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

function indexValue(value) {
  if (value == null) return "n/a";
  return valueNumber(value, 1);
}

function deltaClass(value) {
  if (value == null || Math.abs(value) < 0.05) return "neutral";
  return value > 0 ? "positive" : "negative";
}

function icon(name) {
  const icons = {
    overview: "M4 5h7v6H4V5Zm9 0h7v4h-7V5ZM4 13h7v6H4v-6Zm9-2h7v8h-7v-8Z",
    summary: "M5 4h14v3H5V4Zm0 5h14v3H5V9Zm0 5h9v3H5v-3Z",
    detail: "M4 5h16v2H4V5Zm0 4h16v2H4V9Zm0 4h16v2H4v-2Zm0 4h16v2H4v-2Z",
    customer: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8c.6-3.5 3.5-6 7-6s6.4 2.5 7 6H5Z",
    trend: "M4 17h16v2H4v-2Zm1-3 5-5 4 4 5-7 1.6 1.2-6.4 9-4.1-4.1-3.7 3.7L5 14Z",
    sales: "M4 15h3V8H4v7Zm6 0h3V4h-3v11Zm6 0h3v-5h-3v5Z",
    share: "M11 3v8H3c.5-4.2 3.8-7.5 8-8Zm2 0c4.2.5 7.5 3.8 8 8h-8V3Zm0 10h8c-.5 4.2-3.8 7.5-8 8v-8Zm-2 8c-4.2-.5-7.5-3.8-8-8h8v8Z",
    price: "M12 3 4 7v10l8 4 8-4V7l-8-4Zm0 2.2L17.6 8 12 10.8 6.4 8 12 5.2ZM6 9.6l5 2.5v6.6l-5-2.5V9.6Zm7 9.1v-6.6l5-2.5v6.6l-5 2.5Z",
    promo: "M7 3h10l4 4v10l-4 4H7l-4-4V7l4-4Zm1 2L5 8v8l3 3h8l3-3V8l-3-3H8Zm1.5 11.5 7-7 1.4 1.4-7 7-1.4-1.4ZM10 8a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm5 5a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z",
  };
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${icons[name]}"></path></svg>`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function render() {
  const config = viewConfig();

  if (state.loading) {
    app.innerHTML = appShell(config, loadingState());
    bindInteractions();
    return;
  }

  if (state.error) {
    app.innerHTML = appShell(config, errorState(state.error));
    bindInteractions();
    return;
  }

  if (!state.data?.counts?.loadedRows) {
    app.innerHTML = appShell(config, emptyState());
    bindInteractions();
    return;
  }

  app.innerHTML = appShell(config, renderActiveView());
  bindInteractions();
}

function appShell(config, content) {
  return `
    <div class="app-frame">
      <aside class="sidebar">
        <div class="brand">
          <span>Tim Hortons CPG</span>
          <strong>Insights Viewer</strong>
        </div>
        <nav class="nav-list" aria-label="Dashboard views">
          ${VIEW_CONFIGS.map(navItem).join("")}
        </nav>
        <div class="sidebar-meta">
          <span>${state.data?.counts?.loadedRows?.toLocaleString() || "0"} rows</span>
          <span>${escapeHtml(state.data?.latestImport?.status || "connected")}</span>
        </div>
      </aside>
      <main class="workspace">
        <header class="topbar">
          <div>
            <p>${escapeHtml(config.source)}</p>
            <h1>${escapeHtml(config.label)}</h1>
          </div>
          <div class="meta">
            <span>${escapeHtml(state.data?.filters?.period || activeFilters().period || "")}</span>
            <span>${state.data?.counts?.apiRowsLoaded?.toLocaleString() || "live"} API rows</span>
          </div>
        </header>
        ${content}
      </main>
    </div>
  `;
}

function navItem(config) {
  const iconName = config.id.includes("customer")
    ? "customer"
    : config.id.includes("Detail") || config.id.includes("detail")
      ? "detail"
      : config.id === "overview"
        ? "overview"
        : "summary";
  return `
    <button class="nav-item ${config.id === state.activeView ? "active" : ""}" type="button" data-view="${config.id}">
      ${icon(iconName)}
      <span>${escapeHtml(config.label)}</span>
    </button>
  `;
}

function renderActiveView() {
  const config = viewConfig();
  const filters = state.data.filters;
  const controls = renderToolbar(config, filters);

  if (config.id === "overview") {
    return `${controls}${renderOverview()}`;
  }
  if (config.id === "categorySummary") {
    return `${controls}${renderCategorySummary()}`;
  }
  if (config.id === "categoryDetail") {
    return `${controls}${renderCategoryDetail()}`;
  }
  if (config.id === "customerSummary") {
    return `${controls}${renderCustomerSummary()}`;
  }
  return `${controls}${renderCustomerDetail()}`;
}

function renderToolbar(config, filters) {
  return `
    <section class="toolbar">
      ${config.controls.includes("market") ? selectControl("market", "Market / Customer / Banner", filters.markets, filters.market) : ""}
      ${config.controls.includes("benchmarkMarket") ? selectControl("benchmarkMarket", "Benchmark", filters.markets, filters.benchmarkMarket) : ""}
      ${config.controls.includes("product") ? selectControl("product", "Manufacturer / Brand / Pack Group", filters.products, filters.product) : ""}
      ${config.controls.includes("period") ? selectControl("period", "Time Frame", filters.periods, filters.period) : ""}
      ${config.controls.includes("categorySource") ? optionControl("categorySource", "Raw Pull", SOURCE_OPTIONS, activeFilters().categorySource) : ""}
    </section>
  `;
}

function selectControl(id, label, options, value) {
  return `
    <label class="control">
      <span>${escapeHtml(label)}</span>
      <select id="${id}">
        ${options.map((option) => `<option value="${escapeHtml(option)}" ${option === value ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}
      </select>
    </label>
  `;
}

function optionControl(id, label, options, value) {
  return `
    <label class="control compact">
      <span>${escapeHtml(label)}</span>
      <select id="${id}">
        ${options.map((option) => `<option value="${escapeHtml(option.value)}" ${option.value === value ? "selected" : ""}>${escapeHtml(option.label)}</option>`).join("")}
      </select>
    </label>
  `;
}

function renderOverview() {
  const data = state.data;
  const overview = data.views.overview;
  const tims = data.kpis.tims;

  return `
    <section class="kpi-grid">
      ${kpiTile("Tim Hortons Sales", moneyMillions(tims?.dollarSales000), tims?.dollarPctChangeYa, "sales", `${percent(tims?.dollarPctChangeYa)} vs YA`)}
      ${kpiTile("Dollar Share", percent(tims?.dollarShareProduct), tims?.dollarShareChangeYa, "share", `${pointChange(tims?.dollarShareChangeYa)} pts vs YA`)}
      ${kpiTile("Avg Unit Price", currency(tims?.avgUnitsPrice), tims?.avgUnitsPriceChangeYa, "price", `${pointChange(tims?.avgUnitsPriceChangeYa)} vs YA`)}
      ${kpiTile("Promotion Mix", percent(tims?.soldOnPromoPct), tims?.soldOnPromoChangeYaPct, "promo", `${pointChange(tims?.soldOnPromoChangeYaPct)} pts vs YA`)}
    </section>
    <section class="panel">
      <header>
        <h2>${escapeHtml(overview.title)}</h2>
        <span>${escapeHtml(overview.targetMarket)} vs ${escapeHtml(overview.benchmarkMarket)}</span>
      </header>
      ${overviewTable(overview.sections)}
    </section>
    <section class="grid two lower">
      ${panel("Top Brand Sales", state.data.filters.period, `<div class="bars">${renderBarRows(state.data.brandLeaders, "dollarSales000")}</div>`)}
      ${panel("Tim Hortons Formats", state.data.filters.market, `<div class="bars accent">${renderBarRows(state.data.formatBreakdown, "dollarSales000")}</div>`)}
    </section>
  `;
}

function kpiTile(title, value, delta, iconName, caption) {
  return `
    <article class="kpi">
      <div class="kpi-icon">${icon(iconName)}</div>
      <div>
        <span>${escapeHtml(title)}</span>
        <strong>${escapeHtml(value)}</strong>
        <small class="${deltaClass(delta)}">${escapeHtml(caption)}</small>
      </div>
    </article>
  `;
}

function overviewTable(sections) {
  const rows = sections.flatMap((section) =>
    section.rows.map((row) => ({
      section: section.title,
      ...row,
    })),
  );

  return `
    <div class="table-wrap">
      <table class="dense-table overview-table">
        <thead>
          <tr>
            <th>Section</th>
            <th>Segment</th>
            <th>Target Share</th>
            <th>Benchmark Share</th>
            <th>Index</th>
            <th>Target $</th>
            <th>Target $ Chg</th>
            <th>Benchmark $</th>
            <th>Benchmark $ Chg</th>
            <th>Delta</th>
            <th>Target Price Chg</th>
            <th>Target Promo Chg</th>
            <th>Target ACV Chg</th>
            <th>Benchmark Price Chg</th>
            <th>Benchmark Promo Chg</th>
            <th>Benchmark ACV Chg</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map(overviewTableRow).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function overviewTableRow(row) {
  const m = row.metrics;
  return `
    <tr>
      <td>${escapeHtml(row.section)}</td>
      <td>${escapeHtml(row.label)}</td>
      <td>${percent(m.targetShare)}</td>
      <td>${percent(m.benchmarkShare)}</td>
      <td class="${deltaClass((m.shareIndex || 0) - 100)}">${indexValue(m.shareIndex)}</td>
      <td>${money000(m.targetSales000)}</td>
      <td class="${deltaClass(m.targetSalesPctChangeYa)}">${percent(m.targetSalesPctChangeYa)}</td>
      <td>${money000(m.benchmarkSales000)}</td>
      <td class="${deltaClass(m.benchmarkSalesPctChangeYa)}">${percent(m.benchmarkSalesPctChangeYa)}</td>
      <td class="${deltaClass(m.salesPctChangeDelta)}">${pointChange(m.salesPctChangeDelta)}</td>
      <td class="${deltaClass(m.targetAvgUnitsPriceChangeYa)}">${pointChange(m.targetAvgUnitsPriceChangeYa)}</td>
      <td class="${deltaClass(m.targetSoldOnPromoChangeYaPct)}">${pointChange(m.targetSoldOnPromoChangeYaPct)}</td>
      <td class="${deltaClass(m.targetAcvPctChangeYa)}">${percent(m.targetAcvPctChangeYa)}</td>
      <td class="${deltaClass(m.benchmarkAvgUnitsPriceChangeYa)}">${pointChange(m.benchmarkAvgUnitsPriceChangeYa)}</td>
      <td class="${deltaClass(m.benchmarkSoldOnPromoChangeYaPct)}">${pointChange(m.benchmarkSoldOnPromoChangeYaPct)}</td>
      <td class="${deltaClass(m.benchmarkAcvPctChangeYa)}">${percent(m.benchmarkAcvPctChangeYa)}</td>
    </tr>
  `;
}

function renderCategorySummary() {
  const rows = categorySummaryRows();
  return `
    <section class="view-strip">
      ${metricPill("Market", state.data.filters.market)}
      ${metricPill("Rows", rows.length.toLocaleString())}
      ${metricPill("Source", "Raw Nielsen tabs")}
    </section>
    <section class="panel">
      <header>
        <h2>Category Scorecard</h2>
        <span>${escapeHtml(state.data.filters.market)} | ${escapeHtml(state.data.filters.period)}</span>
      </header>
      ${summaryTable(rows, "Product / Pack Group", true)}
    </section>
  `;
}

function categorySummaryRows() {
  const rows = state.data.views.category.rows;
  const used = new Set();
  return CATEGORY_SUMMARY_ROWS.map((spec) => {
    const row = rows.find((candidate) => candidate.product === spec.product && candidate.sourcePullType === spec.sourcePullType);
    if (!row) return null;
    const key = `${row.product}|${row.sourcePullType}`;
    if (used.has(key)) return null;
    used.add(key);
    return { ...row, displayLabel: spec.label, displayGroup: spec.group };
  }).filter(Boolean);
}

function renderCategoryDetail() {
  const source = activeFilters().categorySource;
  const rows = state.data.views.category.rows.filter((row) => source === "all" || row.sourcePullType === source);
  return `
    <section class="view-strip">
      ${metricPill("Market", state.data.filters.market)}
      ${metricPill("Rows", rows.length.toLocaleString())}
      ${metricPill("Pull", SOURCE_OPTIONS.find((option) => option.value === source)?.label || "All Pulls")}
    </section>
    <section class="panel">
      <header>
        <h2>Category Detail</h2>
        <span>${escapeHtml(state.data.filters.market)} | ${escapeHtml(state.data.filters.period)}</span>
      </header>
      ${detailTable(rows, "Product / Pack Group", true)}
    </section>
  `;
}

function renderCustomerSummary() {
  const rows = customerSummaryRows();
  return `
    <section class="view-strip">
      ${metricPill("Product", state.data.filters.product)}
      ${metricPill("Rows", rows.length.toLocaleString())}
      ${metricPill("Markets", state.data.filters.markets.length.toLocaleString())}
    </section>
    <section class="panel">
      <header>
        <h2>Customer Scorecard</h2>
        <span>${escapeHtml(state.data.filters.product)} | ${escapeHtml(state.data.filters.period)}</span>
      </header>
      ${summaryTable(rows, "Market / Customer / Banner", false)}
    </section>
  `;
}

function customerSummaryRows() {
  const rows = state.data.views.customer.rows;
  return CUSTOMER_SUMMARY_MARKETS.map((market) => rows.find((row) => row.market === market)).filter(Boolean);
}

function renderCustomerDetail() {
  const rows = state.data.views.customer.rows;
  return `
    <section class="view-strip">
      ${metricPill("Product", state.data.filters.product)}
      ${metricPill("Rows", rows.length.toLocaleString())}
      ${metricPill("Period", state.data.filters.period)}
    </section>
    <section class="panel">
      <header>
        <h2>Customer Detail</h2>
        <span>${escapeHtml(state.data.filters.product)} | ${escapeHtml(state.data.filters.period)}</span>
      </header>
      ${detailTable(rows, "Market / Customer / Banner", false)}
    </section>
  `;
}

function summaryTable(rows, labelHeader, showGroup) {
  if (!rows.length) return emptyPanel("No rows for this filter.");
  return `
    <div class="table-wrap">
      <table class="dense-table ${showGroup ? "grouped-table" : ""}">
        <thead>
          <tr>
            ${showGroup ? "<th>Group</th>" : ""}
            <th>${escapeHtml(labelHeader)}</th>
            ${SUMMARY_COLUMNS.map((column) => `<th>${escapeHtml(column.label)}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${rows.map((row) => summaryTableRow(row, showGroup)).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function summaryTableRow(row, showGroup) {
  return `
    <tr>
      ${showGroup ? `<td>${escapeHtml(row.displayGroup || SOURCE_LABELS[row.sourcePullType] || "")}</td>` : ""}
      <td>${escapeHtml(row.displayLabel || row.product || row.market)}</td>
      ${SUMMARY_COLUMNS.map((column) => metricCell(row[column.key], column.format)).join("")}
    </tr>
  `;
}

function detailTable(rows, labelHeader, showSource) {
  if (!rows.length) return emptyPanel("No detail rows for this filter.");
  return `
    <div class="table-wrap">
      <table class="dense-table detail-table ${showSource ? "source-table" : ""}">
        <thead>
          <tr>
            <th>${escapeHtml(labelHeader)}</th>
            ${showSource ? "<th>Pull</th>" : ""}
            ${DETAIL_COLUMNS.map((column) => `<th>${escapeHtml(column.label)}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${rows.map((row) => detailTableRow(row, showSource)).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function detailTableRow(row, showSource) {
  return `
    <tr>
      <td>${escapeHtml(row.product || row.market)}</td>
      ${showSource ? `<td>${escapeHtml(SOURCE_LABELS[row.sourcePullType] || row.sourcePullType || "")}</td>` : ""}
      ${DETAIL_COLUMNS.map((column) => metricCell(row[column.key], column.format)).join("")}
    </tr>
  `;
}

function metricCell(value, formatter) {
  return `<td class="${deltaClass(value)}">${escapeHtml(formatter(value))}</td>`;
}

function metricPill(label, value) {
  return `
    <div class="metric-pill">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </div>
  `;
}

function panel(title, subtitle, body) {
  return `
    <article class="panel">
      <header>
        <h2>${escapeHtml(title)}</h2>
        <span>${escapeHtml(subtitle)}</span>
      </header>
      ${body}
    </article>
  `;
}

function renderBarRows(rows, valueKey, labelKey = "product") {
  if (!rows.length) return emptyPanel("No rows for this filter.");
  const max = Math.max(...rows.map((row) => row[valueKey] || 0), 1);
  return rows
    .map((row, index) => {
      const width = Math.max(3, ((row[valueKey] || 0) / max) * 100);
      return `
        <div class="bar-row">
          <span class="rank">${index + 1}</span>
          <span class="bar-label">${escapeHtml(row[labelKey])}</span>
          <div class="bar-track"><i style="width:${width}%"></i></div>
          <strong>${moneyMillions(row[valueKey])}</strong>
        </div>
      `;
    })
    .join("");
}

function loadingState() {
  return `
    <section class="loading-grid">
      <div></div><div></div><div></div><div></div>
      <div class="wide"></div><div class="wide"></div>
    </section>
  `;
}

function emptyState() {
  return `
    <section class="empty-state">
      <strong>No scorecard rows imported yet</strong>
      <span>Run the Nielsen pull importer, then refresh this page.</span>
    </section>
  `;
}

function errorState(message) {
  return `
    <section class="error-panel">
      <strong>Dashboard data unavailable</strong>
      <span>${escapeHtml(message)}</span>
    </section>
  `;
}

function emptyPanel(message) {
  return `<div class="empty">${escapeHtml(message)}</div>`;
}

function bindInteractions() {
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => {
      const nextView = button.dataset.view;
      if (!nextView || nextView === state.activeView) return;
      state.activeView = nextView;
      activeFilters();
      state.loading = true;
      loadDashboard();
    });
  });

  bindFilter("market");
  bindFilter("benchmarkMarket");
  bindFilter("period");
  bindFilter("product");
  bindFilter("categorySource", false);
}

function bindFilter(id, reload = true) {
  const element = document.querySelector(`#${id}`);
  if (!element) return;
  element.addEventListener("change", (event) => {
    activeFilters()[id] = event.target.value;
    if (reload) {
      loadDashboard();
    } else {
      render();
    }
  });
}

async function loadDashboard() {
  state.error = null;
  if (!state.data) state.loading = true;
  render();

  const config = viewConfig();
  const filters = activeFilters();
  const params = new URLSearchParams();

  if (config.controls.includes("market") && filters.market) params.set("market", filters.market);
  if (config.controls.includes("benchmarkMarket") && filters.benchmarkMarket) params.set("benchmarkMarket", filters.benchmarkMarket);
  if (config.controls.includes("period") && filters.period) params.set("period", filters.period);
  if (config.controls.includes("product") && filters.product) params.set("product", filters.product);

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
    state.viewFilters[state.activeView] = {
      ...filters,
      market: payload.filters.market,
      benchmarkMarket: payload.filters.benchmarkMarket,
      period: payload.filters.period,
      product: payload.filters.product,
    };
  } catch (error) {
    state.error = error instanceof Error ? error.message : String(error);
  } finally {
    state.loading = false;
    render();
  }
}

loadDashboard();
