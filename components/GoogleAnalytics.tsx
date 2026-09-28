"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useCallback } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// Public measurement ID, not a secret. Keep preview and local traffic out of GA4.
const measurementId = "G-WTRLX31T5N";

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const lastPage = useRef<string | null>(null);
  const recordPage = useCallback(() => {
    if (!window.gtag || lastPage.current === pathname) return;
    lastPage.current = pathname;
    window.gtag("event", "page_view", {
      page_location: window.location.origin + pathname,
      page_title: document.title,
    });
  }, [pathname]);
  useEffect(recordPage, [recordPage]);

  return (
    <Script id="google-analytics" strategy="afterInteractive" onReady={recordPage}>
      {`
        if (["oldbikeshub.com", "www.oldbikeshub.com"].includes(window.location.hostname)) {
          window.dataLayer = window.dataLayer || [];
          window.gtag = function(){window.dataLayer.push(arguments);};
          window.gtag('js', new Date());
          window.gtag('config', '${measurementId}', {
            send_page_view: false,
            allow_google_signals: false,
            allow_ad_personalization_signals: false
          });
          var tag = document.createElement('script');
          tag.async = true;
          tag.src = 'https://www.googletagmanager.com/gtag/js?id=${measurementId}';
          document.head.appendChild(tag);
        }
      `}
    </Script>
  );
}
