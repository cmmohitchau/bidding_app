"use client";

import sold from "@/public/Sold.png";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { itemType } from "@/app/items/page";
import axios from "axios";
import { BACKEND_URL } from "@repo/common/urls";
import { Products } from "../Products";
import { Search } from "lucide-react";
import { log } from "console";

export const ItemsClient = () => {
  const [items, setItems] = useState<itemType[]>([]);
  const [query , setQuery] = useState("");

  const router = useRouter();
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsSticky(scrollY > 205);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?query=${encodeURIComponent(query)}`);
    }
  };
  useEffect(() => {
    async function getItems() {
      const res = await axios.get(`${BACKEND_URL}/item/items`);
      setItems(res.data.items);
      console.log("response in frontend : " , res.data.items);
    }
    getItems();
  }, []);

  return (
    <>
          <form
          onSubmit={handleSearch}
          className={`flex sm:hidden items-center ${
        isSticky
          ? "fixed top-0 left-0 right-0 z-50 rounded-none shadow-md transition-all duration-300"
          : "sticky top-0 mx-4 mt-2 rounded-full"
      } bg-gray-100 dark:bg-gray-800 px-3 py-2`}          >
          <Search className="w-5 h-5 text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search items..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent w-full focus:outline-none text-gray-700 dark:text-gray-200 placeholder-gray-400"
          />
        </form>
        <Products items={items} />
    </>
  )

  
};
