"use client";

import { createContext, useContext, useState } from "react";

interface ContactPanelContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const ContactPanelContext = createContext<ContactPanelContextValue>({
  isOpen: false,
  open: () => {},
  close: () => {},
});

// Header (bouton "Contact") ET Footer (lien "Contact" des liens rapides) doivent
// ouvrir le même panneau : l'état vit ici plutôt que dans Header, qui reste le
// seul à effectivement monter <ContactPanel> (cf. Header.tsx).
export function useContactPanel() {
  return useContext(ContactPanelContext);
}

export default function ContactPanelProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ContactPanelContext.Provider
      value={{ isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) }}
    >
      {children}
    </ContactPanelContext.Provider>
  );
}
