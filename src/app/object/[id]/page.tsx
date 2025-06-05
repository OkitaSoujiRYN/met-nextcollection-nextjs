// src/app/object/[id]/page.tsx
import Image from "next/image";
import Link from "next/link";              // ← Ajout de cet import
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { ObjectDetails } from "@/lib/types";
import { getObject } from "@/lib/metApi";

interface PageProps {
  params: { id: string };
}

// On régénère cette page toutes les 6 heures (ISR)
export const revalidate = 60 * 60 * 6; // 6 heures

/**
 * Optionnel : on peut pré‐rendre quelques pages “highlight” à la
 * build via generateStaticParams.
 */
export async function generateStaticParams() {
  const searchRes = await fetch(
    "https://collectionapi.metmuseum.org/public/collection/v1/search?q=&isHighlight=true&hasImages=true"
  );
  if (!searchRes.ok) return [];

  const { objectIDs } = await searchRes.json();
  const topIds: number[] = (objectIDs ?? []).slice(0, 10);

  return topIds.map((id) => ({ id: id.toString() }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const id = parseInt(params.id, 10);
  const obj: ObjectDetails = await getObject(id).catch(() => {
    return null as unknown as ObjectDetails;
  });

  if (!obj) {
    return {
      title: "Objet introuvable",
      description: "Cet objet n'a pas pu être chargé.",
    };
  }

  return {
    title: obj.title,
    description: `${obj.title} – ${obj.objectDate}`,
  };
}

export default async function ObjectPage({ params }: PageProps) {
  const idParam = params.id;
  const id = parseInt(idParam, 10);

  if (isNaN(id) || id <= 0) {
    notFound();
  }

  let obj: ObjectDetails;
  try {
    obj = await getObject(id);
  } catch {
    notFound();
  }

  return (
    <main className="container mx-auto p-4">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* — IMAGE PRINCIPALE — */}
        <div className="flex-shrink-0 lg:w-1/2">
          {obj.primaryImage ? (
            <Image
              src={obj.primaryImage}
              alt={obj.title}
              width={800}
              height={800}
              className="object-cover w-full max-h-[80vh] rounded-lg shadow"
            />
          ) : (
            <div className="bg-gray-200 w-full h-[400px] rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Pas d’image disponible</span>
            </div>
          )}
        </div>

        {/* — INFORMATIONS TEXTUELLES — */}
        <div className="flex-1 space-y-4">
          <h1 className="text-2xl font-bold">{obj.title}</h1>
          <p className="text-gray-600">
            <span className="font-medium">Date :</span>{" "}
            {obj.objectDate || "N/A"}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Artiste :</span>{" "}
            {obj.artistDisplayName || "Inconnu"}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Département :</span> {obj.department}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Culture :</span> {obj.culture || "N/A"}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Période :</span> {obj.period || "N/A"}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Pays :</span> {obj.country || "N/A"}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Dimensions :</span> {obj.dimensions}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Classification :</span>{" "}
            {obj.classification || "N/A"}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Crédit :</span> {obj.creditLine || "N/A"}
          </p>
          <p>
            <a
              href={obj.objectURL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-metRed hover:underline"
            >
              Voir sur le site du MET
            </a>
          </p>
        </div>
      </div>

      {/* — Bouton retour accueil — */}
      <div className="mt-8">
        <Link
          href="/"
          className="text-metRed hover:underline hover:underline-offset-2"
        >
          ← Retour accueil
        </Link>
      </div>
    </main>
  );
}
