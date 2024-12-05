import { HOSTNAME_URL } from "./config.js";

export function toggleSpinner(listId, spinnerId, show) {
  const listElement = document.getElementById(listId);
  const spinnerElement = document.getElementById(spinnerId);

  if (spinnerElement) {
    spinnerElement.style.display = show ? "block" : "none";
  }
  if (listElement) {
    listElement.style.display = show ? "none" : "block";
  }
}

export function createTable(headers, fixedIndex = 0) {
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  table.appendChild(thead);
  const headerRow = document.createElement("tr");

  headers.forEach((header, index) => {
    const th = document.createElement("th");
    th.textContent = header;
    if (index === fixedIndex) {
      th.classList.add("table-fixed-column");
    }
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);

  return table;
}

export function createWidget(containerId, widgetConfig, widgetSrc) {
  const container = document.getElementById(containerId);

  container.innerHTML = "";

  const widgetDiv = document.createElement("div");
  widgetDiv.classList.add("tradingview-widget-container__widget");
  container.appendChild(widgetDiv);

  const script = document.createElement("script");
  script.type = "text/javascript";
  script.src = widgetSrc;
  script.async = true;
  script.innerHTML = JSON.stringify(widgetConfig);
  container.appendChild(script);

  setTimeout(() => {
    const copyright = document.querySelector(".tradingview-widget-copyright");
    if (copyright) {
      copyright.classList.remove("hidden");
    }
  }, 5000);
}

export function getLocalStorageData(key) {
  const storedData = localStorage.getItem(key);
  if (!storedData) return null;

  const parsedData = JSON.parse(storedData);
  const currentTime = Date.now();

  if (currentTime - parsedData.timestamp > 300000) {
    localStorage.removeItem(key);
    return null;
  }

  return parsedData.data;
}

export function setLocalStorageData(key, data) {
  const storedData = {
    timestamp: Date.now(),
    data: data,
  };
  localStorage.setItem(key, JSON.stringify(storedData));
}

export function getCoinThemeConfig() {
  const root = getComputedStyle(document.documentElement);
  const isDarkTheme =
    localStorage.getItem("theme") === "light-theme" ? false : true;
  const backgroundColor = root
    .getPropertyValue(isDarkTheme ? "--chart-dark-bg" : "--chart-light-bg")
    .trim();
  const gridColor = root
    .getPropertyValue(
      isDarkTheme ? "--chart-dark-border" : "--chart-light-border"
    )
    .trim();

  const themeConfig = {
    theme: isDarkTheme ? "dark" : "light",
    backgroundColor: backgroundColor,
    gridColor: gridColor,
  };

  return themeConfig;
}

export function getChartThemeConfig() {
  const root = getComputedStyle(document.documentElement);
  const isDarkTheme =
    localStorage.getItem("theme") === "light-theme" ? false : true;
  const backgroundColor = root
    .getPropertyValue(isDarkTheme ? "--chart-dark-bg" : "--chart-light-bg")
    .trim();
  const gridColor = root
    .getPropertyValue(
      isDarkTheme ? "--chart-dark-border" : "--chart-light-border"
    )
    .trim();

  const themeConfig = {
    autosize: true,
    symbol: "BINANCE:BTCUSDT",
    interval: "4H",
    timezone: "Etc/UTC",
    theme: isDarkTheme ? "dark" : "light",
    style: "1",
    locale: "en",
    container_id: "chart-widget",
    backgroundColor: backgroundColor,
    gridColor: gridColor,
    hide_side_toolbar: false,
    allow_symbol_change: true,
    save_image: true,
    details: true,
    calendar: false,
    support_host: HOSTNAME_URL,
  };

  return themeConfig;
}

export async function fetchData(url, options = {}) {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}
