// src/app/components/Header.tsx
"use client";

import QuickSearch from "./QuickSearch";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 py-4 sticky top-0 z-20">
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-8 lg:px-16">
        {/* Logo / Accueil */}
        <Link href="/" className="text-2xl font-bold text-metRed">
          MET Explorer
        </Link>

        {/* Quick Search */}
        <QuickSearch />

        {/* Boutons de navigation */}
        <nav className="flex items-center gap-4">
          <Link
            href="/advanced"
            className="text-sm px-3 py-1 rounded bg-metRed text-white hover:bg-metRed/90 transition"
          >
            Recherche avancée
          </Link>
          <Link
            href="/"
            className="text-sm px-3 py-1 rounded bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
          >
            Accueil
          </Link>
        </nav>
      </div>
    </header>
  );
}
