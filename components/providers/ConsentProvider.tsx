"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Consent = "granted" | "denied" | null;

const STORAGE_KEY = "cookie_consent";

interface ConsentContextValue {
  consent: Consent;
  hydrated: boolean;
  grant: () => void;
  deny: () => void;
}

const ConsentContext = createContext<ConsentContextValue>({
  consent: null,
  hydrated: false,
  grant: () => {},
  deny: () => {},
});

export function useConsent() {
  return useContext(ConsentContext);
}

export default function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<Consent>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Consent;
    if (stored) setConsent(stored);
    setHydrated(true);
  }, []);

  function grant() {
    localStorage.setItem(STORAGE_KEY, "granted");
    setConsent("granted");
  }

  function deny() {
    localStorage.setItem(STORAGE_KEY, "denied");
    setConsent("denied");
  }

  return (
    <ConsentContext.Provider value={{ consent, hydrated, grant, deny }}>
      {children}
    </ConsentContext.Provider>
  );
}
