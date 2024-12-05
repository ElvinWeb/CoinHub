import { createTable, fetchData, toggleSpinner } from "./utils.js";
import { getLocalStorageData, setLocalStorageData } from "./utils.js";
import {
  CATEGORIES_STORAGE_KEY,
  COMPANIES_STORAGE_KEY,
  EXCHANGE_STORAGE_KEY,
  CRYPTO_STORAGE_KEY,
  TRADING_STORAGE_KEY,
  TAB_DATA_LOADED,
  TAB_NAMES,
  ENDPOINT_URLS,
} from "./config.js";

const tabContent = document.querySelectorAll(".tab-content");
const tabButtons = document.querySelectorAll(".tab-button");
const coinsList = document.getElementById("coins-list");
const nftsList = document.getElementById("nfts-list");
const cryptoList = document.getElementById("asset-list");
const exchangeList = document.getElementById("exchange-list");
const catagoriesList = document.getElementById("category-list");
const companyList = document.getElementById("company-list");

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".tab-button").click();

  tabButtons.forEach((tabBtn, index) => {
    tabBtn.addEventListener("click", function (e) {
      openTab(e, TAB_NAMES[`tab${index + 1}`]);
    });
  });

  fetchTrendsData();
});

async function fetchAndDisplay(
  url,
  idsToToggle,
  displayFunction,
  tabName = null,
  storageKey
) {
  idsToToggle.forEach((id) => {
    const errorElement = document.getElementById(`${id}-error`);

    if (errorElement) {
      errorElement.style.display = "none";
    }

    toggleSpinner(id, `${id}-spinner`, true);
  });

  const localData = getLocalStorageData(storageKey);

  if (localData) {
    idsToToggle.forEach((id) => toggleSpinner(id, `${id}-spinner`, false));
    displayFunction(localData);
    if (tabName) {
      TAB_DATA_LOADED[tabName] = true;
    }
  } else {
    try {
      const data = await fetchData(url);

      idsToToggle.forEach((id) => toggleSpinner(id, `${id}-spinner`, false));
      displayFunction(data);
      setLocalStorageData(storageKey, data);

      if (tabName) {
        TAB_DATA_LOADED[tabName] = true;
      }
    } catch (error) {
      idsToToggle.forEach((id) => {
        toggleSpinner(id, `${id}-spinner`, false);
        document.getElementById(`${id}-error`).style.display = "block";
      });
      if (tabName) {
        TAB_DATA_LOADED[tabName] = false;
      }
    }
  }
}

async function fetchTrendsData() {
  await Promise.all([
    fetchAndDisplay(
      ENDPOINT_URLS.trending,
      ["coins-list", "nfts-list"],
      displayTrends,
      null,
      TRADING_STORAGE_KEY
    ),
    fetchAndDisplay(
      ENDPOINT_URLS.assets,
      ["asset-list"],
      displayAssets,
      null,
      CRYPTO_STORAGE_KEY
    ),
  ]);
}

function displayTrends(data) {
  displayTrendCoins(data.coins.slice(0, 5));
  displayTrendNfts(data.nfts.slice(0, 5));
}

function displayTrendCoins(coins) {
  coinsList.innerHTML = "";

  const table = createTable(["Coin", "Price", "Market Cap", "Volume", "24h%"]);

  coins.forEach((coin) => {
    const coinData = coin.item;
    const row = document.createElement("tr");
    row.innerHTML = `
          <td class="name-column table-fixed-column"><img src="${
            coinData.thumb
          }" alt="${coinData.name}"> ${
      coinData.name
    } <span>(${coinData.symbol.toUpperCase()})</span></td>
          <td>${parseFloat(coinData.price_btc).toFixed(6)}</td>
          <td>$${coinData.data.market_cap}</td>
          <td>$${coinData.data.total_volume}</td>
          <td class="${
            coinData.data.price_change_percentage_24h.usd >= 0 ? "green" : "red"
          }">${coinData.data.price_change_percentage_24h.usd.toFixed(2)}%</td>
      `;
    row.onclick = () =>
      (window.location.href = `/src/pages/coin.html?coin=${coinData.id}`);
    table.appendChild(row);
  });

  coinsList.appendChild(table);
}

