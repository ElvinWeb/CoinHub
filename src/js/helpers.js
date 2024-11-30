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
