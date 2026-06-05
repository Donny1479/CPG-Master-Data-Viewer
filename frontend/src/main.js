import { Account, Client } from "appwrite";
import logoUrl from "./assets/timsiq-logo.png";
import "./styles.css";

const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT || "https://tor.cloud.appwrite.io/v1";
const APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID || "6a1ddc28001802029c80";
const appwriteClient = new Client().setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID);
const account = new Account(appwriteClient);

const DEFAULT_MARKET = "NATIONAL EX NFLD GDM";
const DEFAULT_BENCHMARK_TARGET_MARKET = "NATIONAL CONVENTIONAL GDM";
const DEFAULT_ROLLING_52_PERIOD = "Rolling 52 w/e";
const BUSINESS_ALL = "all";
const BUSINESS_COFFEE = "coffee";
const BUSINESS_SOUP = "soup_chili";

const NAV_GROUPS = [
  { id: BUSINESS_COFFEE, label: "Coffee Insights" },
  { id: BUSINESS_SOUP, label: "Soup & Chili Insights" },
];

const BUSINESS_LABELS = {
  [BUSINESS_COFFEE]: "Coffee",
  [BUSINESS_SOUP]: "Soup & Chili",
  [BUSINESS_ALL]: "All Insights",
};

const VIEW_CONFIGS = [
  {
    id: "executiveSummary",
    label: "Executive Summary",
    source: "Tim Hortons Focus",
    kind: "executive",
    business: BUSINESS_ALL,
    defaultPeriod: DEFAULT_ROLLING_52_PERIOD,
    defaultMarket: DEFAULT_MARKET,
    controls: ["market", "period"],
  },
  {
    id: "overview",
    label: "Benchmark Analysis",
    source: "Coffee Insights",
    kind: "overview",
    business: BUSINESS_COFFEE,
    navGroup: BUSINESS_COFFEE,
    defaultPeriod: DEFAULT_ROLLING_52_PERIOD,
    defaultMarket: DEFAULT_BENCHMARK_TARGET_MARKET,
    defaultBenchmarkMarket: DEFAULT_MARKET,
    controls: ["market", "benchmarkMarket", "period"],
  },
  {
    id: "categorySummary",
    label: "Category Summary",
    source: "Coffee Insights",
    kind: "categorySummary",
    business: BUSINESS_COFFEE,
    navGroup: BUSINESS_COFFEE,
    defaultPeriod: DEFAULT_ROLLING_52_PERIOD,
    defaultMarket: DEFAULT_MARKET,
    controls: ["market", "period"],
  },
  {
    id: "categoryDetail",
    label: "Category Detail",
    source: "Coffee Insights",
    kind: "categoryDetail",
    business: BUSINESS_COFFEE,
    navGroup: BUSINESS_COFFEE,
    defaultPeriod: DEFAULT_ROLLING_52_PERIOD,
    defaultMarket: DEFAULT_MARKET,
    controls: ["market", "period"],
  },
  {
    id: "customerSummary",
    label: "Customer Summary",
    source: "Coffee Insights",
    kind: "customerSummary",
    business: BUSINESS_COFFEE,
    navGroup: BUSINESS_COFFEE,
    defaultPeriod: DEFAULT_ROLLING_52_PERIOD,
    defaultProduct: "Tim Hortons",
    controls: ["product", "period"],
  },
  {
    id: "customerDetail",
    label: "Customer Detail",
    source: "Coffee Insights",
    kind: "customerDetail",
    business: BUSINESS_COFFEE,
    navGroup: BUSINESS_COFFEE,
    defaultPeriod: DEFAULT_ROLLING_52_PERIOD,
    defaultProduct: "Tim Hortons Instant Regular",
    controls: ["product", "period"],
  },
  {
    id: "soupOverview",
    label: "Benchmark Analysis",
    source: "Soup & Chili Insights",
    kind: "overview",
    business: BUSINESS_SOUP,
    navGroup: BUSINESS_SOUP,
    defaultPeriod: DEFAULT_ROLLING_52_PERIOD,
    defaultMarket: DEFAULT_BENCHMARK_TARGET_MARKET,
    defaultBenchmarkMarket: DEFAULT_MARKET,
    controls: ["market", "benchmarkMarket", "period"],
  },
  {
    id: "soupCategorySummary",
    label: "Category Summary",
    source: "Soup & Chili Insights",
    kind: "categorySummary",
    business: BUSINESS_SOUP,
    navGroup: BUSINESS_SOUP,
    defaultPeriod: DEFAULT_ROLLING_52_PERIOD,
    defaultMarket: DEFAULT_MARKET,
    controls: ["market", "period"],
  },
  {
    id: "soupCategoryDetail",
    label: "Category Detail",
    source: "Soup & Chili Insights",
    kind: "categoryDetail",
    business: BUSINESS_SOUP,
    navGroup: BUSINESS_SOUP,
    defaultPeriod: DEFAULT_ROLLING_52_PERIOD,
    defaultMarket: DEFAULT_MARKET,
    controls: ["market", "period"],
  },
  {
    id: "soupCustomerSummary",
    label: "Customer Summary",
    source: "Soup & Chili Insights",
    kind: "customerSummary",
    business: BUSINESS_SOUP,
    navGroup: BUSINESS_SOUP,
    defaultPeriod: DEFAULT_ROLLING_52_PERIOD,
    defaultProduct: "Tim Hortons Ready to Serve",
    controls: ["product", "period"],
  },
  {
    id: "soupCustomerDetail",
    label: "Customer Detail",
    source: "Soup & Chili Insights",
    kind: "customerDetail",
    business: BUSINESS_SOUP,
    navGroup: BUSINESS_SOUP,
    defaultPeriod: DEFAULT_ROLLING_52_PERIOD,
    defaultProduct: "Tim Hortons Ready to Serve",
    controls: ["product", "period"],
  },
];

const METRIC_SUBGROUP_START_KEYS = new Set([
  "dollarSales000",
  "units000",
  "avgUnitsPrice",
  "noPromoUnitsPrice",
  "anyPromoUnitsPrice",
  "displayOnlyUnits",
  "featureOnlyUnits",
  "priceDecreaseOnlyUnits",
  "featureDisplayPriceDecreaseUnits",
  "itemsPerStore",
]);

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

const CATEGORY_COMPARE_BRANDS = ["Tim Hortons", "Private Label", "Starbucks", "McCafe"];
const CATEGORY_OTHER_BRAND_ORDER = [
  "Van Houtte",
  "Nescafe",
  "Maxwell House",
  "Nabob",
  "Kicking Horse",
  "Lavazza",
  "Folgers",
  "Melitta",
  "Timothys",
  "AO Brand",
  "Kopiko",
];

const SOUP_CATEGORY_DEFINITIONS = [
  {
    key: "readyToServe",
    label: "Ready to Serve",
    product: "Ready to Serve Non Broth",
    sourcePullType: "ready_to_serve",
    children: [
      { label: "Tim Hortons", product: "Tim Hortons Ready to Serve" },
      { label: "Private Label", product: "Private Label Ready to Serve" },
      {
        label: "Campbells",
        product: "Campbells Ready to Serve",
        children: [
          { label: "Red and White", product: "Campbells Red and White Ready to Serve" },
          { label: "Chunky", product: "Campbells Chunky Ready to Serve" },
        ],
      },
      { label: "Habitant", product: "Habitant Ready to Serve" },
      { label: "St. Hubert", product: "St. Hubert Ready to Serve" },
      { label: "Competitive Brands", product: "Competitive Brands Ready to Serve" },
    ],
  },
  {
    key: "condensed",
    label: "Condensed",
    product: "Condensed Non Broth",
    sourcePullType: "condensed",
    children: [
      { label: "Tim Hortons", product: "Tim Hortons Condensed" },
      { label: "Private Label", product: "Private Label Condensed" },
      { label: "Campbells", product: "Campbells Condensed" },
      { label: "Aylmer", product: "Aylmer Condensed" },
      { label: "Competitive Brands", product: "Competitive Brands Condensed" },
    ],
  },
  {
    key: "chili",
    label: "Chili",
    product: "Chili",
    sourcePullType: "chili",
    children: [
      { label: "Tim Hortons", product: "Tim Hortons Chili" },
      { label: "Campbells Chunky", product: "Campbells Chunky Chili" },
      { label: "Stagg", product: "Stagg Chili" },
      { label: "Competitive Brands", product: "Competitive Brands Chili" },
    ],
  },
];

