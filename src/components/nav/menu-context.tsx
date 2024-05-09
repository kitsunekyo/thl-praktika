"use client";

import { ReactNode, createContext, useContext, useState } from "react";

type MenuContext = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const menuContext = createContext<MenuContext | null>(null);

export function MenuProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <menuContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </menuContext.Provider>
  );
}

export function useMenu() {
  return useContext(menuContext);
}
