"use client";

import { createContext, useContext, useState } from "react";

interface OpenOptions {
  /** La photo de Contact est déjà affichée dessous (menu ouvert sur Contact) : le panneau ne
   *  l'anime pas, seul le bloc sombre (formulaire) balaie à l'ouverture et à la fermeture. */
  keepPhoto?: boolean;
}

interface ContactPanelContextValue {
  isOpen: boolean;
  /** Mémorisé à l'ouverture et conservé jusqu'à la fin de la fermeture (pas remis à false au close). */
  keepPhoto: boolean;
  open: (options?: OpenOptions) => void;
  close: () => void;
}

const ContactPanelContext = createContext<ContactPanelContextValue>({
  isOpen: false,
  keepPhoto: false,
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
  const [keepPhoto, setKeepPhoto] = useState(false);

  return (
    <ContactPanelContext.Provider
      value={{
        isOpen,
        keepPhoto,
        open: (options) => {
          setKeepPhoto(Boolean(options?.keepPhoto));
          setIsOpen(true);
        },
        close: () => setIsOpen(false),
      }}
    >
      {children}
    </ContactPanelContext.Provider>
  );
}
