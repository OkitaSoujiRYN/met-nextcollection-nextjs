// src/app/components/QuickSearch.tsx
"use client";

import { useState, useEffect } from "react";
import { searchObjects, getObject } from "@/lib/metApi";
import Link from "next/link";
import Image from "next/image";
import { useDebounce } from "./useDebounce";

type ResultItem = {
  id: number;
  title: string;
  img: string;
};

export default function QuickSearch() {
  const [q, setQ] = useState<string>("");
  const debounced = useDebounce<string>(q, 400);
  const [results, setResults] = useState<ResultItem[]>([]);

  useEffect(() => {
    if (debounced.length < 2) {
      setResults([]);
      return;
    }

    let active = true;

    (async () => {
      try {
        const { objectIDs } = await searchObjects(debounced, { hasImages: true });
        if (!active) return;

        const slice = (objectIDs ?? []).slice(0, 5);
        const arr: ResultItem[] = await Promise.all(
          slice.map(async (id) => {
            const o = await getObject(id);
            return {
              id,
              title: o.title,
              img: o.primaryImageSmall,
            };
          })
        );
        setResults(arr);
      } catch (error) {
        console.error("QuickSearch error:", error);
      }
    })();

    return () => {
      active = false;
    };
  }, [debounced]);

  return (
    <div className="relative w-full max-w-xs">
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Recherche rapide…"
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-metRed/50"
      />

      {results.length > 0 && (
        <ul className="absolute top-full mt-1 w-full bg-white border border-gray-200 shadow-lg rounded z-50">
          {results.map((r) => (
            <li
              key={r.id}
              className="hover:bg-gray-100 border-b last:border-b-0"
            >
              <Link
                href={`/object/${r.id}`}
                className="flex items-center gap-2 p-2"
                onClick={() => setQ("")}
              >
                <div className="w-8 h-8 relative flex-shrink-0">
                  {r.img ? (
                    <Image
                      src={r.img}
                      alt={r.title}
                      width={32}
                      height={32}
                      className="object-cover rounded"
                    />
                  ) : (
                    <div className="bg-gray-200 w-full h-full rounded" />
                  )}
                </div>
                <span className="text-sm truncate">{r.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
