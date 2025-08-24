"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { itemType } from "@/app/page";

interface ItemsContextType {
  items: itemType[];
  setItems: (items: itemType[]) => void;
}

export const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

export const ItemsProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<itemType[]>([]);

  return (
    <ItemsContext.Provider value={{ items, setItems }}>
      {children}
    </ItemsContext.Provider>
  );
};


