// src/app/advanced/page.tsx
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchObjects, getObject, getDepartments } from "@/lib/metApi";
import Link from "next/link";
import Image from "next/image";
import type { Department, ObjectDetails } from "@/lib/types";

export default function AdvancedPage() {
  // 1) Chargement des départements
  const {
    data: deps,
    isLoading: depsLoading,
    isError: depsError,
  } = useQuery<Department[]>({
    queryKey: ["departments"],
    queryFn: getDepartments,
  });

  // 2) États du formulaire + résultats
  const [ids, setIds] = useState<number[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [form, setForm] = useState({
    q: "",
    departmentId: "",
    hasImages: true,
    // on peut étendre ici : dateBegin, dateEnd, tags, medium, etc.
  });
  const [isSearching, setIsSearching] = useState(false);

  // 3) Fonction submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.q.trim()) return;

    setIsSearching(true);
    try {
      const { total: tot, objectIDs } = await searchObjects(form.q, {
        departmentId: form.departmentId,
        hasImages: form.hasImages,
      });
      setTotal(tot);
      setIds(objectIDs ?? []);
    } catch (err) {
      console.error("Erreur searchObjects :", err);
      setTotal(0);
      setIds([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Recherche avancée</h1>
        <Link
          href="/"
          className="text-sm text-metRed hover:underline hover:underline-offset-2"
        >
          ← Retour accueil
        </Link>
      </div>

      {/* Formulaire de recherche */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
          <input
            type="text"
            value={form.q}
            onChange={(e) => setForm({ ...form, q: e.target.value })}
            placeholder="Mot clé (ex : sunflowers)"
            className="border px-3 py-2 rounded w-full sm:w-64 focus:outline-none focus:ring-metRed/50 focus:ring"
          />
          <select
            value={form.departmentId}
            onChange={(e) =>
              setForm({ ...form, departmentId: e.target.value })
            }
            className="border px-3 py-2 rounded w-full sm:w-48 focus:outline-none focus:ring-metRed/50 focus:ring"
            disabled={depsLoading || depsError}
          >
            <option value="">
              {depsLoading ? "Chargement…" : "Tous départements"}
            </option>
            {deps?.map((d) => (
              <option key={d.departmentId} value={d.departmentId}>
                {d.displayName}
              </option>
            ))}
          </select>

          <label className="inline-flex items-center gap-2 mt-2 sm:mt-0">
            <input
              type="checkbox"
              checked={form.hasImages}
              onChange={(e) =>
                setForm({ ...form, hasImages: e.target.checked })
              }
              className="h-4 w-4 text-metRed border-gray-300 rounded"
            />
            <span className="text-sm">Uniquement avec images</span>
          </label>

          <button
            type="submit"
            className={`mt-2 sm:mt-0 px-4 py-2 rounded text-white ${
              isSearching
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-metRed hover:bg-metRed/90"
            }`}
            disabled={isSearching}
          >
            {isSearching ? "Recherche…" : "Chercher"}
          </button>
        </div>
      </form>

      {/* Résultat texte */}
      {total > 0 && (
        <p className="mb-4 text-sm text-gray-600">
          {total} objet{total > 1 ? "s" : ""} trouvé{total > 1 ? "s" : ""}
        </p>
      )}
      {total === 0 && !isSearching && form.q.trim() !== "" && (
        <p className="mb-4 text-sm text-gray-600">
          Aucun résultat pour « {form.q} »
        </p>
      )}

      {/* Grille des résultats (jusqu’à 40) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {ids.slice(0, 40).map((id) => (
          <ResultCard key={id} id={id} />
        ))}
      </div>
    </main>
  );
}

/**
 * Composant pour afficher une vignette de résultat avancé
 */
function ResultCard({ id }: { id: number }) {
  const { data: obj, isLoading, isError } = useQuery<ObjectDetails>({
    queryKey: ["object", id],
    queryFn: () => getObject(id),
  });

  if (isLoading) {
    return (
      <div className="border rounded-lg p-4 flex items-center justify-center text-gray-500">
        Chargement…
      </div>
    );
  }
  if (isError || !obj) {
    return (
      <div className="border rounded-lg p-4 text-red-600 text-sm text-center">
        Échec de chargement
      </div>
    );
  }

  return (
    <Link
      href={`/object/${id}`}
      className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white flex flex-col"
    >
      {obj.primaryImageSmall ? (
        <Image
          src={obj.primaryImageSmall}
          alt={obj.title}
          width={400}
          height={400}
          className="object-cover w-full aspect-square"
        />
      ) : (
        <div className="bg-gray-200 w-full aspect-square flex items-center justify-center">
          <span className="text-gray-500 text-xs">Pas d’image</span>
        </div>
      )}
      <div className="p-2 flex-1 flex flex-col justify-between">
        <h3 className="text-sm font-medium truncate">{obj.title}</h3>
        <p className="text-xs text-gray-500 mt-1">{obj.objectDate}</p>
      </div>
    </Link>
  );
}
