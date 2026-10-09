export function trackBuyerEvent(eventName: string, parameters: Record<string, string | number> = {}) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", eventName, parameters);
}
