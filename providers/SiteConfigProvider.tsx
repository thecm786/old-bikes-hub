"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { siteConfig, resolveSiteConfig } from "@/lib/siteConfig";

const SiteConfigContext = createContext(siteConfig);

export function SiteConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState(siteConfig);
  useEffect(() => onSnapshot(doc(db, "publicSettings", "site"), (snapshot) => {
    setConfig(resolveSiteConfig(snapshot.data()));
  }, (error) => {
    console.error("Unable to load public settings:", error);
  }), []);

  return <SiteConfigContext.Provider value={config}>{children}</SiteConfigContext.Provider>;
}

export const useSiteConfig = () => useContext(SiteConfigContext);
