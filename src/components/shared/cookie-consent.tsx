"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

const STORAGE_KEY = "betalight-cookie-consent";

export function CookieConsent() {
  const [consent, setConsent] = useState<"accepted" | "declined" | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "accepted" || stored === "declined") setConsent(stored);
    setReady(true);
  }, []);

  function choose(value: "accepted" | "declined") {
    window.localStorage.setItem(STORAGE_KEY, value);
    setConsent(value);
  }

  return (
    <>
      {consent === "accepted" && siteConfig.gaMeasurementId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${siteConfig.gaMeasurementId}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${siteConfig.gaMeasurementId}');`}
          </Script>
        </>
      )}
      <AnimatePresence>
        {ready && consent === null && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed inset-x-4 bottom-20 z-50 mx-auto flex max-w-xl flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-xl sm:flex-row sm:items-center sm:justify-between md:bottom-4"
          >
            <p className="text-sm text-muted-foreground">
              We use cookies to improve your experience on this site. See our{" "}
              <a href="/privacy-policy" className="underline underline-offset-2">
                privacy policy
              </a>{" "}
              for details.
            </p>
            <div className="flex shrink-0 gap-2">
              <Button size="sm" variant="outline" onClick={() => choose("declined")}>
                Decline
              </Button>
              <Button size="sm" onClick={() => choose("accepted")}>
                Accept
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
