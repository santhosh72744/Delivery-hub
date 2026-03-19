const GA_ID = "G-25D5ERTR56";

let enabled = false;

export function enableAnalytics() {
  if (enabled || !window.gtag) return;

  enabled = true;

  window.gtag("consent", "update", {
    analytics_storage: "granted",
  });

  window.gtag("config", GA_ID, {
    anonymize_ip: true,
    send_page_view: false,
  });

  console.log("Analytics enabled");
}

export function trackPageView(path) {
  if (!window.gtag || !enabled) return;

  window.gtag("event", "page_view", {
    page_path: path,
    send_to: GA_ID,
  });
}