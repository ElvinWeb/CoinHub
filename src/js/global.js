import { BASE_API_URL, GLOBAL_STORAGE_KEY } from "./config.js";
import { initializeWidget } from "./chart.js";
import { getLocalStorageData, setLocalStorageData } from "./helpers.js";

const coinsCount = document.getElementById("coins-count");
const exchangesCount = document.getElementById("exchanges-count");
const marketCap = document.getElementById("marketCap");
const marketCapChangeElement = document.getElementById("marketCapChange");
const volume = document.getElementById("volume");
const dominance = document.getElementById("dominance");
const scrollTopBtn = document.getElementById("scrollTop");
const themeToggle = document.getElementById("theme-toggle");
const savedTheme = localStorage.getItem("theme");
const form = document.getElementById("searchForm");
const openMenuBtn = document.getElementById("openMenu");
const overlay = document.querySelector(".overlay");
const closeMenuBtn = document.getElementById("closeMenu");
const activePage = window.location.pathname;
const navLinks = document.querySelectorAll(".nav-links a");
const body = document.body;

document.addEventListener("DOMContentLoaded", function () {
  if (savedTheme) {
    body.id = savedTheme;
    updateIcon(savedTheme);
  }

  themeToggle.addEventListener("click", () => {
    if (body.id === "light-theme") {
      body.id = "dark-theme";
      localStorage.setItem("theme", "dark-theme");
      updateIcon("dark-theme");
    } else {
      body.id = "light-theme";
      localStorage.setItem("theme", "light-theme");
      updateIcon("light-theme");
    }

    if (activePage === "/src/pages/charts.html") {
      initializeWidget();
    }

    // if (activePage === "/src/pages/coin.html") {
    //   initializeDetailsWidget();
    // }
  });

  function updateIcon(currentTheme) {
    if (currentTheme === "light-theme") {
      themeToggle.classList.remove("ri-moon-line");
      themeToggle.classList.add("ri-sun-line");
    } else {
      themeToggle.classList.remove("ri-sun-line");
      themeToggle.classList.add("ri-moon-line");
    }
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const query = document.getElementById("searchInput").value.trim();
    if (!query) return;

    window.location.href = `../pages/search.html?query=${query}`;
  });

  openMenuBtn.addEventListener("click", () => {
    overlay.classList.add("show");
  });

  closeMenuBtn.addEventListener("click", () => {
    overlay.classList.remove("show");
  });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.classList.remove("show");
    }
  });

  fetchGlobal();
  scrollFunction();
  initializeWidget();
});

scrollTopBtn.addEventListener("click", scrollToTop);

function fetchGlobal() {
  const localData = getLocalStorageData(GLOBAL_STORAGE_KEY);

  if (localData) {
    displayGlobalData(localData);
  } else {
    const options = { method: "GET", headers: { accept: "application/json" } };

    fetch(`${BASE_API_URL}global`, options)
      .then((response) => response.json())
      .then((data) => {
        const globalData = data.data;
        displayGlobalData(data);
        setLocalStorageData(GLOBAL_STORAGE_KEY, globalData);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

function displayGlobalData(globalData) {
  coinsCount.textContent = globalData.active_cryptocurrencies || "-";
  exchangesCount.textContent = globalData.markets || "-";

  marketCap.textContent = globalData.total_market_cap?.usd
    ? `$${(globalData.total_market_cap.usd / 1e12).toFixed(3)}T`
    : "-";
  const marketCapChange = globalData.market_cap_change_percentage_24h_usd;

  if (marketCapChange !== undefined) {
    const changeText = `${marketCapChange.toFixed(1)}%`;
    marketCapChangeElement.innerHTML = `${changeText} <i class="${
      marketCapChange < 0 ? "red" : "green"
    } ri-arrow-${marketCapChange < 0 ? "down" : "up"}-s-fill"></i>`;
    marketCapChangeElement.style.color = marketCapChange < 0 ? "red" : "green";
  } else {
    marketCapChangeElement.textContent = "-";
  }

  volume.textContent = globalData.total_volume?.usd
    ? `$${(globalData.total_volume.usd / 1e9).toFixed(3)}B`
    : "-";

  const btcDominance = globalData.market_cap_percentage?.btc
    ? `${globalData.market_cap_percentage.btc.toFixed(1)}%`
    : "-";
  const ethDominance = globalData.market_cap_percentage?.eth
    ? `${globalData.market_cap_percentage.eth.toFixed(1)}%`
    : "-";
  dominance.textContent = `BTC ${btcDominance} - ETH ${ethDominance}`;
}

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    scrollTopBtn.style.display = "flex";
  } else {
    scrollTopBtn.style.display = "none";
  }
}

function scrollToTop() {
  // For Safari
  document.body.scrollTop = 0;
  // Chrome, Firefox, IE and Opera
  document.documentElement.scrollTop = 0;
}

navLinks.forEach((link) => {
  if (link.href.includes(`${activePage}`)) {
    link.classList.add("active");
  }
});
