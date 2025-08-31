import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ItemsProvider } from "./context/ItemsContext";
import { Appbar } from "./components/Appbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BidWin - The Ultimate Bidding Platform",
  description: "Join the excitement of competitive bidding with secure transactions and real-time updates.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <ItemsProvider>
              <Appbar />
              {children}
            </ItemsProvider>
          </Providers>
        </ThemeProvider>
        
      </body>
    </html>
  );
}