function displayTrendNfts(nfts) {
  nftsList.innerHTML = "";

  const table = createTable(["NFT", "Market", "Price", "24h Vol", "24h%"]);

  nfts.forEach((nft) => {
    const row = document.createElement("tr");
    row.innerHTML = `
          <td class="name-column table-fixed-column"><img src="${
            nft.thumb
          }" alt="${nft.name}"> ${
      nft.name
    } <span>(${nft.symbol.toUpperCase()})</span></td>
          <td>${nft.native_currency_symbol.toUpperCase()}</td>
          <td>$${nft.data.floor_price}</td>
          <td>$${nft.data.h24_volume}</td>
          <td class="${
            parseFloat(nft.data.floor_price_in_usd_24h_percentage_change) >= 0
              ? "green"
              : "red"
          }">${parseFloat(
      nft.data.floor_price_in_usd_24h_percentage_change
    ).toFixed(2)}%</td>
      `;
    table.appendChild(row);
  });

  nftsList.appendChild(table);
}

function displayAssets(data) {
  const sparklineData = [];
  cryptoList.innerHTML = "";

  const table = createTable(
    [
      "Rank",
      "Coin",
      "Price",
      "24h Price",
      "24h Price %",
      "Total Vol",
      "Market Cap",
      "Last 7 Days",
    ],
    1
  );

  data.forEach((asset) => {
    const row = document.createElement("tr");
    row.innerHTML = `
          <td class="rank">${asset.market_cap_rank}</td>
          <td class="name-column table-fixed-column"><img src="${
            asset.image
          }" alt="${asset.name}"> ${
      asset.name
    } <span>(${asset.symbol.toUpperCase()})</span></td>
          <td>$${asset.current_price.toFixed(2)}</td>
          <td class="${
            asset.price_change_percentage_24h >= 0 ? "green" : "red"
          }">$${asset.price_change_24h.toFixed(2)}</td>
          <td class="${
            asset.price_change_percentage_24h >= 0 ? "green" : "red"
          }">${asset.price_change_percentage_24h.toFixed(2)}%</td>
          <td>$${asset.total_volume.toLocaleString()}</td>
          <td>$${asset.market_cap.toLocaleString()}</td>
          <td><canvas id="chart-${
            asset.id
          }" width="100" height="50"></canvas></td>
      `;
    table.appendChild(row);
    sparklineData.push({
      id: asset.id,
      sparkline: asset.sparkline_in_7d.price,
      color:
        asset.sparkline_in_7d.price[0] <=
        asset.sparkline_in_7d.price[asset.sparkline_in_7d.price.length - 1]
          ? "green"
          : "red",
    });
    row.onclick = () =>
      (window.location.href = `/src/pages/coin.html?coin=${asset.id}`);
  });

  cryptoList.appendChild(table);

  sparklineData.forEach(({ id, sparkline, color }) => {
    const ctx = document.getElementById(`chart-${id}`).getContext("2d");
    new Chart(ctx, {
      type: "line",
      data: {
        labels: sparkline.map((_, index) => index),
        datasets: [
          {
            data: sparkline,
            borderColor: color,
            fill: false,
            pointRadius: 0,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: false,
        scales: {
          x: {
            display: false,
          },
          y: {
            display: false,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
          },
        },
      },
    });
  });
}

function displayExchanges(data) {
  exchangeList.innerHTML = "";

  const table = createTable(
    [
      "Rank",
      "Exchange",
      "Trust Score",
      "24h Trade",
      "24h Trade (Normal)",
      "Country",
      "Website",
      "Year",
    ],
    1
  );

  data = data.slice(0, 20);

  data.forEach((exchange) => {
    const row = document.createElement("tr");
    row.innerHTML = `
          <td class="rank">${exchange.trust_score_rank}</td>
          <td class="name-column table-fixed-column"><img src="${
            exchange.image
          }" alt="${exchange.name}"> ${exchange.name}</td>
          <td>${exchange.trust_score}</td>
          <td>$${exchange.trade_volume_24h_btc.toLocaleString(undefined, {
            minimumFractionDigits: 3,
            maximumFractionDigits: 3,
          })} BTC</td>
          <td>$${exchange.trade_volume_24h_btc_normalized.toLocaleString(
            undefined,
            { minimumFractionDigits: 3, maximumFractionDigits: 3 }
          )} BTC</td>
          <td class="name-column">${exchange.country || "N/A"}</td>
          <td class="name-column">${exchange.url}</td>
          <td>${exchange.year_established || "N/A"}</td>
      `;
    table.appendChild(row);
  });

  exchangeList.appendChild(table);
}

function displayCategories(data) {
  catagoriesList.innerHTML = "";

  const table = createTable(
    ["Top Coins", "Category", "Market Cap", "24h Market Cap", "24h Volume"],
    1
  );

  data = data.slice(0, 20);

  data.forEach((category) => {
    const row = document.createElement("tr");
    row.innerHTML = `
          <td>${category.top_3_coins
            .map((coin) => `<img src="${coin}" alt="coin">`)
            .join("")}</td>
          <td class="name-column table-fixed-column">${category.name}</td>
          <td>$${
            category.market_cap
              ? category.market_cap.toLocaleString(undefined, {
                  minimumFractionDigits: 3,
                  maximumFractionDigits: 3,
                })
              : "N/A"
          }</td>
          <td class="${
            category.market_cap_change_24h >= 0 ? "green" : "red"
          }">${
      category.market_cap_change_24h
        ? category.market_cap_change_24h.toFixed(3)
        : "0"
    }%</td>
          <td>$${
            category.volume_24h
              ? category.volume_24h.toLocaleString(undefined, {
                  minimumFractionDigits: 3,
                  maximumFractionDigits: 3,
                })
              : "N/A"
          }</td>
      `;
    table.appendChild(row);
  });

  catagoriesList.appendChild(table);
}

function displayCompanies(data) {
  companyList.innerHTML = "";

  const table = createTable([
    "Company",
    "Total BTC",
    "Entry Value",
    "Total Current Value",
    "Total %",
  ]);

  data.companies.forEach((company) => {
    const row = document.createElement("tr");
    row.innerHTML = `
         <td class="name-column table-fixed-column">${company.name}</td>
          <td>${company.total_holdings}</td>
          <td>${company.total_entry_value_usd}</td>
          <td>${company.total_current_value_usd}</td>
          <td class="${
            company.percentage_of_total_supply >= 0 ? "green" : "red"
          }">${company.percentage_of_total_supply}%</td>
      `;
    table.appendChild(row);
  });

  companyList.appendChild(table);
}

function openTab(event, tabName) {
  tabContent.forEach((content) => (content.style.display = "none"));
  tabButtons.forEach((button) => button.classList.remove("active"));

  document.getElementById(tabName).style.display = "block";
  event.currentTarget.classList.add("active");

  if (!TAB_DATA_LOADED[tabName]) {
    switch (tabName) {
      case "tab1":
        fetchAndDisplay(
          ENDPOINT_URLS.assets,
          ["asset-list"],
          displayAssets,
          tabName,
          CRYPTO_STORAGE_KEY
        );
        break;
      case "tab2":
        fetchAndDisplay(
          ENDPOINT_URLS.exchanges,
          ["exchange-list"],
          displayExchanges,
          tabName,
          EXCHANGE_STORAGE_KEY
        );
        break;
      case "tab3":
        fetchAndDisplay(
          ENDPOINT_URLS.categories,
          ["category-list"],
          displayCategories,
          tabName,
          CATEGORIES_STORAGE_KEY
        );
        break;
      case "tab4":
        fetchAndDisplay(
          ENDPOINT_URLS.companies,
          ["company-list"],
          displayCompanies,
          tabName,
          COMPANIES_STORAGE_KEY
        );
        break;
    }
  }
}
