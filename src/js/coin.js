import { createWidget } from "./helpers.js";
import {
  BASE_API_URL,
  WIDGET_CONFIG_1,
  WIDGET_CONFIG_2,
  SEARCH_QUERY,
} from "./config.js";

const rightSec = document.querySelector(".coin-container .right-section");
const coinInfoError = document.getElementById("coin-info-error");
const coinDesc = document.getElementById("coin-desc-p");
const coinInfo = document.querySelector(".coin-info");

document.addEventListener("DOMContentLoaded", () => {
  if (SEARCH_QUERY) {
    fetchCoinInfo(SEARCH_QUERY);
  } else {
    window.location.href = "../../index.html";
  }
});

export function initializeDetailsWidget() {
  const themeConfig = getThemeConfig();

  WIDGET_CONFIG_1.colorTheme = themeConfig.theme;
  WIDGET_CONFIG_2.colorTheme = themeConfig.theme;
  WIDGET_CONFIG_2.backgroundColor = themeConfig.backgroundColor;
  WIDGET_CONFIG_2.gridLineColor = themeConfig.gridColor;

  createWidget(
    "ticker-widget",
    WIDGET_CONFIG_1,
    "https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js"
  );
  createWidget(
    "mini-chart-widget",
    WIDGET_CONFIG_2,
    "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js"
  );
}

