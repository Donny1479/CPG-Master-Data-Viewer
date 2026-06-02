const DEFAULT_DATABASE_ID = "tim_cpg_insights";
const DEFAULT_SCORECARD_TABLE_ID = "scorecard_rows";
const DEFAULT_IMPORT_RUNS_TABLE_ID = "import_runs";
const DEFAULT_IMPORT_METADATA_TABLE_ID = "import_metadata";
const PAGE_SIZE = 5000;
const MAX_ROWS = 50000;
const DEFAULT_TARGET_MARKET = "LCL NATIONAL SUPERMARKETS DIV";
const DEFAULT_BENCHMARK_MARKET = "LCL NATIONAL";
const DEFAULT_CUSTOMER_PRODUCT = "Tim Hortons";

const OVERVIEW_SECTIONS = [
  {
    id: "coffee",
    title: "Coffee",
    rows: [
      { label: "Packaged Coffee & Instant Coffee", product: "Packaged Coffee & Instant Coffee", pullType: "topline_brands" },
      { label: "Tim Hortons", product: "Tim Hortons", pullType: "topline_brands" },
      { label: "Competitive Brands", product: "Competitive Brands", pullType: "topline_brands" },
      { label: "Private Label", product: "Private Label", pullType: "topline_brands" },
    ],
  },
  {
    id: "rg",
    title: "R&G",
    rows: [
      { label: "R&G", product: "R&G", pullType: "rg" },
      { label: "Tim Hortons", product: "Tim Hortons R&G", pullType: "rg" },
      { label: "Competitive Brands", product: "Competitive Brands R&G", pullType: "rg" },
      { label: "Private Label", product: "Private Label R&G", pullType: "rg" },
    ],
  },
  {
    id: "singleServe",
    title: "Single Serve",
    rows: [
      { label: "Single Serve", product: "Single Serve", pullType: "single_serve" },
      { label: "Tim Hortons", product: "Tim Hortons Single Serve", pullType: "single_serve" },
      { label: "Competitive Brands", product: "Competitive Brands Single Serve", pullType: "single_serve" },
      { label: "Private Label", product: "Private Label Single Serve", pullType: "single_serve" },
    ],
  },
  {
    id: "instant",
    title: "Instant Coffee",
    rows: [
      { label: "Instant Coffee", product: "Instant Coffee", pullType: "instant" },
      { label: "Tim Hortons", product: "Tim Hortons Instant Coffee", pullType: "instant" },
      { label: "Competitive Brands", product: "Competitive Brands Instant Coffee", pullType: "instant" },
      { label: "Private Label", product: "Private Label Instant Coffee", pullType: "instant" },
    ],
  },
];

const CUSTOMER_MARKET_ORDER = [
  "NATIONAL EX NFLD GDM",
  "NATIONAL CONVENTIONAL GDM",
  "NATIONAL DISCOUNT GDM",
  "LCL NATIONAL",
  "LCL NATIONAL SUPERMARKETS DIV",
  "LCL NATIONAL MARKET DIVISION",
  "FORTINO'S",
  "Total RCSS",
  "RCSS ONTARIO",
  "RCSS TOTAL WEST",
  "LCL NATIONAL HARD DISCOUNT DIVISION",
  "NO FRILLS NATIONAL",
  "LCL QUEBEC HARD DISCOUNT DIV",
  "SDM NATIONAL",
  "SOBEYS INC NATIONAL INCL NFLD EX LAWTONS",
  "SOBEYS FULL SERVICE NATIONAL INCL NFLD",
  "FRESHCO",
  "FRESHCO ONTARIO",
  "FRESHCO TOTAL WEST",
  "IGA QUEBEC",
  "METRO INC GROCERY BANNERS",
  "METRO/FOOD BASICS ONTARIO",
  "METRO ONTARIO",
  "FOOD BASICS ONTARIO",
  "METRO/SUPER C QUEBEC",
  "METRO QUEBEC",
  "SUPER C QUEBEC",
  "CANADIAN TIRE NATIONAL",
  "SAVE ON FOODS WEST",
  "FEDERATED COOP",
];

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
    importMetadataTableId: process.env.APPWRITE_IMPORT_METADATA_TABLE_ID || DEFAULT_IMPORT_METADATA_TABLE_ID,
  };
}

