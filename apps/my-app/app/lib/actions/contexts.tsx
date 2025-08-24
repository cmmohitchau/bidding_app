"use client";

import { ItemsContext } from "@/app/context/ItemsContext";
import { useContext } from "react";

export const useItems = () => {
  const context = useContext(ItemsContext);
  if (!context) {
    throw new Error("useItems must be used within an ItemsProvider");
  }
  return context;
};