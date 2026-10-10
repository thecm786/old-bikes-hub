export function trackBuyerEvent(eventName: string, parameters: Record<string, string | number> = {}) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", eventName, parameters);
}

export function trackBuyerEnquiry(contactMethod: "whatsapp" | "phone") {
  const parameters = { contact_method: contactMethod };
  trackBuyerEvent("used_bike_enquiry", parameters);
  trackBuyerEvent("generate_lead", parameters);
}
