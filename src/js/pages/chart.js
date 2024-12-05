import { CHART_WIDGET_URL } from "../config.js";
import { createWidget, getChartThemeConfig } from "../utils.js";

export function initializeWidget() {
  const widgetConfig = getChartThemeConfig();

  createWidget("chart-widget", widgetConfig, CHART_WIDGET_URL);
}
