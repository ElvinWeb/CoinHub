import { ENDPOINT_URLS } from "../config.js";
import { createTable, toggleSpinner } from "../utils.js";

const query = new URLSearchParams(window.location.search).get("query");
const exchangesList = document.getElementById("exchanges-list");
const searchHeading = document.getElementById("searchHeading");
const searchContainer = document.querySelector(".search-container");
const coinsList = document.getElementById("coins-list");
const nftsList = document.getElementById("nfts-list");

function fetchSearchResult(param, idsToToggle) {
  idsToToggle.forEach((id) => {
    const errorElement = document.getElementById(`${id}-error`);

    if (errorElement) {
      errorElement.style.display = "none";
    }

    toggleSpinner(id, `${id}-spinner`, true);
  });

  coinsList.innerHTML = "";
  exchangesList.innerHTML = "";
  nftsList.innerHTML = "";
  searchHeading.innerText = `Search results for "${param}"`;

  const options = { method: "GET", headers: { accept: "application/json" } };

  fetch(ENDPOINT_URLS.search(query), options)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      idsToToggle.forEach((id) => toggleSpinner(id, `${id}-spinner`, false));
      return response.json();
    })
    .then((data) => {
      let coins = (data.coins || []).filter(
        (coin) => coin.thumb !== "missing_thumb.png"
      );
      let exchanges = (data.exchanges || []).filter(
        (ex) => ex.thumb !== "missing_thumb.png"
      );
      let nfts = (data.nfts || []).filter(
        (nf) => nf.thumb !== "missing_thumb.png"
      );

      const coinsCount = coins.length;
      const exchangesCount = exchanges.length;
      const nftsCount = nfts.length;

      let minCount = Math.min(coinsCount, exchangesCount, nftsCount);

      if (coinsCount > 0 && (exchangesCount > 0) & (nftsCount > 0)) {
        coins = coins.slice(0, minCount);
        exchanges = exchanges.slice(0, minCount);
        nfts = nfts.slice(0, minCount);
      }

      coinsResult(coins);
      exchangesResult(exchanges);
      nftsResult(nfts);

      if (coins.length === 0) {
        coinsList.innerHTML =
          '<p style="color: red; text-align: center;">No results found for coins.</p>';
      }

      if (exchanges.length === 0) {
        exchangesList.innerHTML =
          '<p style="color: red; text-align: center;">No results found for exchanges.</p>';
      }

      if (nfts.length === 0) {
        nftsList.innerHTML =
          '<p style="color: red; text-align: center;">No results found for nfts.</p>';
      }
    })
    .catch((error) => {
      idsToToggle.forEach((id) => {
        toggleSpinner(id, `${id}-spinner`, false);
        document.getElementById(`${id}-error`).style.display = "block";
      });
    });
}

function coinsResult(coins) {
  coinsList.innerHTML = "";

  const table = createTable(["Rank", "Coin"]);

  coins.forEach((coin) => {
    const row = document.createElement("tr");
    row.innerHTML = `
          <td>${coin.market_cap_rank}</td>
          <td class="name-column">
            <img src="${coin.thumb}" alt="${coin.name}">${coin.name} 
            <span>(${coin.symbol.toUpperCase()})</span>
          </td>
        `;
    table.appendChild(row);
    row.onclick = () =>
      (window.location.href = `/src/pages/coin.html?coin=${coin.id}`);
  });

  coinsList.appendChild(table);
}

function exchangesResult(exchanges) {
  exchangesList.innerHTML = "";

  const table = createTable(["Exchange", "Market"]);

  exchanges.forEach((exc) => {
    const row = document.createElement("tr");
    row.innerHTML = `
          <td class="name-column">
            <img src="${exc.thumb}" alt="${exc.name}"> ${exc.name}
          </td>
          <td>${exc.market_type}</td>
        `;
    table.appendChild(row);
  });

  exchangesList.appendChild(table);
}

function nftsResult(nfts) {
  nftsList.innerHTML = "";

  const table = createTable(["NFT", "Symbol"]);

  nfts.forEach((nft) => {
    const row = document.createElement("tr");
    row.innerHTML = `
          <td class="name-column">
            <img src="${nft.thumb}" alt="${nft.name}"> ${nft.name}
          </td>
          <td class="name-column">${nft.symbol}</td>
        `;
    table.appendChild(row);
  });

  nftsList.appendChild(table);
}

document.addEventListener("DOMContentLoaded", () => {
  if (query) {
    fetchSearchResult(query, [coinsList, exchangesList, nftsList]);
  } else {
    searchContainer.innerHTML = `<p style="color: red; text-align: center; margin-bottom: 8px">Nothing To Show...</p>`;
    searchHeading.innerText = "Please search something...";
  }
});
