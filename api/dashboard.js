const DEFAULT_DATABASE_ID = "tim_cpg_insights";
const DEFAULT_SCORECARD_TABLE_ID = "scorecard_rows";
const DEFAULT_IMPORT_RUNS_TABLE_ID = "import_runs";
const PAGE_SIZE = 5000;
const MAX_ROWS = 50000;

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

function config() {
  return {
    endpoint: requiredEnv("APPWRITE_ENDPOINT").replace(/\/$/, ""),
    projectId: requiredEnv("APPWRITE_PROJECT_ID"),
    apiKey: requiredEnv("APPWRITE_API_KEY"),
    databaseId: process.env.APPWRITE_DATABASE_ID || DEFAULT_DATABASE_ID,
    scorecardTableId: process.env.APPWRITE_SCORECARD_TABLE_ID || DEFAULT_SCORECARD_TABLE_ID,
    importRunsTableId: process.env.APPWRITE_IMPORT_RUNS_TABLE_ID || DEFAULT_IMPORT_RUNS_TABLE_ID,
  };
}

function queryString(queries) {
  const params = new URLSearchParams();
  for (const query of queries) {
    params.append("queries[]", JSON.stringify(query));
  }
  return params.toString();
}

async function appwriteListRows(cfg, tableId, queries) {
  const qs = queryString(queries);
  const response = await fetch(
    `${cfg.endpoint}/tablesdb/${cfg.databaseId}/tables/${tableId}/rows${qs ? `?${qs}` : ""}`,
    {
      headers: {
        "X-Appwrite-Project": cfg.projectId,
        "X-Appwrite-Key": cfg.apiKey,
        "X-Appwrite-Response-Format": "1.9.5",
      },
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Appwrite ${response.status}: ${body || response.statusText}`);
  }
  return response.json();
}

function normalizeRow(row) {
  return row.data && typeof row.data === "object" ? { ...row.data, ...row } : row;
}

async function fetchImportRuns(cfg) {
  const result = await appwriteListRows(cfg, cfg.importRunsTableId, [
    { method: "orderDesc", attribute: "$createdAt" },
    { method: "limit", values: [20] },
  ]);
  return (result.rows || []).map(normalizeRow);
}

async function fetchScorecardRows(cfg, importRunId) {
  const rows = [];
  for (let offset = 0; offset < MAX_ROWS; offset += PAGE_SIZE) {
    const queries = [
      { method: "limit", values: [PAGE_SIZE] },
      { method: "offset", values: [offset] },
    ];
    if (importRunId) {
      queries.unshift({ method: "equal", attribute: "import_run_id", values: [importRunId] });
    }
    const result = await appwriteListRows(cfg, cfg.scorecardTableId, queries);
    const page = (result.rows || []).map(normalizeRow);
    rows.push(...page);
    if (page.length < PAGE_SIZE) {
      break;
    }
  }
  return rows;
}

function uniqueSorted(rows, key) {
  return [...new Set(rows.map((row) => row[key]).filter(Boolean))].sort((a, b) =>
    String(a).localeCompare(String(b)),
  );
}

function periodSortScore(period) {
  if (!period) return 99;
  if (period.includes("Rolling 26")) return 0;
  if (period.includes("Rolling 13")) return 1;
  if (period.includes("Rolling 52")) return 2;
  if (period.includes("YTD")) return 3;
  return 4;
}

function pickDefaultPeriod(periods) {
  return [...periods].sort((a, b) => {
    const score = periodSortScore(a) - periodSortScore(b);
    return score || String(a).localeCompare(String(b));
  })[0] || "";
}

function pickDefaultMarket(markets) {
  return (
    markets.find((market) => market === "LCL NATIONAL SUPERMARKETS DIV") ||
    markets.find((market) => market === "LCL NATIONAL") ||
    markets.find((market) => market === "NATIONAL EX NFLD GDM") ||
    markets[0] ||
    ""
  );
}

function numberValue(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function compactRow(row) {
  if (!row) return null;
  return {
    id: row.$id,
    market: row.market,
    period: row.period,
    product: row.product,
    brand: row.brand,
    thBrand: row.th_brand,
    sourcePullType: row.source_pull_type,
    dollarSales000: numberValue(row.dollar_sales_000),
    dollarPctChangeYa: numberValue(row.dollar_pct_chg_ya),
    dollarShareProduct: numberValue(row.dollar_share_product),
    dollarShareChangeYa: numberValue(row.dollar_share_chg_ya_product),
    units000: numberValue(row.units_000),
    unitsPctChangeYa: numberValue(row.units_pct_chg_ya),
    avgUnitsPrice: numberValue(row.avg_units_price),
    avgUnitsPriceChangeYa: numberValue(row.avg_units_price_chg_ya),
    soldOnPromoPct: numberValue(row.sold_on_promo_pct),
    soldOnPromoChangeYaPct: numberValue(row.sold_on_promo_chg_ya_pct),
    acvPct: numberValue(row.acv_pct),
    acvPctChangeYa: numberValue(row.acv_pct_chg_ya),
    dollarSppdp: numberValue(row.dollar_sppdp),
    dollarSppdpPctChangeYa: numberValue(row.dollar_sppdp_pct_chg_ya),
  };
}

function bySalesDesc(a, b) {
  return (numberValue(b.dollar_sales_000) || 0) - (numberValue(a.dollar_sales_000) || 0);
}

function dashboardPayload(allRows, importRuns, selectedMarket, selectedPeriod) {
  const markets = uniqueSorted(allRows, "market");
  const periods = uniqueSorted(allRows, "period");
  const market = selectedMarket && markets.includes(selectedMarket) ? selectedMarket : pickDefaultMarket(markets);
  const period = selectedPeriod && periods.includes(selectedPeriod) ? selectedPeriod : pickDefaultPeriod(periods);

  const scope = allRows.filter((row) => row.market === market && row.period === period);
  const byProduct = (product) => scope.find((row) => row.product === product);

  const comparisonProducts = [
    "Packaged Coffee & Instant Coffee",
    "Tim Hortons",
    "Competitive Brands",
    "Private Label",
  ];

  const comparison = comparisonProducts.map((product) => compactRow(byProduct(product))).filter(Boolean);
  const category = compactRow(byProduct("Packaged Coffee & Instant Coffee"));
  const tims = compactRow(byProduct("Tim Hortons"));
  const competitive = compactRow(byProduct("Competitive Brands"));
  const privateLabel = compactRow(byProduct("Private Label"));

  const excludedLeaderboard = new Set([
    "Packaged Coffee & Instant Coffee",
    "Packaged Coffee",
    "Instant Coffee",
    "Competitive Brands",
    "Private Label",
  ]);

  const brandLeaders = scope
    .filter((row) => row.source_pull_type === "topline_brands")
    .filter((row) => row.product && !excludedLeaderboard.has(row.product))
    .sort(bySalesDesc)
    .slice(0, 12)
    .map(compactRow);

  const formatBreakdown = scope
    .filter((row) => row.product && row.product !== "Tim Hortons")
    .filter((row) => row.product.startsWith("Tim Hortons "))
    .sort(bySalesDesc)
    .slice(0, 12)
    .map(compactRow);

  const marketTable = allRows
    .filter((row) => row.period === period && row.product === "Tim Hortons")
    .sort(bySalesDesc)
    .slice(0, 18)
    .map(compactRow);

  const latestImport = importRuns[0] || null;
  return {
    updatedAt: new Date().toISOString(),
    latestImport: latestImport
      ? {
          id: latestImport.$id,
          status: latestImport.status,
          fileName: latestImport.file_name,
          rowCount: latestImport.row_count,
          completedAt: latestImport.completed_at,
        }
      : null,
    filters: { market, period, markets, periods },
    counts: {
      loadedRows: allRows.length,
      scopedRows: scope.length,
      importRuns: importRuns.length,
    },
    kpis: { category, tims, competitive, privateLabel },
    comparison,
    brandLeaders,
    formatBreakdown,
    marketTable,
  };
}

export default async function handler(request, response) {
  if (request.method !== "GET") {
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const cfg = config();
    const importRuns = await fetchImportRuns(cfg);
    const requestedImportRunId = request.query.importRunId;
    const importRunId = requestedImportRunId || importRuns.find((run) => run.status === "complete")?.$id || importRuns[0]?.$id;
    const rows = await fetchScorecardRows(cfg, importRunId);

    response.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=900");
    response.status(200).json(
      dashboardPayload(
        rows,
        importRuns,
        request.query.market ? String(request.query.market) : "",
        request.query.period ? String(request.query.period) : "",
      ),
    );
  } catch (error) {
    response.status(500).json({
      error: "Dashboard data unavailable",
      detail: error instanceof Error ? error.message : String(error),
    });
  }
}