const CATEGORY_METRIC_GROUPS = [
  {
    title: "Topline",
    tone: "topline",
    columns: [
      { key: "dollarShareProduct", label: "$ Shr - Product", format: percent },
      { key: "dollarShareChangeYa", label: "$ Shr Chg YA - Product", format: changeNumber },
      { key: "dollarSales000", label: "$ ('000)", format: wholeNumber },
      { key: "dollarPctChangeYa", label: "$ ('000) % Chg YA", format: percent },
    ],
  },
  {
    title: "Volume",
    tone: "volume",
    columns: [
      { key: "units000", label: "Units ('000)", format: wholeNumber },
      { key: "unitsPctChangeYa", label: "Units % Chg YA", format: percent },
    ],
  },
  {
    title: "Price",
    tone: "price",
    columns: [
      { key: "avgUnitsPrice", label: "Avg Units Price", format: currency },
      { key: "avgUnitsPriceChangeYa", label: "Avg Units Price Chg YA", format: currency },
      { key: "avgUnitsPricePctChangeYa", label: "Avg Units Price % Chg YA", format: percent },
    ],
  },
  {
    title: "Promotion",
    tone: "promotion",
    columns: [
      { key: "soldOnPromoPct", label: "% Sold on Promotion", format: percent },
      { key: "soldOnPromoChangeYaPct", label: "% Sold on Promotion Chg YA", format: percent },
    ],
  },
  {
    title: "Distribution",
    tone: "distribution",
    columns: [
      { key: "acvPct", label: "% ACV", format: percent },
      { key: "acvPctChangeYa", label: "% ACV % Chg YA", format: percent },
      { key: "itemsPerStore", label: "No. of Items per Store", format: valueNumber },
      { key: "itemsPerStoreChangeYa", label: "No. of Items per Store Chg YA", format: changeNumber },
    ],
  },
  {
    title: "Velocity",
    tone: "velocity",
    columns: [
      { key: "dollarSppdp", label: "$ SPPDP", format: valueNumber },
      { key: "dollarSppdpPctChangeYa", label: "$ SPPDP % Chg YA", format: percent },
    ],
  },
];

const CATEGORY_METRIC_COLUMNS = metricColumnsWithGrouping(CATEGORY_METRIC_GROUPS);

const DETAIL_METRIC_GROUPS = [
  {
    title: "Topline",
    tone: "topline",
    columns: [
      { key: "dollarShareProduct", label: "$ Shr - Product", format: percent },
      { key: "dollarShareChangeYa", label: "$ Shr Chg YA - Product", format: changeNumber },
      { key: "dollarSales000", label: "$ ('000)", format: wholeNumber },
      { key: "dollarSalesChangeYa000", label: "$ ('000) Chg YA", format: changeNumber },
      { key: "dollarPctChangeYa", label: "$ % Chg YA", format: percent },
    ],
  },
  {
    title: "Volume",
    tone: "volume",
    columns: [
      { key: "pounds000", label: "Pounds ('000)", format: valueNumber },
      { key: "poundsChangeYa000", label: "Pounds ('000) Chg YA", format: changeNumber },
      { key: "poundsPctChangeYa", label: "Pounds % Chg YA", format: percent },
      { key: "units000", label: "Units ('000)", format: valueNumber },
      { key: "unitsChangeYa000", label: "Units ('000) Chg YA", format: changeNumber },
      { key: "unitsPctChangeYa", label: "Units % Chg YA", format: percent },
    ],
  },
  {
    title: "Price",
    tone: "price",
    columns: [
      { key: "avgPoundsPrice", label: "Avg Pounds Price", format: currency },
      { key: "avgPoundsPricePctChangeYa", label: "Avg Pounds Price % Chg YA", format: percent },
      { key: "avgUnitsPrice", label: "Avg Units Price", format: currency },
      { key: "avgUnitsPriceChangeYa", label: "Avg Units Price Chg YA", format: currency },
      { key: "avgUnitsPricePctChangeYa", label: "Avg Units Price % Chg YA", format: percent },
      { key: "noPromoUnitsPrice", label: "No Promo Units Price", format: currency },
      { key: "noPromoUnitsPricePctChangeYa", label: "No Promo Units Price % Chg YA", format: percent },
      { key: "anyPromoUnitsPrice", label: "Any Promo Units Price", format: currency },
      { key: "anyPromoUnitsPricePctChangeYa", label: "Any Promo Units Price % Chg YA", format: percent },
    ],
  },
  {
    title: "Promotion",
    tone: "promotion",
    columns: [
      { key: "soldOnPromoPct", label: "% Sold on Promotion", format: percent },
      { key: "soldOnPromoChangeYaPct", label: "% Sold on Promotion Chg YA", format: percent },
      { key: "displayOnlyUnits", label: "Disp Only Units ('000)", format: valueNumber },
      { key: "displayOnlyUnitsPctChangeYa", label: "Disp Only Units % Chg YA", format: percent },
      { key: "featureOnlyUnits", label: "Feat Only Units ('000)", format: valueNumber },
      { key: "featureOnlyUnitsPctChangeYa", label: "Feat Only Units % Chg YA", format: percent },
      { key: "priceDecreaseOnlyUnits", label: "Price Decr Only Units ('000)", format: valueNumber },
      { key: "priceDecreaseOnlyUnitsPctChangeYa", label: "Price Decr Only Units % Chg YA", format: percent },
      { key: "featureDisplayPriceDecreaseUnits", label: "Feat & Disp & Price Decr Units ('000)", format: valueNumber },
      { key: "featureDisplayPriceDecreaseUnitsPctChangeYa", label: "Feat & Disp & Price Decr Units % Chg YA", format: percent },
    ],
  },
  {
    title: "Distribution",
    tone: "distribution",
    columns: [
      { key: "acvPct", label: "% ACV", format: percent },
      { key: "acvPctChangeYa", label: "% ACV % Chg YA", format: percent },
      { key: "itemsPerStore", label: "No. of Items per Store", format: valueNumber },
      { key: "itemsPerStoreChangeYa", label: "No. of Items per Store Chg YA", format: changeNumber },
    ],
  },
  {
    title: "Velocity",
    tone: "velocity",
    columns: [
      { key: "dollarSppdp", label: "$ SPPDP", format: valueNumber },
      { key: "dollarSppdpPctChangeYa", label: "$ SPPDP % Chg YA", format: percent },
    ],
  },
];

const DETAIL_METRIC_COLUMNS = metricColumnsWithGrouping(DETAIL_METRIC_GROUPS);

const EXECUTIVE_METRIC_GROUPS = [
  {
    title: "Sales",
    tone: "topline",
    columns: [
      { key: "dollarSales000", label: "$ ('000)", format: wholeNumber },
      { key: "dollarPctChangeYa", label: "$ % Chg YA", format: percent },
    ],
  },
  {
    title: "Units",
    tone: "volume",
    columns: [
      { key: "units000", label: "Units ('000)", format: wholeNumber },
      { key: "unitsPctChangeYa", label: "Units % Chg YA", format: percent },
    ],
  },
  {
    title: "Price",
    tone: "price",
    columns: [{ key: "avgUnitsPricePctChangeYa", label: "Avg Units Price % Chg YA", format: percent }],
  },
  {
    title: "Promotion",
    tone: "promotion",
    columns: [
      { key: "soldOnPromoPct", label: "% Sold on Promo", format: percent },
      { key: "soldOnPromoChangeYaPct", label: "% Sold on Promo Chg YA", format: percent },
    ],
  },
  {
    title: "Distribution",
    tone: "distribution",
    columns: [
      { key: "acvPct", label: "% ACV", format: percent },
      { key: "acvPctChangeYa", label: "% ACV % Chg YA", format: percent },
    ],
  },
];

const EXECUTIVE_METRIC_COLUMNS = metricColumnsWithGrouping(EXECUTIVE_METRIC_GROUPS);

