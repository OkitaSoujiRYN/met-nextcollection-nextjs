# MET Explorer

Une application Next.js qui permet de parcourir les collections du Metropolitan Museum of Art via leur API Open Access.  
Elle offre :
- Un affichage des **“Highlights”** (œuvres mises en avant) dès la page d’accueil (SSG/ISR).  
- Une **Recherche rapide** (dans l’en-tête) pour retrouver instantanément n’importe quel objet.  
- Une **Recherche avancée** (page dédiée) avec filtres sur le ou les départements, possibilité de n’afficher que les objets munis d’images, etc.  
- Une page dynamique **/object/[id]** qui détaille toutes les métadonnées d’un objet (image, titre, date, artiste, dimensions, classification, etc.).  

Ce projet a été réalisé dans le cadre d’un cours SupKnowledge – uniquement la partie **frontend** est à rendre ; l’API reste celle du MET (sans clé ni compte requis).

---

## Table des matières

1. [Démo / Captures d’écran](#démo--captures-décran)  
2. [Fonctionnalités](#fonctionnalités)  
3. [Tech Stack](#tech-stack)  
4. [Installation et lancement](#installation-et-lancement)  
   - Prérequis  
   - Configuration  
   - Scripts disponibles  
5. [Organisation du projet](#organisation-du-projet)  
6. [Explications techniques](#explications-techniques)  
   - ISR / SSG  
   - React-Query (Recherche avancée)  
   - Next/Image  
   - Tailwind CSS  
7. [Contribuer](#contribuer)  
8. [Licence](#licence)

---

## Démo / Captures d’écran

> **Page d’accueil – Highlights du MET**  
> ![Screenshot Home](./docs/screenshots/home.png)

> **Recherche rapide dans l’en-tête (Quick Search)**  
> ![Screenshot Quick Search](./docs/screenshots/quick-search.png)

> **Page Recherche avancée (/advanced)**  
> ![Screenshot Advanced Search](./docs/screenshots/advanced-search.png)

> **Page d’un objet détaillé (/object/[id])**  
> ![Screenshot Object Page](./docs/screenshots/object-page.png)

*(Remplacez ces liens par vos propres images dans `/docs/screenshots/` si vous souhaitez afficher des captures pour la doc.)*

---

## Fonctionnalités

1. **Page d’accueil (Highlights)**  
   - Récupère tous les **objectIDs** marqués `isHighlight=true` et `hasImages=true` grâce à l’API MET.  
   - Prend les 8 premiers pour les afficher dans un grid responsive (2, 3 ou 4 colonnes suivant la largeur d’écran).  
   - Utilisation de l’**ISR** (et `revalidate = 12h`) pour que la liste soit régénérée automatiquement toutes les 12 heures.

2. **En-tête global (Header)**  
   - **Logo / lien accueil**  
   - **Barre “Recherche rapide”** (Quick Search) :  
     - Tapez au moins 2 caractères → le composant `QuickSearch.tsx` effectue un appel API à `/search?q=…&hasImages=true` en temps réel.  
     - Affiche jusqu’à 5 résultats (titre + petite vignette).  
     - Cliquer sur un résultat redirige vers `/object/[id]`.  

   - **Lien “Recherche avancée”** (vers `/advanced`).  

3. **Page “Recherche avancée” (`/advanced`)**  
   - Chargement de la liste des **départements** (`/departments`) avec React-Query.  
   - Formulaire :  
     - Saisie d’un mot-clé (q).  
     - Sélecteur de département (liste dynamique).  
     - Case à cocher “Uniquement avec images”.  
     - Bouton “Chercher” (désactivé pendant l’appel).  
   - Après validation, fetch `GET /search?q={q}&departmentId={id}&hasImages=true`.  
   - Affiche le nombre total de résultats, puis jusqu’à 40 vignettes (via un `useQuery` pour chaque objet).  
   - Gestion des états de chargement et d’erreur.  

4. **Page objet dynamique (`/object/[id]`)**  
   - Utilise **`getObject(id)`** pour récupérer le JSON complet de l’objet (`ObjectDetails`).  
   - Affiche :  
     - Image principale (ou placeholder si absente).  
     - Titre, date, artiste, département, culture, période, pays, dimensions, classification, crédit.  
     - Lien vers la page officielle du MET.  
   - Utilisation de `generateStaticParams()` pour pré-rendre quelques pages “focus” à la build.  
   - ISR : `revalidate = 6 heures` pour garder le contenu à jour.  
   - Si l’ID n’est pas valide ou l’objet introuvable → `notFound()` (404).

5. **Responsive / UI-UX**  
   - **Tailwind CSS** pour un rendu fluide et responsive.  
   - Grilles adaptatives (`grid-cols-2 sm:grid-cols-3 lg:grid-cols-4`, etc.).  
   - États “hover” / transitions sur les vignettes.  
   - Couleur “MET Red” (#A50000) pour les boutons et liens clés, gris clair pour les fonds.  

---

## Tech Stack

- **Next.js 15.3.3** (App Router, ISR/SSG, Link, Image)  
- **React 19** (hooks, client/server components)  
- **TypeScript 5** (typage strict, interfaces dans `/lib/types.ts`)  
- **Tailwind CSS 4.1.8** (utilitaires, config minimaliste)  
- **React-Query @tanstack/react-query** (mise en cache + requêtes pour la recherche avancée)  
- **Axios** (appels API REST vers `collectionapi.metmuseum.org`)  
- **Zod** (schema validation si souhaité pour les formulaires)  
- **Git & GitHub** (versionning, dépôt public)

---

## Installation et lancement

### Prérequis

- **Node.js ≥ 18.x** (recommandé : la dernière LTS).  
- **npm** (ou `yarn` / `pnpm` / `bun`) installé globalement.

### Étapes

1. **Clonez ou téléchargez** ce dépôt :
   ```bash
   git clone https://github.com/OkitaSoujiRYN/met-nextcollection-nextjs.git
   cd met-nextcollection-nextjs
