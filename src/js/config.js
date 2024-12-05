const SEARCH_QUERY = new URLSearchParams(window.location.search).get("coin");
const SINGLE_QUOTE_WIDGET_URL =
  "https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js";
const CHART_WIDGET_URL =
  "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
const SYMBOL_OVERVIEW_WIDGET_URL =
  "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
const BASE_API_URL = "https://api.coingecko.com/api/v3/";
const HOSTNAME_URL = "https://www.tradingview.com";
const GLOBAL_STORAGE_KEY = "Global_Data";
const CRYPTO_STORAGE_KEY = "Crypto_Data";
const EXCHANGE_STORAGE_KEY = "Exchanges_Data";
const CATEGORIES_STORAGE_KEY = "Categories_Data";
const COMPANIES_STORAGE_KEY = "Companies_Data";
const TRADING_STORAGE_KEY = "Trending_data";

const WIDGET_CONFIG_1 = {
  symbol: "BINANCE:BTCUSDT",
  width: "100%",
  isTransparent: true,
  colorTheme: "dark",
  locale: "en",
};
const WIDGET_CONFIG_2 = {
  symbols: [["BINANCE:BTCUSDT|1D"]],
  chartOnly: false,
  width: "100%",
  height: "100%",
  locale: "en",
  colorTheme: "dark",
  autosize: true,
  showVolume: false,
  showMA: false,
  hideDateRanges: false,
  hideMarketStatus: false,
  hideSymbolLogo: true,
  scalePosition: "right",
  scaleMode: "Normal",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
  fontSize: "10",
  noTimeScale: false,
  valuesTracking: "1",
  changeMode: "price-and-percent",
  chartType: "area",
  maLineColor: "#2962FF",
  maLineWidth: 1,
  maLength: 9,
  headerFontSize: "medium",
  backgroundColor: "rgba(14, 18, 24, 1)",
  gridLineColor: "rgba(76, 175, 80, 0.06)",
  lineWidth: 2,
  lineType: 0,
  dateRanges: ["1d|15", "1m|30", "3m|60", "12m|1D", "60m|1W", "all|1M"],
  dateFormat: "yyyy-MM-dd",
};
const TAB_DATA_LOADED = {
  tab1: false,
  tab2: false,
  tab3: false,
  tab4: false,
};
const TAB_NAMES = {
  tab1: "tab1",
  tab2: "tab2",
  tab3: "tab3",
  tab4: "tab4",
};

const ENDPOINT_URLS = {
  coinInfo(query) {
    return `${BASE_API_URL}coins/${query}`;
  },
  search(query) {
    return `${BASE_API_URL}search?query=${query}`;
  },

  assets: `${BASE_API_URL}coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true`,
  global: `${BASE_API_URL}global`,
  trending: `${BASE_API_URL}search/trending`,
  companies: `${BASE_API_URL}companies/public_treasury/bitcoin`,
  categories: `${BASE_API_URL}coins/categories`,
  exchanges: `${BASE_API_URL}exchanges`,
};

export {
  BASE_API_URL,
  CATEGORIES_STORAGE_KEY,
  CHART_WIDGET_URL,
  COMPANIES_STORAGE_KEY,
  CRYPTO_STORAGE_KEY,
  ENDPOINT_URLS,
  EXCHANGE_STORAGE_KEY,
  GLOBAL_STORAGE_KEY,
  HOSTNAME_URL,
  SEARCH_QUERY,
  SINGLE_QUOTE_WIDGET_URL,
  SYMBOL_OVERVIEW_WIDGET_URL,
  TAB_DATA_LOADED,
  TAB_NAMES,
  TRADING_STORAGE_KEY,
  WIDGET_CONFIG_1,
  WIDGET_CONFIG_2,
};
