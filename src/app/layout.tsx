// src/app/layout.tsx
import "./globals.css";
import Header from "./components/Header";
import Providers from "./providers";
import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MET Explorer",
  description: "Interface de recherche des collections du MET",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased min-h-screen flex flex-col">
        {/* En-tête fixe */}
        <Header />

        {/* Le reste de la page (scrollable) */}
        <Providers>
          <main className="flex-1 pt-4 px-4 sm:px-8 lg:px-16">
            {children}
          </main>
        </Providers>

        {/* (Éventuel footer si besoin) */}
      </body>
    </html>
  );
}
