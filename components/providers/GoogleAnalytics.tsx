"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useConsent } from "./ConsentProvider";
import { GA_ID, pageview } from "@/lib/gtag";

export default function GoogleAnalytics() {
  const { consent } = useConsent();
  const pathname = usePathname();

  useEffect(() => {
    if (consent === "granted" && process.env.NODE_ENV === "production") {
      pageview(pathname);
    }
  }, [pathname, consent]);

  if (!GA_ID || consent !== "granted" || process.env.NODE_ENV !== "production") {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { page_path: window.location.pathname });
        `}
      </Script>
    </>
  );
}
