"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/darkMode";
import { Search } from "lucide-react"; // nice search icon

export const Appbar = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?query=${encodeURIComponent(query)}`);
    }
  };

  return (
    <header className="w-full border-b shadow-sm backdrop-blur-sm bg-white/80 dark:bg-gray-900/70">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <div
            onClick={() => router.push("/items")}
            className="cursor-pointer text-gray-500 font-semibold"
          >
            Home
          </div>
        </div>

        <div className="flex items-center gap-3">
        <form
          onSubmit={handleSearch}
          className="hidden sm:flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1 w-[280px] sm:w-[350px] md:w-[400px]"
        >
          <Search className="w-5 h-5 text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search items..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent w-full focus:outline-none text-gray-700 dark:text-gray-200 placeholder-gray-400"
          />
        </form>
            <Button
            onClick={() => router.push("/sell")}
            className="bg-gradient-to-r from-green-400 to-green-600 
                       text-white font-semibold px-4 py-2 rounded-xl shadow-sm
                       transition-all duration-300 hover:from-green-500 hover:to-green-700"
          >
            🛒 Sell Item
          </Button>
          
          {!session ? (
            <Button
              onClick={() => signIn()}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              Sign In
            </Button>
          ) : (
            <Button
              onClick={() => signOut()}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Logout
            </Button>
          )}

          <ModeToggle />
        </div>
      </div>
    </header>
  );
};