function displayCoinInfo(coin) {
  coinInfo.innerHTML = `
        <div class="logo">
                    <img src="${coin.image.thumb}" alt="${coin.name}">
                    <h4>${
                      coin.name
                    } <span>(${coin.symbol.toUpperCase()})</span></h4>
                    <p>#${coin.market_cap_rank}</p>
                </div>
                <div class="status">
                    
                    <div class="item">
                        <p class="str">Market Cap</p>
                        <p class="num">$${
                          coin.market_data.market_cap.usd != null
                            ? coin.market_data.market_cap.usd.toLocaleString(
                                undefined,
                                {
                                  minimumFractionDigits: 3,
                                  maximumFractionDigits: 3,
                                }
                              )
                            : "N/A"
                        }</p>
                    </div>
                    <div class="item">
                        <p class="str">Current Price</p>
                        <p class="num">$${
                          coin.market_data.current_price.usd != null
                            ? coin.market_data.current_price.usd.toLocaleString(
                                undefined,
                                {
                                  minimumFractionDigits: 3,
                                  maximumFractionDigits: 3,
                                }
                              )
                            : "N/A"
                        }</p>
                    </div>
                    <div class="item">
                        <p class="str">All Time High</p>
                        <p class="num">$${
                          coin.market_data.ath.usd != null
                            ? coin.market_data.ath.usd.toLocaleString(
                                undefined,
                                {
                                  minimumFractionDigits: 3,
                                  maximumFractionDigits: 3,
                                }
                              )
                            : "N/A"
                        }</p>
                    </div>
                    <div class="item">
                        <p class="str">All Time Low</p>
                        <p class="num">$${
                          coin.market_data.atl.usd != null
                            ? coin.market_data.atl.usd.toLocaleString(
                                undefined,
                                {
                                  minimumFractionDigits: 3,
                                  maximumFractionDigits: 3,
                                }
                              )
                            : "N/A"
                        }</p>
                    </div>
                    <div class="item">
                        <p class="str">Total Volume</p>
                        <p class="num">$${
                          coin.market_data.total_volume.usd != null
                            ? coin.market_data.total_volume.usd.toLocaleString(
                                undefined,
                                {
                                  minimumFractionDigits: 3,
                                  maximumFractionDigits: 3,
                                }
                              )
                            : "N/A"
                        }</p>
                    </div>
                    <div class="item">
                        <p class="str">Total Supply</p>
                        <p class="num">${
                          coin.market_data.total_supply != null
                            ? coin.market_data.total_supply.toLocaleString(
                                undefined,
                                {
                                  minimumFractionDigits: 3,
                                  maximumFractionDigits: 3,
                                }
                              )
                            : "N/A"
                        }</p>
                    </div>
                    <div class="item">
                        <p class="str">Max Supply</p>
                        <p class="num">${
                          coin.market_data.max_supply != null
                            ? coin.market_data.max_supply.toLocaleString(
                                undefined,
                                {
                                  minimumFractionDigits: 3,
                                  maximumFractionDigits: 3,
                                }
                              )
                            : "N/A"
                        }</p>
                    </div>
                    <div class="item">
                        <p class="str">Circulating Supply</p>
                        <p class="num">${
                          coin.market_data.circulating_supply != null
                            ? coin.market_data.circulating_supply.toLocaleString(
                                undefined,
                                {
                                  minimumFractionDigits: 3,
                                  maximumFractionDigits: 3,
                                }
                              )
                            : "N/A"
                        }</p>
                    </div>
                </div>
    `;

  rightSec.innerHTML = `
        <div class="status">
                <h3>Historical Info</h3>
                <div class="container">
                <div class="item">
                    <p class="str">ATH</p>
                    <p class="num">$${
                      coin.market_data.ath.usd != null
                        ? coin.market_data.ath.usd.toLocaleString(undefined, {
                            minimumFractionDigits: 3,
                            maximumFractionDigits: 3,
                          })
                        : "N/A"
                    }</p>
                </div>
                <div class="item">
                    <p class="str">ATL</p>
                    <p class="num">$${
                      coin.market_data.atl.usd != null
                        ? coin.market_data.atl.usd.toLocaleString(undefined, {
                            minimumFractionDigits: 3,
                            maximumFractionDigits: 3,
                          })
                        : "N/A"
                    }</p>
                </div>
                <div class="item">
                    <p class="str">24h High</p>
                    <p class="num">$${
                      coin.market_data.high_24h.usd != null
                        ? coin.market_data.high_24h.usd.toLocaleString(
                            undefined,
                            {
                              minimumFractionDigits: 3,
                              maximumFractionDigits: 3,
                            }
                          )
                        : "N/A"
                    }</p>
                </div>
                <div class="item">
                    <p class="str">24h Low</p>
                    <p class="num">$${
                      coin.market_data.low_24h.usd != null
                        ? coin.market_data.high_24h.usd.toLocaleString(
                            undefined,
                            {
                              minimumFractionDigits: 3,
                              maximumFractionDigits: 3,
                            }
                          )
                        : "N/A"
                    }</p>
                </div>
                </div>
            </div>

            
            <div class="status">
            <h3>Markets</h3>
            <div class="container">
                <div class="item">
                    <p class="str">${coin.tickers[0].market.name.replace(
                      "Exchange",
                      ""
                    )}</p>
                    <div class="links">
                        <a href="${coin.tickers[0].trade_url}">Trade</a>
                        <p style="background-color: ${
                          coin.tickers[0].trust_score
                        }">Trusted?</p>
                    </div>
                </div>
                <div class="item">
                    <p class="str">${coin.tickers[1].market.name.replace(
                      "Exchange",
                      ""
                    )}</p>
                    <div class="links">
                        <a href="${coin.tickers[1].trade_url}">Trade</a>
                        <p style="background-color: ${
                          coin.tickers[1].trust_score
                        }">Trusted?</p>
                    </div>
                </div>
                <div class="item">
                    <p class="str">${coin.tickers[2].market.name.replace(
                      "Exchange",
                      ""
                    )}</p>
                    <div class="links">
                        <a href="${coin.tickers[2].trade_url}">Trade</a>
                        <p style="background-color: ${
                          coin.tickers[2].trust_score
                        }">Trusted?</p>
                    </div>
                </div>
                </div>
            </div>

            <div class="status">
            <h3>Info</h3>
                <div class="container">
                    <div class="item">
                        <p class="str">Website</p>
                        <div class="links">
                            <a target="_blank" href="${
                              coin.links.homepage
                            }">Visit</a>
                            <a target="_blank" href="${
                              coin.links.whitepaper
                            }">Whitepaper</a>
                        </div>
                    </div>
                    <div class="item">
                        <p class="str">Community</p>
                        <div class="links">
                            <a target="_blank" href="https://x.com/${
                              coin.links.twitter_screen_name
                            }">Twitter</a>
                            <a target="_blank" href="https://facebook.com/${
                              coin.links.facebook_username
                            }">Facebook</a>
                        </div>
                    </div>
                </div>
            </div>
    `;

  coinDesc.innerHTML =
    coin.description.en ||
    '<p class="red">Asset description not available!</p>';
}

async function fetchCoinInfo(query) {
  coinInfoError.style.display = "none";
  const apiUrl = `${BASE_API_URL}coins/${query}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("API limit reached.");
    const data = await response.json();
    WIDGET_CONFIG_1.symbol = `MEXC:${data.symbol.toUpperCase()}USDT`;
    WIDGET_CONFIG_2.symbols = [[`MEXC:${data.symbol.toUpperCase()}USDT|1D`]];

    initializeDetailsWidget();
    displayCoinInfo(data);
  } catch (error) {
    coinInfoError.style.display = "flex";
    console.log(error);
  }
}

function getThemeConfig() {
  const root = getComputedStyle(document.documentElement);
  const isDarkTheme =
    localStorage.getItem("theme") === "light-theme" ? false : true;

  return {
    theme: isDarkTheme ? "dark" : "light",
    backgroundColor: root
      .getPropertyValue(isDarkTheme ? "--chart-dark-bg" : "--chart-light-bg")
      .trim(),
    gridColor: root
      .getPropertyValue(
        isDarkTheme ? "--chart-dark-border" : "--chart-light-border"
      )
      .trim(),
  };
}
