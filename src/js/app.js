const tabDataLoaded = {
  tab1: false,
  tab2: false,
  tab3: false,
  tab4: false,
};

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".tab-button").click();
  fetchData();
});

async function fetchAndDisplay(
  url,
  idsToToggle,
  displayFunction,
  tabName = null,
  localKey
) {
  idsToToggle.forEach((id) => {
    const errorElement = document.getElementById(`${id}-error`);

    if (errorElement) {
      errorElement.style.display = "none";
    }
    toggleSpinner(id, `${id}-spinner`, true);
  });

  const localStorageKey = localKey;
  const localData = getLocalStorageData(localStorageKey);

  if (localData) {
    idsToToggle.forEach((id) => toggleSpinner(id, `${id}-spinner`, false));
    displayFunction(localData);
    if (tabName) {
      tabDataLoaded[tabName] = true;
    }
  } else {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("API limit reached");
      const data = await response.json();
      idsToToggle.forEach((id) => toggleSpinner(id, `${id}-spinner`, false));
      displayFunction(data);
      setLocalStorageData(localStorageKey, data);
      if (tabName) {
        tabDataLoaded[tabName] = true;
      }
    } catch (error) {
      idsToToggle.forEach((id) => {
        toggleSpinner(id, `${id}-spinner`, false);
        document.getElementById(`${id}-error`).style.display = "block";
      });
      if (tabName) {
        tabDataLoaded[tabName] = false;
      }
    }
  }
}

function openTab(event, tabName) {
  const tabContent = document.querySelectorAll(".tab-content");
  const tabButtons = document.querySelectorAll(".tab-button");

  tabContent.forEach((content) => (content.style.display = "none"));
  tabButtons.forEach((button) => button.classList.remove("active"));

  document.getElementById(tabName).style.display = "block";
  event.currentTarget.classList.add("active");

  if (!tabDataLoaded[tabName]) {
    switch (tabName) {
      case "tab1":
        fetchAndDisplay(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true",
          ["asset-list"],
          displayAssets,
          tabName,
          "Crypto_Data"
        );
        break;
      case "tab2":
        fetchAndDisplay(
          "https://api.coingecko.com/api/v3/exchanges",
          ["exchange-list"],
          displayExchanges,
          tabName,
          "Exchanges_Data"
        );
        break;
      case "tab3":
        fetchAndDisplay(
          "https://api.coingecko.com/api/v3/coins/categories",
          ["category-list"],
          displayCategories,
          tabName,
          "Categories_Data"
        );
        break;
      case "tab4":
        fetchAndDisplay(
          "https://api.coingecko.com/api/v3/companies/public_treasury/bitcoin",
          ["company-list"],
          displayCompanies,
          tabName,
          "Companies_Data"
        );
        break;
    }
  }
}

async function fetchData() {
  await Promise.all([
    fetchAndDisplay(
      "https://api.coingecko.com/api/v3/search/trending",
      ["coins-list", "nfts-list"],
      displayTrends,
      null,
      "Trending_data"
    ),
    fetchAndDisplay(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true",
      ["asset-list"],
      displayAssets,
      null,
      "Crypto_Data"
    ),
  ]);
}