const CUSTOMER_TREE = [
  { market: "All Markets/Customers/Banners", kind: "total" },
  { market: "NATIONAL EX NFLD GDM", kind: "national" },
  {
    market: "NATIONAL CONVENTIONAL GDM",
    kind: "national",
    children: [
      { market: "ONTARIO CONVENTIONAL GDM" },
      { market: "QUEBEC CONVENTIONAL GDM" },
    ],
  },
  {
    market: "NATIONAL DISCOUNT GDM",
    kind: "national",
    children: [
      { market: "Discount Excluding Walmart" },
      { market: "ONTARIO DISCOUNT GDM" },
      { market: "QUEBEC DISCOUNT GDM" },
    ],
  },
  {
    market: "LCL NATIONAL",
    kind: "account",
    children: [
      { market: "LCL NATIONAL SUPERMARKETS DIV" },
      { market: "LCL NATIONAL MARKET DIVISION" },
      { market: "FORTINO'S" },
      {
        market: "TOTAL RCSS",
        children: [
          { market: "RCSS ONTARIO" },
          { market: "RCSS TOTAL WEST" },
        ],
      },
      {
        market: "LCL NATIONAL HARD DISCOUNT DIVISION",
        children: [
          { market: "NO FRILLS NATIONAL" },
          { market: "LCL QUEBEC HARD DISCOUNT DIV" },
        ],
      },
      { market: "SDM NATIONAL" },
    ],
  },
  {
    market: "SOBEYS INC NATIONAL INCL NFLD EX LAWTONS",
    kind: "account",
    children: [
      { market: "SOBEYS FULL SERVICE NATIONAL INCL NFLD" },
      {
        market: "FRESHCO",
        children: [
          { market: "FRESHCO ONTARIO" },
          { market: "FRESHCO TOTAL WEST" },
        ],
      },
      { market: "IGA QUEBEC" },
    ],
  },
  {
    market: "METRO INC GROCERY BANNERS",
    kind: "account",
    children: [
      {
        market: "METRO/FOOD BASICS ONTARIO",
        children: [
          { market: "METRO ONTARIO" },
          { market: "FOOD BASICS ONTARIO" },
        ],
      },
      {
        market: "METRO/SUPER C QUEBEC",
        children: [
          { market: "METRO QUEBEC" },
          { market: "SUPER C QUEBEC" },
        ],
      },
    ],
  },
  { market: "CANADIAN TIRE NATIONAL", kind: "account" },
  { market: "SAVE ON FOODS WEST", kind: "account" },
  { market: "FEDERATED COOP", kind: "account" },
];

const state = {
  activeView: "executiveSummary",
  data: null,
  loading: true,
  error: null,
  auth: {
    checking: true,
    submitting: false,
    user: null,
    error: null,
  },
  executiveExpanded: new Set(),
  categoryExpanded: new Set(),
  customerSummaryExpanded: new Set(),
  customerDetailExpanded: new Set(),
  navGroupsExpanded: new Set([BUSINESS_COFFEE, BUSINESS_SOUP]),
  viewFilters: {},
};

const app = document.querySelector("#app");

function viewConfig(id = state.activeView) {
  return VIEW_CONFIGS.find((view) => view.id === id) || VIEW_CONFIGS[0];
}

function defaultFilters(config) {
  return {
    market: config.defaultMarket || DEFAULT_MARKET,
    benchmarkMarket: config.defaultBenchmarkMarket || DEFAULT_MARKET,
    period: config.defaultPeriod || "",
    product: config.defaultProduct || "Tim Hortons",
    competitorMode: "aggregate",
  };
}

function activeBusiness() {
  return viewConfig().business || BUSINESS_COFFEE;
}

function businessLabel(business = activeBusiness()) {
  return BUSINESS_LABELS[business] || BUSINESS_LABELS[BUSINESS_COFFEE];
}

function businessData(business = activeBusiness()) {
  if (state.data?.businesses) {
    if (business === BUSINESS_SOUP) return state.data.businesses.soupChili;
    if (business === BUSINESS_COFFEE) return state.data.businesses.coffee;
  }
  return state.data;
}

function metricColumnsWithGrouping(groups) {
  return groups.flatMap((group, groupIndex) =>
    group.columns.map((column, columnIndex) => ({
      ...column,
      tone: group.tone,
      groupIndex,
      columnIndex,
      subgroupStart: columnIndex > 0 && METRIC_SUBGROUP_START_KEYS.has(column.key),
    })),
  );
}

function metricColumnClass(column) {
  return [
    column.tone,
    column.columnIndex === 0 ? "metric-group-start" : "",
    column.subgroupStart ? "metric-subgroup-start" : "",
  ]
    .filter(Boolean)
    .map(escapeHtml)
    .join(" ");
}

