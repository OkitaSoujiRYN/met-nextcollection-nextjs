// src/app/page.tsx
import Image from "next/image";

// Cette page est régénérée toutes les 12 heures (ISR)
export const revalidate = 60 * 60 * 12; // 12 heures en secondes

type MetObject = {
  objectID: number;
  title: string;
  objectDate: string;
  primaryImageSmall: string;
};

export default async function HomePage() {
  // 1) Récupérer la liste des ID des objets "Highlights" avec images
  const searchRes = await fetch(
    "https://collectionapi.metmuseum.org/public/collection/v1/search?q=&isHighlight=true&hasImages=true"
  );
  if (!searchRes.ok) {
    return (
      <main className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Highlights du MET</h1>
        <p className="text-red-600">Impossible de charger les highlights.</p>
      </main>
    );
  }

  const { objectIDs } = await searchRes.json();
  const topIds: number[] = (objectIDs ?? []).slice(0, 8);

  // 2) Pour chaque ID, récupérer titre / date / image
  const objets: MetObject[] = await Promise.all(
    topIds.map(async (id) => {
      const objRes = await fetch(
        `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`
      );
      if (!objRes.ok) {
        return {
          objectID: id,
          title: "Titre indisponible",
          objectDate: "",
          primaryImageSmall: "",
        };
      }
      const data = await objRes.json();
      return {
        objectID: data.objectID,
        title: data.title,
        objectDate: data.objectDate,
        primaryImageSmall: data.primaryImageSmall,
      };
    })
  );

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Highlights du MET</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {objets.map((o) => (
          <article
            key={o.objectID}
            className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white"
          >
            {o.primaryImageSmall ? (
              <Image
                src={o.primaryImageSmall}
                alt={o.title}
                width={400}
                height={400}
                className="object-cover w-full aspect-square"
              />
            ) : (
              <div className="bg-gray-200 w-full aspect-square flex items-center justify-center">
                <span className="text-gray-500">Pas d’image</span>
              </div>
            )}
            <div className="p-3">
              <h2 className="text-sm font-medium truncate">{o.title}</h2>
              <p className="text-xs text-gray-500 mt-1">{o.objectDate}</p>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