function queryString(queries) {
  const params = new URLSearchParams();
  for (const query of queries) {
    params.append("queries[]", JSON.stringify(query));
  }
  return params.toString();
}

function equalQuery(attribute, values) {
  return {
    method: "equal",
    attribute,
    values: Array.isArray(values) ? values : [values],
  };
}

function limitQuery(value) {
  return { method: "limit", values: [value] };
}

function offsetQuery(value) {
  return { method: "offset", values: [value] };
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

async function appwriteGetRow(cfg, tableId, rowId) {
  if (!rowId) return null;
  const response = await fetch(
    `${cfg.endpoint}/tablesdb/${cfg.databaseId}/tables/${tableId}/rows/${encodeURIComponent(rowId)}`,
    {
      headers: {
        "X-Appwrite-Project": cfg.projectId,
        "X-Appwrite-Key": cfg.apiKey,
        "X-Appwrite-Response-Format": "1.9.5",
      },
    },
  );

  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Appwrite ${response.status}: ${body || response.statusText}`);
  }
  return normalizeRow(await response.json());
}

function normalizeRow(row) {
  return row.data && typeof row.data === "object" ? { ...row.data, ...row } : row;
}

async function fetchImportRuns(cfg) {
  const result = await appwriteListRows(cfg, cfg.importRunsTableId, [
    { method: "orderDesc", attribute: "$createdAt" },
    limitQuery(20),
  ]);
  return (result.rows || []).map(normalizeRow);
}

async function fetchScorecardRows(cfg, importRunId, filters = {}, maxRows = MAX_ROWS) {
  const rows = [];
  const pageSize = Math.min(PAGE_SIZE, maxRows);
  for (let offset = 0; offset < maxRows; offset += pageSize) {
    const queries = [
      limitQuery(pageSize),
      offsetQuery(offset),
    ];
    if (importRunId) {
      queries.unshift(equalQuery("import_run_id", importRunId));
    }
    for (const [attribute, value] of Object.entries(filters)) {
      if (value) {
        queries.unshift(equalQuery(attribute, value));
      }
    }
    const result = await appwriteListRows(cfg, cfg.scorecardTableId, queries);
    const page = (result.rows || []).map(normalizeRow);
    rows.push(...page);
    if (page.length < pageSize) {
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
    markets.find((market) => market === DEFAULT_TARGET_MARKET) ||
    markets.find((market) => market === DEFAULT_BENCHMARK_MARKET) ||
    markets.find((market) => market === "NATIONAL EX NFLD GDM") ||
    markets[0] ||
    ""
  );
}

function pickDefaultBenchmarkMarket(markets, targetMarket) {
  return (
    markets.find((market) => market === DEFAULT_BENCHMARK_MARKET && market !== targetMarket) ||
    markets.find((market) => market === "NATIONAL EX NFLD GDM" && market !== targetMarket) ||
    markets.find((market) => market !== targetMarket) ||
    targetMarket ||
    ""
  );
}

function pickDefaultProduct(products) {
  return products.find((product) => product === DEFAULT_CUSTOMER_PRODUCT) || products[0] || "";
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
    unitsChangeYa000: numberValue(row.units_chg_ya_000),
    unitsPctChangeYa: numberValue(row.units_pct_chg_ya),
    pounds000: numberValue(row.pounds_000),
    poundsChangeYa000: numberValue(row.pounds_chg_ya_000),
    poundsPctChangeYa: numberValue(row.pounds_pct_chg_ya),
    avgPoundsPrice: numberValue(row.avg_pounds_price),
    avgPoundsPricePctChangeYa: numberValue(row.avg_pounds_price_pct_chg_ya),
    avgUnitsPrice: numberValue(row.avg_units_price),
    avgUnitsPriceChangeYa: numberValue(row.avg_units_price_chg_ya),
    avgUnitsPricePctChangeYa: numberValue(row.avg_units_price_pct_chg_ya),
    noPromoUnitsPrice: numberValue(row.no_promo_units_price),
    noPromoUnitsPricePctChangeYa: numberValue(row.no_promo_units_price_pct_chg_ya),
    anyPromoUnitsPrice: numberValue(row.any_promo_units_price),
    anyPromoUnitsPricePctChangeYa: numberValue(row.any_promo_units_price_pct_chg_ya),
    soldOnPromoPct: numberValue(row.sold_on_promo_pct),
    soldOnPromoChangeYaPct: numberValue(row.sold_on_promo_chg_ya_pct),
    displayOnlyUnits: numberValue(row.disp_only_units),
    displayOnlyUnitsPctChangeYa: numberValue(row.disp_only_units_pct_chg_ya),
    featureOnlyUnits: numberValue(row.feat_only_units),
    featureOnlyUnitsPctChangeYa: numberValue(row.feat_only_units_pct_chg_ya),
    priceDecreaseOnlyUnits: numberValue(row.price_decr_only_units),
    priceDecreaseOnlyUnitsPctChangeYa: numberValue(row.price_decr_only_units_pct_chg_ya),
    featureDisplayPriceDecreaseUnits: numberValue(row.feat_disp_price_decr_units),
    featureDisplayPriceDecreaseUnitsPctChangeYa: numberValue(row.feat_disp_price_decr_pct_chg_ya),
    acvPct: numberValue(row.acv_pct),
    acvPctChangeYa: numberValue(row.acv_pct_chg_ya),
    itemsPerStore: numberValue(row.items_per_store),
    itemsPerStoreChangeYa: numberValue(row.items_per_store_chg_ya),
    dollarSppdp: numberValue(row.dollar_sppdp),
    dollarSppdpPctChangeYa: numberValue(row.dollar_sppdp_pct_chg_ya),
  };
}

function bySalesDesc(a, b) {
  return (numberValue(b.dollar_sales_000) || 0) - (numberValue(a.dollar_sales_000) || 0);
}

function sourceSortScore(row) {
  const scores = { topline_brands: 0, rg: 1, single_serve: 2, instant: 3 };
  return scores[row.source_pull_type] ?? 9;
}

function findScorecardRow(rows, market, period, product, pullType) {
  return (
    rows.find(
      (row) =>
        row.market === market &&
        row.period === period &&
        row.product === product &&
        (!pullType || row.source_pull_type === pullType),
    ) || null
  );
}

function overviewRow(allRows, spec, targetMarket, benchmarkMarket, period) {
  const target = findScorecardRow(allRows, targetMarket, period, spec.product, spec.pullType);
  const benchmark = findScorecardRow(allRows, benchmarkMarket, period, spec.product, spec.pullType);
  const targetShare = numberValue(target?.dollar_share_product);
  const benchmarkShare = numberValue(benchmark?.dollar_share_product);
  const targetSalesPct = numberValue(target?.dollar_pct_chg_ya);
  const benchmarkSalesPct = numberValue(benchmark?.dollar_pct_chg_ya);

  return {
    label: spec.label,
    product: spec.product,
    sourcePullType: spec.pullType,
    target: compactRow(target),
    benchmark: compactRow(benchmark),
    metrics: {
      targetShare,
      benchmarkShare,
      shareIndex: benchmarkShare ? (targetShare / benchmarkShare) * 100 : null,
      targetSales000: numberValue(target?.dollar_sales_000),
      targetSalesPctChangeYa: targetSalesPct,
      benchmarkSales000: numberValue(benchmark?.dollar_sales_000),
      benchmarkSalesPctChangeYa: benchmarkSalesPct,
      salesPctChangeDelta: targetSalesPct != null && benchmarkSalesPct != null ? targetSalesPct - benchmarkSalesPct : null,
      targetAvgUnitsPriceChangeYa: numberValue(target?.avg_units_price_chg_ya),
      targetSoldOnPromoChangeYaPct: numberValue(target?.sold_on_promo_chg_ya_pct),
      targetAcvPctChangeYa: numberValue(target?.acv_pct_chg_ya),
      benchmarkAvgUnitsPriceChangeYa: numberValue(benchmark?.avg_units_price_chg_ya),
      benchmarkSoldOnPromoChangeYaPct: numberValue(benchmark?.sold_on_promo_chg_ya_pct),
      benchmarkAcvPctChangeYa: numberValue(benchmark?.acv_pct_chg_ya),
    },
  };
}

function overviewSections(allRows, targetMarket, benchmarkMarket, period) {
  return OVERVIEW_SECTIONS.map((section) => ({
    id: section.id,
    title: section.title,
    rows: section.rows.map((row) => overviewRow(allRows, row, targetMarket, benchmarkMarket, period)),
  }));
}

function customerMarketOrder(row) {
  const index = CUSTOMER_MARKET_ORDER.indexOf(row.market);
  return index === -1 ? 999 : index;
}

function queryValue(value) {
  if (Array.isArray(value)) return value[0] ? String(value[0]) : "";
  return value ? String(value) : "";
}

function parseImportMetadata(importRun) {
  if (!importRun?.metadata_json) return null;
  try {
    return JSON.parse(importRun.metadata_json);
  } catch {
    return null;
  }
}

function metadataOptions(metadata) {
  const options = metadata?.options || {};
  const markets = Array.isArray(options.markets) ? options.markets.filter(Boolean) : [];
  const periods = Array.isArray(options.periods) ? options.periods.filter(Boolean) : [];
  const products = Array.isArray(options.products) ? options.products.filter(Boolean) : [];
  return markets.length || periods.length || products.length ? { markets, periods, products } : null;
}

function resolveFilters(options, selectedMarket, selectedBenchmarkMarket, selectedPeriod, selectedProduct) {
  const markets = options?.markets || [];
  const periods = options?.periods || [];
  const products = options?.products || [];
  const market = selectedMarket && markets.includes(selectedMarket) ? selectedMarket : pickDefaultMarket(markets);
  const benchmarkMarket =
    selectedBenchmarkMarket && markets.includes(selectedBenchmarkMarket)
      ? selectedBenchmarkMarket
      : pickDefaultBenchmarkMarket(markets, market);
  const period = selectedPeriod && periods.includes(selectedPeriod) ? selectedPeriod : pickDefaultPeriod(periods);
  const product = selectedProduct && products.includes(selectedProduct) ? selectedProduct : pickDefaultProduct(products);
  return { market, benchmarkMarket, period, product };
}

function dedupeRows(rowGroups) {
  const seen = new Set();
  const rows = [];
  for (const group of rowGroups) {
    for (const row of group) {
      const key = row.$id || `${row.market}|${row.period}|${row.product}|${row.source_pull_type}`;
      if (!seen.has(key)) {
        seen.add(key);
        rows.push(row);
      }
    }
  }
  return rows;
}

function dashboardPayload(
  allRows,
  importRuns,
  selectedMarket,
  selectedBenchmarkMarket,
  selectedPeriod,
  selectedProduct,
  options,
  totalLoadedRows,
  importMetadata,
) {
  const markets = options?.markets?.length ? options.markets : uniqueSorted(allRows, "market");
  const periods = options?.periods?.length ? options.periods : uniqueSorted(allRows, "period");
  const products = options?.products?.length ? options.products : uniqueSorted(allRows, "product");
  const market = selectedMarket && markets.includes(selectedMarket) ? selectedMarket : pickDefaultMarket(markets);
  const benchmarkMarket =
    selectedBenchmarkMarket && markets.includes(selectedBenchmarkMarket)
      ? selectedBenchmarkMarket
      : pickDefaultBenchmarkMarket(markets, market);
  const period = selectedPeriod && periods.includes(selectedPeriod) ? selectedPeriod : pickDefaultPeriod(periods);
  const product = selectedProduct && products.includes(selectedProduct) ? selectedProduct : pickDefaultProduct(products);

  const scope = allRows.filter((row) => row.market === market && row.period === period);
  const byProduct = (productName, pullType) =>
    scope.find((row) => row.product === productName && (!pullType || row.source_pull_type === pullType));

  const comparisonProducts = [
    { product: "Packaged Coffee & Instant Coffee", pullType: "topline_brands" },
    { product: "Tim Hortons", pullType: "topline_brands" },
    { product: "Competitive Brands", pullType: "topline_brands" },
    { product: "Private Label", pullType: "topline_brands" },
  ];

  const comparison = comparisonProducts.map((item) => compactRow(byProduct(item.product, item.pullType))).filter(Boolean);
  const category = compactRow(byProduct("Packaged Coffee & Instant Coffee", "topline_brands"));
  const tims = compactRow(byProduct("Tim Hortons", "topline_brands"));
  const competitive = compactRow(byProduct("Competitive Brands", "topline_brands"));
  const privateLabel = compactRow(byProduct("Private Label", "topline_brands"));

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

  const categoryRows = scope
    .filter((row) => row.product)
    .sort((a, b) => sourceSortScore(a) - sourceSortScore(b) || bySalesDesc(a, b))
    .map(compactRow);

  const customerRows = allRows
    .filter((row) => row.period === period && row.product === product)
    .sort((a, b) => customerMarketOrder(a) - customerMarketOrder(b) || String(a.market).localeCompare(String(b.market)))
    .map(compactRow);

  const marketTable = allRows
    .filter((row) => row.period === period && row.product === "Tim Hortons")
    .sort(bySalesDesc)
    .slice(0, 18)
    .map(compactRow);

  const latestImport = importRuns[0] || null;
  const latestMetadata = importMetadata || parseImportMetadata(latestImport);
  return {
    updatedAt: new Date().toISOString(),
    latestImport: latestImport
      ? {
          id: latestImport.$id,
          status: latestImport.status,
          fileName: latestImport.file_name,
          rowCount: latestImport.row_count,
          completedAt: latestImport.completed_at,
          source: latestMetadata?.source || null,
          sourceCounts: latestMetadata?.sourceCounts || null,
        }
      : null,
    filters: { market, benchmarkMarket, period, product, markets, periods, products },
    counts: {
      loadedRows: totalLoadedRows || allRows.length,
      apiRowsLoaded: allRows.length,
      scopedRows: scope.length,
      importRuns: importRuns.length,
    },
    views: {
      overview: {
        title: "Coffee Category & Customer Performance Overview",
        targetMarket: market,
        benchmarkMarket,
        period,
        sections: overviewSections(allRows, market, benchmarkMarket, period),
      },
      category: {
        market,
        period,
        rows: categoryRows,
      },
      customer: {
        product,
        period,
        rows: customerRows,
      },
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
    const requestedImportRunId = queryValue(request.query.importRunId);
    const selectedImportRun =
      (requestedImportRunId && importRuns.find((run) => run.$id === requestedImportRunId)) ||
      importRuns.find((run) => run.status === "complete") ||
      importRuns[0] ||
      null;
    const importRunId = requestedImportRunId || selectedImportRun?.$id;
    const metadataRow = await appwriteGetRow(cfg, cfg.importMetadataTableId, importRunId);
    const metadata = parseImportMetadata(metadataRow) || parseImportMetadata(selectedImportRun);
    const options = metadataOptions(metadata);

    let rows;
    let selected;
    if (options) {
      selected = resolveFilters(
        options,
        queryValue(request.query.market),
        queryValue(request.query.benchmarkMarket),
        queryValue(request.query.period),
        queryValue(request.query.product),
      );

      const [targetRows, benchmarkRows, customerRows, timHortonsRows] = await Promise.all([
        fetchScorecardRows(cfg, importRunId, { market: selected.market, period: selected.period }, 2000),
        selected.benchmarkMarket && selected.benchmarkMarket !== selected.market
          ? fetchScorecardRows(cfg, importRunId, { market: selected.benchmarkMarket, period: selected.period }, 2000)
          : Promise.resolve([]),
        selected.product
          ? fetchScorecardRows(cfg, importRunId, { product: selected.product, period: selected.period }, 1000)
          : Promise.resolve([]),
        selected.product && selected.product !== DEFAULT_CUSTOMER_PRODUCT
          ? fetchScorecardRows(cfg, importRunId, { product: DEFAULT_CUSTOMER_PRODUCT, period: selected.period }, 1000)
          : Promise.resolve([]),
      ]);
      rows = dedupeRows([targetRows, benchmarkRows, customerRows, timHortonsRows]);
    } else {
      rows = await fetchScorecardRows(cfg, importRunId);
      selected = {
        market: queryValue(request.query.market),
        benchmarkMarket: queryValue(request.query.benchmarkMarket),
        period: queryValue(request.query.period),
        product: queryValue(request.query.product),
      };
    }

    response.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=900");
    response.status(200).json(
      dashboardPayload(
        rows,
        importRuns,
        selected.market,
        selected.benchmarkMarket,
        selected.period,
        selected.product,
        options,
        metadata?.rowCount || selectedImportRun?.row_count,
        metadata,
      ),
    );
  } catch (error) {
    response.status(500).json({
      error: "Dashboard data unavailable",
      detail: error instanceof Error ? error.message : String(error),
    });
  }
}