function metricGroupHeaderClass(group, index) {
  return [group.tone, index > 0 ? "metric-group-start" : ""].filter(Boolean).map(escapeHtml).join(" ");
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

function trendDirection(value) {
  if (value == null || Math.abs(value) < 0.05) return "flat";
  return value > 0 ? "up" : "down";
}

function resetSessionViewState() {
  state.activeView = "executiveSummary";
  state.executiveExpanded = new Set();
  state.categoryExpanded = new Set();
  state.customerSummaryExpanded = new Set();
  state.customerDetailExpanded = new Set();
  state.navGroupsExpanded = new Set([BUSINESS_COFFEE, BUSINESS_SOUP]);
  state.viewFilters = {};
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
  if (state.auth.checking || !state.auth.user) {
    app.innerHTML = loginView();
    bindAuthInteractions();
    return;
  }

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
          <img class="brand-logo" src="${logoUrl}" alt="TimsIQ">
          <span>Tim Hortons CPG</span>
        </div>
        <nav class="nav-list" aria-label="Dashboard views">
          ${navTree()}
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
            <span class="meta-logo-pill"><img src="${logoUrl}" alt="TimsIQ"></span>
            <span>${escapeHtml(state.data?.filters?.period || activeFilters().period || "")}</span>
            <span>${state.data?.counts?.apiRowsLoaded?.toLocaleString() || "live"} API rows</span>
            <button class="logout-button" id="logoutButton" type="button">Sign Out</button>
          </div>
        </header>
        ${content}
      </main>
    </div>
  `;
}

function loginView() {
  const disabled = state.auth.checking || state.auth.submitting;
  return `
    <main class="login-shell">
      <section class="login-hero" aria-label="TimsIQ">
        <img src="${logoUrl}" alt="TimsIQ">
      </section>
      <section class="login-panel">
        <form class="login-card" id="loginForm">
          <img class="login-logo" src="${logoUrl}" alt="TimsIQ">
          <div class="login-copy">
            <span>Tim Hortons CPG</span>
            <h1>Sign In</h1>
          </div>
          <label>
            <span>Username</span>
            <input name="username" type="text" autocomplete="username" required ${disabled ? "disabled" : ""}>
          </label>
          <label>
            <span>Password</span>
            <input name="password" type="password" autocomplete="current-password" required ${disabled ? "disabled" : ""}>
          </label>
          ${state.auth.error ? `<p class="login-error">${escapeHtml(state.auth.error)}</p>` : ""}
          <button class="login-button" type="submit" ${disabled ? "disabled" : ""}>
            ${state.auth.checking ? "Checking session" : state.auth.submitting ? "Signing in" : "Sign In"}
          </button>
        </form>
      </section>
    </main>
  `;
}

function navItem(config) {
  const iconName = config.kind?.includes("customer")
    ? "customer"
    : config.kind?.includes("Detail") || config.kind?.includes("detail")
      ? "detail"
      : config.kind === "overview"
        ? "overview"
        : "summary";
  return `
    <button class="nav-item ${config.id === state.activeView ? "active" : ""}" type="button" data-view="${config.id}">
      ${icon(iconName)}
      <span>${escapeHtml(config.label)}</span>
    </button>
  `;
}

function navTree() {
  const standalone = VIEW_CONFIGS.filter((config) => !config.navGroup).map(navItem).join("");
  const grouped = NAV_GROUPS.map(navGroup).join("");
  return `${standalone}${grouped}`;
}

function navGroup(group) {
  const items = VIEW_CONFIGS.filter((config) => config.navGroup === group.id);
  const expanded = state.navGroupsExpanded.has(group.id);
  const active = items.some((item) => item.id === state.activeView);
  return `
    <section class="nav-group ${expanded ? "expanded" : ""} ${active ? "active" : ""}">
      <button class="nav-group-toggle" type="button" data-nav-group="${escapeHtml(group.id)}" aria-expanded="${expanded ? "true" : "false"}">
        <span>${escapeHtml(group.label)}</span>
        <span class="nav-chevron" aria-hidden="true"></span>
      </button>
      <div class="nav-group-items">
        ${expanded ? items.map(navItem).join("") : ""}
      </div>
    </section>
  `;
}

function renderActiveView() {
  const config = viewConfig();
  const filters = state.data.filters;
  const controls = renderToolbar(config, filters);

  if (config.kind === "executive") {
    return `${controls}${renderExecutiveSummary()}`;
  }
  if (config.kind === "overview") {
    return `${controls}${renderOverview()}`;
  }
  if (config.kind === "categorySummary") {
    return `${controls}${renderCategorySummary()}`;
  }
  if (config.kind === "categoryDetail") {
    return `${controls}${renderCategoryDetail()}`;
  }
  if (config.kind === "customerSummary") {
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

function renderExecutiveSummary() {
  const coffee = businessData(BUSINESS_COFFEE);
  const soup = businessData(BUSINESS_SOUP);
  const coffeeRows = flattenExecutiveTree(executiveSummaryTree(BUSINESS_COFFEE, coffee));
  const soupRows = flattenExecutiveTree(executiveSummaryTree(BUSINESS_SOUP, soup));
  return `
    <section class="view-strip">
      ${metricPill("Market", coffee?.filters?.market || state.data.filters.market)}
      ${metricPill("Coffee Time Frame", coffee?.filters?.period || "")}
      ${metricPill("Soup & Chili Time Frame", soup?.filters?.period || "")}
    </section>
    <section class="workbook-card executive-summary-card">
      <header>
        <h2>Coffee Executive Summary</h2>
        <span>${escapeHtml(coffee?.filters?.market || "")} | ${escapeHtml(coffee?.filters?.period || "")}</span>
      </header>
      ${executiveSummaryTable(coffeeRows)}
    </section>
    <section class="workbook-card executive-summary-card executive-secondary-card">
      <header>
        <h2>Soup & Chili Executive Summary</h2>
        <span>${escapeHtml(soup?.filters?.market || "")} | ${escapeHtml(soup?.filters?.period || "")}</span>
      </header>
      ${executiveSummaryTable(soupRows)}
    </section>
  `;
}

function executiveSummaryTree(business = BUSINESS_COFFEE, data = state.data) {
  if (business === BUSINESS_SOUP) {
    return soupExecutiveTree(data);
  }
  const rows = data?.views?.category?.rows || [];
  const lookup = categoryLookup(rows);
  return [
    categoryNode({
      key: `${business}:executive:total`,
      label: "Total Coffee",
      row: findCategoryRow(lookup, "topline_brands", "Tim Hortons"),
      kind: "total",
    }),
    rgSegmentNode(lookup, "Tim Hortons", `${business}:executive`),
    singleServeSegmentNode(lookup, "Tim Hortons", `${business}:executive`),
    instantSegmentNode(lookup, "Tim Hortons", `${business}:executive`),
  ].filter(Boolean);
}

function soupExecutiveTree(data = state.data) {
  const rows = data?.views?.category?.rows || [];
  const lookup = categoryLookup(rows);
  const children = SOUP_CATEGORY_DEFINITIONS.map((definition) =>
    categoryNode({
      key: `${BUSINESS_SOUP}:executive:${definition.key}`,
      label: definition.label,
      row: findCategoryRow(
        lookup,
        definition.sourcePullType,
        definition.children.find((child) => child.label === "Tim Hortons")?.product,
      ),
      kind: "segment",
    }),
  ).filter(Boolean);

  return [
    categoryNode({
      key: `${BUSINESS_SOUP}:executive:total`,
      label: "Soup & Chili",
      row: aggregateExecutiveRows(children.map((node) => node.row)),
      kind: "total",
      children,
    }),
  ].filter(Boolean);
}

function aggregateExecutiveRows(rows) {
  const validRows = rows.filter(Boolean);
  if (!validRows.length) return null;
  const row = {
    dollarSales000: sumMetric(validRows, "dollarSales000"),
    dollarSalesChangeYa000: sumMetric(validRows, "dollarSalesChangeYa000"),
    units000: sumMetric(validRows, "units000"),
    unitsChangeYa000: sumMetric(validRows, "unitsChangeYa000"),
    pounds000: sumMetric(validRows, "pounds000"),
    poundsChangeYa000: sumMetric(validRows, "poundsChangeYa000"),
  };
  row.dollarPctChangeYa = pctChangeFromCurrentAndDelta(row.dollarSales000, row.dollarSalesChangeYa000);
  row.unitsPctChangeYa = pctChangeFromCurrentAndDelta(row.units000, row.unitsChangeYa000);
  row.poundsPctChangeYa = pctChangeFromCurrentAndDelta(row.pounds000, row.poundsChangeYa000);
  row.avgUnitsPrice = row.units000 ? row.dollarSales000 / row.units000 : null;
  row.avgUnitsPricePctChangeYa = weightedAverage(validRows, "avgUnitsPricePctChangeYa", "dollarSales000");
  row.soldOnPromoPct = weightedAverage(validRows, "soldOnPromoPct", "dollarSales000");
  row.soldOnPromoChangeYaPct = weightedAverage(validRows, "soldOnPromoChangeYaPct", "dollarSales000");
  row.acvPct = weightedAverage(validRows, "acvPct", "dollarSales000");
  row.acvPctChangeYa = weightedAverage(validRows, "acvPctChangeYa", "dollarSales000");
  return row;
}

function sumMetric(rows, key) {
  const values = rows.map((row) => row?.[key]).filter((value) => value != null);
  return values.length ? values.reduce((total, value) => total + value, 0) : null;
}

function pctChangeFromCurrentAndDelta(current, delta) {
  if (current == null || delta == null) return null;
  const prior = current - delta;
  return prior ? (delta / prior) * 100 : null;
}

function weightedAverage(rows, key, weightKey) {
  let weightedTotal = 0;
  let weightTotal = 0;
  rows.forEach((row) => {
    const value = row?.[key];
    const weight = row?.[weightKey];
    if (value == null || weight == null || weight <= 0) return;
    weightedTotal += value * weight;
    weightTotal += weight;
  });
  return weightTotal ? weightedTotal / weightTotal : null;
}

function flattenExecutiveTree(nodes, depth = 0) {
  return nodes.flatMap((node) => {
    const row = { ...node, depth, isExpanded: state.executiveExpanded.has(node.key) };
    if (!row.isExpanded || !node.children.length) return [row];
    return [row, ...flattenExecutiveTree(node.children, depth + 1)];
  });
}

function executiveSummaryTable(rows) {
  if (!rows.length) return emptyPanel("No Tim Hortons rows for this market and time frame.");
  return `
    <div class="workbook-table-wrap executive-table-wrap">
      <table class="workbook-table executive-summary-table">
        <colgroup>
          <col class="executive-label-col">
          ${EXECUTIVE_METRIC_COLUMNS.map((column) => `<col class="workbook-metric-col ${metricColumnClass(column)}">`).join("")}
        </colgroup>
        <thead>
          <tr class="workbook-group-row">
            <th class="sticky-one" rowspan="2">Tim Hortons / Segment / Format</th>
            ${EXECUTIVE_METRIC_GROUPS.map((group, index) => `<th class="${metricGroupHeaderClass(group, index)}" colspan="${group.columns.length}">${escapeHtml(group.title)}</th>`).join("")}
          </tr>
          <tr class="workbook-column-row">
            ${EXECUTIVE_METRIC_COLUMNS.map((column) => `<th class="${metricColumnClass(column)}">${escapeHtml(column.label)}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${rows.map(executiveSummaryRow).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function executiveSummaryRow(node) {
  const expandable = node.children.length > 0;
  return `
    <tr class="workbook-row executive-${node.kind} depth-${node.depth}">
      <th class="sticky-one hierarchy-label">
        <span class="tree-indent" style="--depth:${node.depth}"></span>
        ${
          expandable
            ? `<button class="tree-toggle" type="button" aria-expanded="${node.isExpanded ? "true" : "false"}" data-executive-toggle="${escapeHtml(node.key)}">${node.isExpanded ? "-" : "+"}</button>`
            : `<span class="tree-spacer"></span>`
        }
        <span>${escapeHtml(node.label)}</span>
      </th>
      ${EXECUTIVE_METRIC_COLUMNS.map((column) => workbookMetricCell(node.row, column)).join("")}
    </tr>
  `;
}

function renderOverview() {
  const data = state.data;
  const overview = data.views.overview;
  const filters = activeFilters();
  const showBrands = filters.competitorMode === "brands";
  const sections = showBrands ? overview.brandSections || overview.sections : overview.sections;

  return `
    <section class="dashboard-actions">
      <div class="dashboard-context">
        ${metricPill("Target", overview.targetMarket)}
        ${metricPill("Benchmark", overview.benchmarkMarket)}
        ${metricPill("Time Frame", overview.period)}
      </div>
      <label class="switch-control">
        <input id="competitorMode" type="checkbox" ${showBrands ? "checked" : ""}>
        <span class="switch-track" aria-hidden="true"><span></span></span>
        <strong>Specific competitor brands</strong>
      </label>
    </section>
    <section class="excel-scorecard">
      <header>
        <h2>${escapeHtml(overview.title)}</h2>
        <span>${showBrands ? "Competitive brands expanded" : "Competitive brands aggregated"}</span>
      </header>
      ${dashboardScorecard(sections, overview)}
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

function dashboardScorecard(sections, overview) {
  return `
    <div class="scorecard-wrap">
      <table class="scorecard-table">
        <colgroup>
          <col class="scorecard-label-col">
          ${Array.from({ length: 14 }, () => `<col class="scorecard-metric-col">`).join("")}
        </colgroup>
        <thead>
          <tr class="scorecard-group-row">
            <th class="sticky-col"></th>
            <th colspan="3">Development</th>
            <th class="scorecard-group-start" colspan="5">Performance</th>
            <th class="scorecard-group-start" colspan="6">Casuals</th>
          </tr>
          <tr class="scorecard-subhead-row">
            <th class="sticky-col" rowspan="2">Key Manufacturers / Brands / Pack Groups</th>
            <th colspan="2">$ Shr - Product</th>
            <th>Index</th>
            <th class="scorecard-group-start">$ (000)</th>
            <th>$ % Chg YA</th>
            <th class="scorecard-benchmark-start">$ (000)</th>
            <th>$ % Chg YA</th>
            <th>Delta</th>
            <th class="scorecard-group-start">Avg Units Price Chg YA</th>
            <th>% Sold on Promo Chg YA</th>
            <th>% ACV % Chg YA</th>
            <th class="scorecard-benchmark-start">Avg Units Price Chg YA</th>
            <th>% Sold on Promo Chg YA</th>
            <th>% ACV % Chg YA</th>
          </tr>
          <tr class="scorecard-market-row">
            <th>${escapeHtml(overview.targetMarket)}</th>
            <th class="scorecard-benchmark-start">${escapeHtml(overview.benchmarkMarket)}</th>
            <th>Index</th>
            <th class="scorecard-group-start" colspan="2">${escapeHtml(overview.targetMarket)}</th>
            <th class="scorecard-benchmark-start" colspan="2">${escapeHtml(overview.benchmarkMarket)}</th>
            <th>% Chg</th>
            <th class="scorecard-group-start" colspan="3">${escapeHtml(overview.targetMarket)}</th>
            <th class="scorecard-benchmark-start" colspan="3">${escapeHtml(overview.benchmarkMarket)}</th>
          </tr>
        </thead>
        <tbody>
          ${sections.map(dashboardSection).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function dashboardSection(section) {
  const [totalRow, ...detailRows] = section.rows;
  return `
    <tr class="section-total">
      <th class="sticky-col">${escapeHtml(section.title)}</th>
      ${dashboardMetricCells(totalRow)}
    </tr>
    ${detailRows.map((row) => dashboardRow(row)).join("")}
  `;
}

function dashboardRow(row) {
  return `
    <tr class="${row.kind === "brand" ? "brand-row" : ""}">
      <th class="sticky-col">${escapeHtml(row.label)}</th>
      ${dashboardMetricCells(row)}
    </tr>
  `;
}

function dashboardMetricCells(row) {
  const m = row?.metrics || {};
  return `
    ${plainCell(percent(m.targetShare))}
    ${plainCell(percent(m.benchmarkShare), "scorecard-benchmark-start")}
    ${indexCell(m.shareIndex)}
    ${plainCell(wholeNumber(m.targetSales000), "scorecard-group-start")}
    ${trendCell(m.targetSalesPctChangeYa, percent)}
    ${plainCell(wholeNumber(m.benchmarkSales000), "scorecard-benchmark-start")}
    ${trendCell(m.benchmarkSalesPctChangeYa, percent)}
    ${trendCell(m.salesPctChangeDelta, percent)}
    ${trendCell(m.targetAvgUnitsPriceChangeYa, currency, "scorecard-group-start")}
    ${trendCell(m.targetSoldOnPromoChangeYaPct, percent)}
    ${trendCell(m.targetAcvPctChangeYa, percent)}
    ${trendCell(m.benchmarkAvgUnitsPriceChangeYa, currency, "scorecard-benchmark-start")}
    ${trendCell(m.benchmarkSoldOnPromoChangeYaPct, percent)}
    ${trendCell(m.benchmarkAcvPctChangeYa, percent)}
  `;
}

function wholeNumber(value) {
  if (value == null) return "n/a";
  return value.toLocaleString(undefined, {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });
}

function changeNumber(value, digits = 1) {
  if (value == null) return "n/a";
  const formatted = Math.abs(value).toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });
  return value < 0 ? `(${formatted})` : formatted;
}

function plainCell(value, className = "") {
  return `<td${className ? ` class="${escapeHtml(className)}"` : ""}>${escapeHtml(value)}</td>`;
}

function indexCell(value, extraClass = "") {
  const indexClass = value == null ? "neutral" : value < 100 ? "index-low" : value > 100 ? "index-high" : "index-neutral";
  return `<td class="index-cell ${indexClass} ${escapeHtml(extraClass)}">${escapeHtml(indexValue(value))}</td>`;
}

function trendCell(value, formatter, className = "") {
  const direction = trendDirection(value);
  return `
    <td class="trend-cell ${direction} ${escapeHtml(className)}">
      <span class="trend-marker ${direction}" aria-hidden="true"></span>
      <span>${escapeHtml(formatter(value))}</span>
    </td>
  `;
}

function renderCategorySummary() {
  const tree = categorySummaryTree();
  const rows = flattenCategoryTree(tree);
  const label = businessLabel();
  return `
    <section class="view-strip">
      ${metricPill("Market", state.data.filters.market)}
      ${metricPill("Time Frame", state.data.filters.period)}
      ${metricPill("Visible Rows", rows.length.toLocaleString())}
    </section>
    <section class="category-summary-card">
      <header>
        <h2>${escapeHtml(label)} Category Summary</h2>
        <span>${escapeHtml(state.data.filters.market)} | ${escapeHtml(state.data.filters.period)}</span>
      </header>
      ${categorySummaryTable(rows)}
    </section>
  `;
}

function categorySummaryTree() {
  const business = activeBusiness();
  const rows = state.data.views.category.rows;
  if (business === BUSINESS_SOUP) {
    return soupCategoryTree(rows);
  }
  const lookup = categoryLookup(rows);
  const allCoffee = categoryNode({
    key: `${business}:category:all`,
    label: "Packaged Coffee & Instant Coffee",
    row: findCategoryRow(lookup, "topline_brands", "Packaged Coffee & Instant Coffee"),
    kind: "total",
    children: [
      categoryNode({
        key: `${business}:category:all:packaged`,
        label: "Packaged Coffee",
        row: findCategoryRow(lookup, "topline_brands", "Packaged Coffee"),
        kind: "segment",
        children: [
          rgSegmentNode(lookup, null, `${business}:category:all:packaged`),
          singleServeSegmentNode(lookup, null, `${business}:category:all:packaged`),
        ],
      }),
      instantSegmentNode(lookup, null, `${business}:category:all`),
    ],
  });

  const mainBrands = CATEGORY_COMPARE_BRANDS.map((brand) => brandCategoryNode(lookup, brand, `${business}:category:brand:${brand}`));
  const otherBrands = otherBrandNames(rows)
    .map((brand) => brandCategoryNode(lookup, brand, `${business}:category:other:${brand}`, true))
    .filter(Boolean);
  const allOther = categoryNode({
    key: `${business}:category:other`,
    label: "All Other Brands",
    row: findCategoryRow(lookup, "topline_brands", "All Other Brands"),
    kind: "otherTotal",
    children: otherBrands,
  });

  return [allCoffee, ...mainBrands, allOther].filter(Boolean);
}

function soupCategoryTree(rows) {
  const lookup = categoryLookup(rows);
  return SOUP_CATEGORY_DEFINITIONS.map((definition) => soupCategoryNode(lookup, definition, `${BUSINESS_SOUP}:category`, true)).filter(Boolean);
}

function soupCategoryNode(lookup, definition, parentKey, isRoot = false) {
  const sourcePullType = definition.sourcePullType;
  const key = `${parentKey}:${definition.key || definition.product}`;
  return categoryNode({
    key,
    label: definition.label,
    row: findCategoryRow(lookup, sourcePullType, definition.product),
    kind: isRoot ? "total" : definition.children?.length ? "brand" : "detail",
    children: (definition.children || []).map((child) => soupCategoryNode(lookup, { ...child, sourcePullType }, key)),
  });
}

function categoryLookup(rows) {
  const lookup = new Map();
  rows.forEach((row) => {
    lookup.set(`${row.sourcePullType}|${row.product}`, row);
  });
  return lookup;
}

function findCategoryRow(lookup, sourcePullType, products) {
  const productList = Array.isArray(products) ? products : [products];
  for (const product of productList) {
    const row = lookup.get(`${sourcePullType}|${product}`);
    if (row) return row;
  }
  return null;
}

function categoryNode({ key, label, row, kind = "detail", children = [] }) {
  const cleanChildren = children.filter(Boolean);
  if (!row && !cleanChildren.length) return null;
  return { key, label, row, kind, children: cleanChildren };
}

function productCandidates(prefix, label) {
  if (!prefix) return [label];
  const primary = `${prefix} ${label}`;
  if (label.includes("K Cup")) {
    return [primary, primary.replace("K Cup", "Cup")];
  }
  if (label === "Tassimo") {
    return [primary, `${prefix} Tassimo Single Serve`];
  }
  return [primary];
}

function brandCategoryNode(lookup, brand, key, isOther = false) {
  return categoryNode({
    key,
    label: brand,
    row: findCategoryRow(lookup, "topline_brands", brand),
    kind: isOther ? "otherBrand" : "brand",
    children: [
      rgSegmentNode(lookup, brand, key),
      singleServeSegmentNode(lookup, brand, key),
      instantSegmentNode(lookup, brand, key),
    ],
  });
}

function rgSegmentNode(lookup, prefix, parentKey) {
  const baseKey = `${parentKey}:rg`;
  return categoryNode({
    key: baseKey,
    label: "R&G",
    row: findCategoryRow(lookup, "rg", productCandidates(prefix, "R&G")),
    kind: "segment",
    children: [
      formatNode(lookup, prefix, baseKey, "Bag", "rg", ["Small Bag", "Medium Bag", "Large Bag"]),
      formatNode(lookup, prefix, baseKey, "Can", "rg", ["Small Can", "Medium Can", "Large Can"]),
      formatNode(lookup, prefix, baseKey, "Club Format R&G", "rg"),
    ],
  });
}

function singleServeSegmentNode(lookup, prefix, parentKey) {
  const baseKey = `${parentKey}:singleServe`;
  return categoryNode({
    key: baseKey,
    label: "Single Serve",
    row: findCategoryRow(lookup, "single_serve", productCandidates(prefix, "Single Serve")),
    kind: "segment",
    children: [
      formatNode(lookup, prefix, baseKey, "K Cup", "single_serve", ["K Cup Small", "K Cup Large", "K Cup XL", "Club Format K Cup"]),
      formatNode(lookup, prefix, baseKey, "Tassimo", "single_serve"),
      formatNode(lookup, prefix, baseKey, "Caps", "single_serve"),
    ],
  });
}

function instantSegmentNode(lookup, prefix, parentKey) {
  const baseKey = `${parentKey}:instant`;
  return categoryNode({
    key: baseKey,
    label: "Instant Coffee",
    row: findCategoryRow(lookup, "instant", productCandidates(prefix, "Instant Coffee")),
    kind: "segment",
    children: [
      formatNode(lookup, prefix, baseKey, "Instant Regular", "instant"),
      formatNode(lookup, prefix, baseKey, "Instant Grand", "instant"),
    ],
  });
}

function formatNode(lookup, prefix, parentKey, label, sourcePullType, childLabels = []) {
  const key = `${parentKey}:${label}`;
  return categoryNode({
    key,
    label,
    row: findCategoryRow(lookup, sourcePullType, productCandidates(prefix, label)),
    kind: childLabels.length ? "format" : "detail",
    children: childLabels.map((childLabel) =>
      categoryNode({
        key: `${key}:${childLabel}`,
        label: childLabel,
        row: findCategoryRow(lookup, sourcePullType, productCandidates(prefix, childLabel)),
        kind: "size",
      }),
    ),
  });
}

function otherBrandNames(rows) {
  const excluded = new Set([
    "Packaged Coffee & Instant Coffee",
    "Packaged Coffee",
    "Instant Coffee",
    "Tim Hortons",
    "Private Label",
    "Starbucks",
    "McCafe",
    "All Other Brands",
    "Competitive Brands",
  ]);
  const available = new Set(
    rows
      .filter((row) => row.sourcePullType === "topline_brands")
      .map((row) => row.product)
      .filter((product) => product && !excluded.has(product)),
  );
  const ordered = CATEGORY_OTHER_BRAND_ORDER.filter((brand) => available.has(brand));
  const extras = [...available].filter((brand) => !ordered.includes(brand)).sort((a, b) => a.localeCompare(b));
  return [...ordered, ...extras];
}

function flattenCategoryTree(nodes, depth = 0) {
  return nodes.flatMap((node) => {
    const row = { ...node, depth, isExpanded: state.categoryExpanded.has(node.key) };
    if (!row.isExpanded || !node.children.length) return [row];
    return [row, ...flattenCategoryTree(node.children, depth + 1)];
  });
}

function categorySummaryTable(rows) {
  if (!rows.length) return emptyPanel("No category rows for this filter.");
  return `
    <div class="category-table-wrap">
      <table class="category-summary-table">
        <colgroup>
          <col class="category-label-col">
          ${CATEGORY_METRIC_COLUMNS.map((column) => `<col class="category-metric-col ${metricColumnClass(column)}">`).join("")}
        </colgroup>
        <thead>
          <tr class="category-group-row">
            <th class="sticky-col" rowspan="2">Brand / Segment / Format</th>
            ${CATEGORY_METRIC_GROUPS.map((group, index) => `<th class="${metricGroupHeaderClass(group, index)}" colspan="${group.columns.length}">${escapeHtml(group.title)}</th>`).join("")}
          </tr>
          <tr class="category-column-row">
            ${CATEGORY_METRIC_COLUMNS.map((column) => `<th class="${metricColumnClass(column)}">${escapeHtml(column.label)}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${rows.map(categorySummaryRow).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function categorySummaryRow(node) {
  const expandable = node.children.length > 0;
  return `
    <tr class="category-row depth-${node.depth} category-${node.kind}">
      <th class="sticky-col">
        <span class="tree-indent" style="--depth:${node.depth}"></span>
        ${
          expandable
            ? `<button class="tree-toggle" type="button" aria-expanded="${node.isExpanded ? "true" : "false"}" data-category-toggle="${escapeHtml(node.key)}">${node.isExpanded ? "-" : "+"}</button>`
            : `<span class="tree-spacer"></span>`
        }
        <span>${escapeHtml(node.label)}</span>
      </th>
      ${CATEGORY_METRIC_COLUMNS.map((column) => categoryMetricCell(node.row, column)).join("")}
    </tr>
  `;
}

function categoryMetricCell(row, column) {
  const value = row?.[column.key];
  const change = isChangeMetric(column.key);
  const className = change ? deltaClass(value) : "neutral";
  if (!change) {
    return `<td class="${metricColumnClass(column)} neutral">${escapeHtml(column.format(value))}</td>`;
  }
  const direction = trendDirection(value);
  return `
    <td class="${metricColumnClass(column)} change-metric metric-trend ${direction} ${className}">
      <span class="metric-trend-value">
        <span class="trend-marker ${direction}" aria-hidden="true"></span>
        <span>${escapeHtml(column.format(value))}</span>
      </span>
    </td>
  `;
}

function isChangeMetric(key) {
  return key.includes("Change") || key.includes("PctChange") || key.endsWith("PctChangeYa") || key === "dollarPctChangeYa";
}

function filterCategoryTreeBySource(nodes, source) {
  if (source === "all") return nodes;
  return nodes
    .map((node) => {
      const children = filterCategoryTreeBySource(node.children, source);
      const rowMatches = node.row?.sourcePullType === source;
      if (!rowMatches && !children.length) return null;
      return {
        ...node,
        row: rowMatches ? node.row : null,
        kind: rowMatches ? node.kind : "section",
        children,
      };
    })
    .filter(Boolean);
}

function renderCategoryDetail() {
  const tree = categorySummaryTree();
  const rows = flattenCategoryTree(tree);
  const label = businessLabel();
  return `
    <section class="view-strip">
      ${metricPill("Market", state.data.filters.market)}
      ${metricPill("Time Frame", state.data.filters.period)}
      ${metricPill("Visible Rows", rows.length.toLocaleString())}
    </section>
    <section class="workbook-card">
      <header>
        <h2>${escapeHtml(label)} Category Detail</h2>
        <span>${escapeHtml(state.data.filters.market)} | ${escapeHtml(state.data.filters.period)}</span>
      </header>
      ${categoryDetailTable(rows)}
    </section>
  `;
}

function categoryDetailTable(rows) {
  if (!rows.length) return emptyPanel("No category detail rows for this filter.");
  return `
    <div class="workbook-table-wrap">
      <table class="workbook-table category-detail-table">
        <colgroup>
          <col class="category-detail-label-col">
          ${DETAIL_METRIC_COLUMNS.map((column) => `<col class="workbook-metric-col ${metricColumnClass(column)}">`).join("")}
        </colgroup>
        <thead>
          <tr class="workbook-group-row">
            <th class="sticky-one" rowspan="2">Brand / Segment / Format</th>
            ${DETAIL_METRIC_GROUPS.map((group, index) => `<th class="${metricGroupHeaderClass(group, index)}" colspan="${group.columns.length}">${escapeHtml(group.title)}</th>`).join("")}
          </tr>
          <tr class="workbook-column-row">
            ${DETAIL_METRIC_COLUMNS.map((column) => `<th class="${metricColumnClass(column)}">${escapeHtml(column.label)}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${rows.map(categoryDetailRow).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function categoryDetailRow(node) {
  const expandable = node.children.length > 0;
  const rawBrand = categoryBrandLabel(node);
  const title = rawBrand && rawBrand !== node.label ? ` title="Brand: ${escapeHtml(rawBrand)}"` : "";
  return `
    <tr class="workbook-row depth-${node.depth} category-${node.kind}">
      <th class="sticky-one hierarchy-label"${title}>
        <span class="tree-indent" style="--depth:${node.depth}"></span>
        ${
          expandable
            ? `<button class="tree-toggle" type="button" aria-expanded="${node.isExpanded ? "true" : "false"}" data-category-toggle="${escapeHtml(node.key)}">${node.isExpanded ? "-" : "+"}</button>`
            : `<span class="tree-spacer"></span>`
        }
        <span>${escapeHtml(node.label)}</span>
      </th>
      ${DETAIL_METRIC_COLUMNS.map((column) => workbookMetricCell(node.row, column)).join("")}
    </tr>
  `;
}

function categoryBrandLabel(node) {
  if (node.row?.brand) return node.row.brand;
  if (node.kind === "brand" || node.kind === "otherBrand") return node.label;
  return "";
}

function renderCustomerSummary() {
  const rows = flattenCustomerTree(customerTree(), state.customerSummaryExpanded);
  const label = businessLabel();
  return `
    <section class="view-strip">
      ${metricPill("Product", state.data.filters.product)}
      ${metricPill("Time Frame", state.data.filters.period)}
      ${metricPill("Visible Rows", rows.length.toLocaleString())}
    </section>
    <section class="workbook-card">
      <header>
        <h2>${escapeHtml(label)} Customer Summary</h2>
        <span>${escapeHtml(state.data.filters.product)} | ${escapeHtml(state.data.filters.period)}</span>
      </header>
      ${customerSummaryTable(rows)}
    </section>
  `;
}

function renderCustomerDetail() {
  const rows = flattenCustomerTree(customerTree(), state.customerDetailExpanded);
  const label = businessLabel();
  return `
    <section class="view-strip">
      ${metricPill("Product", state.data.filters.product)}
      ${metricPill("Period", state.data.filters.period)}
      ${metricPill("Visible Rows", rows.length.toLocaleString())}
    </section>
    <section class="workbook-card">
      <header>
        <h2>${escapeHtml(label)} Customer Detail</h2>
        <span>${escapeHtml(state.data.filters.product)} | ${escapeHtml(state.data.filters.period)}</span>
      </header>
      ${customerDetailTable(rows)}
    </section>
  `;
}

function customerTree() {
  const rows = state.data.views.customer.rows;
  const lookup = new Map(rows.map((row) => [row.market, row]));
  const knownMarkets = new Set();
  collectCustomerMarkets(CUSTOMER_TREE, knownMarkets);
  const core = CUSTOMER_TREE.map((definition) => customerNode(definition, lookup)).filter(Boolean);
  const extras = rows
    .filter((row) => row.market && !knownMarkets.has(row.market))
    .sort((a, b) => (b.dollarSales000 || 0) - (a.dollarSales000 || 0))
    .map((row) => ({ key: `customer:${row.market}`, label: row.market, row, kind: "extra", children: [] }));
  return [...core, ...extras];
}

function collectCustomerMarkets(definitions, output) {
  definitions.forEach((definition) => {
    output.add(definition.market);
    collectCustomerMarkets(definition.children || [], output);
  });
}

function customerNode(definition, lookup) {
  const children = (definition.children || []).map((child) => customerNode(child, lookup)).filter(Boolean);
  const row = lookup.get(definition.market) || null;
  if (!row && !children.length) return null;
  return {
    key: `customer:${definition.market}`,
    label: definition.market,
    row,
    kind: definition.kind || (children.length ? "group" : "market"),
    children,
  };
}

function flattenCustomerTree(nodes, expandedSet, depth = 0) {
  return nodes.flatMap((node) => {
    const row = { ...node, depth, isExpanded: expandedSet.has(node.key) };
    if (!row.isExpanded || !node.children.length) return [row];
    return [row, ...flattenCustomerTree(node.children, expandedSet, depth + 1)];
  });
}

function customerSummaryTable(rows) {
  if (!rows.length) return emptyPanel("No customer rows for this product and time frame.");
  return `
    <div class="workbook-table-wrap">
      <table class="workbook-table customer-summary-table">
        <colgroup>
          <col class="customer-label-col">
          ${CATEGORY_METRIC_COLUMNS.map((column) => `<col class="workbook-metric-col ${metricColumnClass(column)}">`).join("")}
        </colgroup>
        <thead>
          <tr class="workbook-group-row">
            <th class="sticky-one" rowspan="2">All Markets / Customers / Banners</th>
            ${CATEGORY_METRIC_GROUPS.map((group, index) => `<th class="${metricGroupHeaderClass(group, index)}" colspan="${group.columns.length}">${escapeHtml(group.title)}</th>`).join("")}
          </tr>
          <tr class="workbook-column-row">
            ${CATEGORY_METRIC_COLUMNS.map((column) => `<th class="${metricColumnClass(column)}">${escapeHtml(column.label)}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${rows.map((node) => customerTableRow(node, CATEGORY_METRIC_COLUMNS, "summary")).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function customerDetailTable(rows) {
  if (!rows.length) return emptyPanel("No customer detail rows for this product and time frame.");
  return `
    <div class="workbook-table-wrap">
      <table class="workbook-table customer-detail-table">
        <colgroup>
          <col class="customer-label-col">
          ${DETAIL_METRIC_COLUMNS.map((column) => `<col class="workbook-metric-col ${metricColumnClass(column)}">`).join("")}
        </colgroup>
        <thead>
          <tr class="workbook-group-row">
            <th class="sticky-one" rowspan="2">All Markets / Customers / Banners</th>
            ${DETAIL_METRIC_GROUPS.map((group, index) => `<th class="${metricGroupHeaderClass(group, index)}" colspan="${group.columns.length}">${escapeHtml(group.title)}</th>`).join("")}
          </tr>
          <tr class="workbook-column-row">
            ${DETAIL_METRIC_COLUMNS.map((column) => `<th class="${metricColumnClass(column)}">${escapeHtml(column.label)}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${rows.map((node) => customerTableRow(node, DETAIL_METRIC_COLUMNS, "detail")).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function customerTableRow(node, columns, scope) {
  const expandable = node.children.length > 0;
  const toggleAttribute = scope === "detail" ? "data-customer-detail-toggle" : "data-customer-summary-toggle";
  return `
    <tr class="workbook-row customer-${node.kind} depth-${node.depth}">
      <th class="sticky-one hierarchy-label">
        <span class="tree-indent" style="--depth:${node.depth}"></span>
        ${
          expandable
            ? `<button class="tree-toggle" type="button" aria-expanded="${node.isExpanded ? "true" : "false"}" ${toggleAttribute}="${escapeHtml(node.key)}">${node.isExpanded ? "-" : "+"}</button>`
            : `<span class="tree-spacer"></span>`
        }
        <span>${escapeHtml(node.label)}</span>
      </th>
      ${columns.map((column) => workbookMetricCell(node.row, column)).join("")}
    </tr>
  `;
}

function workbookMetricCell(row, column) {
  const value = row?.[column.key];
  const change = isChangeMetric(column.key);
  const className = change ? deltaClass(value) : "neutral";
  if (!change) {
    return `<td class="${metricColumnClass(column)} neutral">${escapeHtml(column.format(value))}</td>`;
  }
  const direction = trendDirection(value);
  return `
    <td class="${metricColumnClass(column)} change-metric metric-trend ${direction} ${className}">
      <span class="metric-trend-value">
        <span class="trend-marker ${direction}" aria-hidden="true"></span>
        <span>${escapeHtml(column.format(value))}</span>
      </span>
    </td>
  `;
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

function bindAuthInteractions() {
  const form = document.querySelector("#loginForm");
  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const username = String(formData.get("username") || "").trim();
    const password = String(formData.get("password") || "");
    if (!username || !password) return;

    state.auth.submitting = true;
    state.auth.error = null;
    render();

    try {
      const email = await resolveLoginEmail(username);
      await account.createEmailPasswordSession({ email, password });
      state.auth.user = await account.get();
      state.auth.submitting = false;
      state.loading = true;
      await loadDashboard();
    } catch (error) {
      state.auth.submitting = false;
      state.auth.user = null;
      state.auth.error = authErrorMessage(error);
      render();
    }
  });
}

async function resolveLoginEmail(username) {
  if (username.includes("@")) return username;

  const response = await fetch("/api/resolve-user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.detail || payload.error || "Username not found.");
  }
  if (!payload.email) {
    throw new Error("Username not found.");
  }
  return payload.email;
}

async function initializeAuth() {
  render();
  try {
    state.auth.user = await account.get();
    state.auth.error = null;
    state.auth.checking = false;
    state.loading = true;
    await loadDashboard();
  } catch {
    state.auth.user = null;
    state.auth.checking = false;
    state.loading = false;
    resetSessionViewState();
    render();
  }
}

async function signOut() {
  try {
    await account.deleteSession({ sessionId: "current" });
  } catch {
    // The local UI should still reset if the server-side session is already gone.
  }
  state.auth.user = null;
  state.auth.error = null;
  state.data = null;
  state.error = null;
  state.loading = false;
  resetSessionViewState();
  render();
}

async function dashboardAuthHeaders() {
  try {
    const token = await account.createJWT();
    return {
      Authorization: `Bearer ${token.jwt}`,
    };
  } catch (error) {
    state.auth.user = null;
    state.auth.error = "Your session expired. Sign in again.";
    resetSessionViewState();
    throw error;
  }
}

function authErrorMessage(error) {
  const message = error instanceof Error ? error.message : String(error);
  if (message.toLowerCase().includes("failed to fetch") || message.toLowerCase().includes("networkerror")) {
    return `Cannot reach Appwrite from ${window.location.hostname}. Add this hostname as an Appwrite Web platform, then redeploy with the VITE_APPWRITE_* environment variables.`;
  }
  if (message.toLowerCase().includes("invalid credentials")) {
    return "The username or password is incorrect.";
  }
  if (message.toLowerCase().includes("username not found")) {
    return "The username or password is incorrect.";
  }
  if (message.toLowerCase().includes("users lookup failed") || message.toLowerCase().includes("unable to resolve username")) {
    return "Username login is not fully configured. Make sure the Appwrite API key has users read access.";
  }
  return message || "Unable to sign in.";
}

function bindInteractions() {
  document.querySelectorAll("[data-nav-group]").forEach((button) => {
    button.addEventListener("click", () => {
      toggleSetValue(state.navGroupsExpanded, button.dataset.navGroup);
      render();
    });
  });

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

  const competitorMode = document.querySelector("#competitorMode");
  competitorMode?.addEventListener("change", (event) => {
    activeFilters().competitorMode = event.target.checked ? "brands" : "aggregate";
    render();
  });

  document.querySelectorAll("[data-executive-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      toggleSetValue(state.executiveExpanded, button.dataset.executiveToggle);
      renderPreservingTableScroll();
    });
  });

  document.querySelectorAll("[data-category-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.categoryToggle;
      if (!key) return;
      if (state.categoryExpanded.has(key)) {
        state.categoryExpanded.delete(key);
      } else {
        state.categoryExpanded.add(key);
      }
      renderPreservingTableScroll();
    });
  });

  document.querySelectorAll("[data-customer-summary-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      toggleSetValue(state.customerSummaryExpanded, button.dataset.customerSummaryToggle);
      renderPreservingTableScroll();
    });
  });

  document.querySelectorAll("[data-customer-detail-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      toggleSetValue(state.customerDetailExpanded, button.dataset.customerDetailToggle);
      renderPreservingTableScroll();
    });
  });

  document.querySelector("#logoutButton")?.addEventListener("click", () => {
    signOut();
  });
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

function toggleSetValue(set, value) {
  if (!value) return;
  if (set.has(value)) {
    set.delete(value);
  } else {
    set.add(value);
  }
}

function activeTableScroller() {
  return document.querySelector(".workbook-table-wrap, .category-table-wrap, .scorecard-wrap");
}

function renderPreservingTableScroll() {
  const scroller = activeTableScroller();
  const snapshot = scroller
    ? { top: scroller.scrollTop, left: scroller.scrollLeft, windowX: window.scrollX, windowY: window.scrollY }
    : { top: 0, left: 0, windowX: window.scrollX, windowY: window.scrollY };

  render();

  requestAnimationFrame(() => {
    const nextScroller = activeTableScroller();
    if (nextScroller) {
      nextScroller.scrollTop = snapshot.top;
      nextScroller.scrollLeft = snapshot.left;
    }
    window.scrollTo(snapshot.windowX, snapshot.windowY);
  });
}

async function loadDashboard() {
  state.error = null;
  if (!state.data) state.loading = true;
  render();

  const config = viewConfig();
  const filters = activeFilters();
  const params = new URLSearchParams();

  params.set("business", config.business || BUSINESS_COFFEE);
  if (config.controls.includes("market") && filters.market) params.set("market", filters.market);
  if (config.controls.includes("benchmarkMarket") && filters.benchmarkMarket) params.set("benchmarkMarket", filters.benchmarkMarket);
  if (config.controls.includes("period") && filters.period) params.set("period", filters.period);
  if (config.controls.includes("product") && filters.product) params.set("product", filters.product);

  try {
    const query = params.toString();
    const response = await fetch(`/api/dashboard${query ? `?${query}` : ""}`, {
      headers: await dashboardAuthHeaders(),
    });
    const contentType = response.headers.get("content-type") || "";
    const payload = contentType.includes("application/json")
      ? await response.json()
      : { detail: await response.text() };
    if (!response.ok) {
      if (response.status === 401) {
        state.auth.user = null;
        state.auth.error = payload.detail || "Please sign in again.";
        resetSessionViewState();
      }
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
    if (state.auth.user) {
      state.error = error instanceof Error ? error.message : String(error);
    }
  } finally {
    state.loading = false;
    render();
  }
}

initializeAuth();
