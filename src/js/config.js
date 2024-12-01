export const SEARCH_QUERY = new URLSearchParams(window.location.search).get("coin");
export const BASE_API_URL = "https://api.coingecko.com/api/v3/";
export const GLOBAL_STORAGE_KEY = "Global_Data";
export const CRYPTO_STORAGE_KEY = "Crypto_Data";
export const EXCHANGE_STORAGE_KEY = "Exchanges_Data";
export const CATEGORIES_STORAGE_KEY = "Categories_Data";
export const COMPANIES_STORAGE_KEY = "Companies_Data";
export const TRADING_STORAGE_KEY = "Trending_data";

export const WIDGET_CONFIG_1 = {
  symbol: "BINANCE:BTCUSDT",
  width: "100%",
  isTransparent: true,
  colorTheme: "dark",
  locale: "en",
};
export const WIDGET_CONFIG_2 = {
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
export const TAB_DATA_LOADED = {
  tab1: false,
  tab2: false,
  tab3: false,
  tab4: false,
};
export const TAB_NAMES = {
  tab1: "tab1",
  tab2: "tab2",
  tab3: "tab3",
  tab4: "tab4",
};
