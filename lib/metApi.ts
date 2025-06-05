import axios from "axios";
import type { SearchResult, ObjectDetails, Department } from "./types";

const BASE_URL = "https://collectionapi.metmuseum.org/public/collection/v1";

/**
 * Recherche simple (q obligatoire) + options 
 * Renvoie total + objectIDs.
 */
export async function searchObjects(
    q: string,
    options?: {
        departmentId?: string;
        hasImages?: boolean;
        dateBegin?: number;
        dateEnd?: number;
        isOnView?: boolean;
        isHighlight?: boolean;
        artistOrCulture?: boolean;
        medium?: string;
        tags?: boolean;
        geoLocation?: string;
    }
): Promise<SearchResult> {
    const params: any = { q };

    if (options?.departmentId) params.departmentId = options.departmentId;
    if (options?.hasImages) params.hasImages = true;
    if (options?.isOnView) params.isOnView = true;
    if (options?.isHighlight) params.isHighlight = true;
    if (options?.artistOrCulture) params.artistOrCulture = true;
    if (options?.medium) params.medium = options.medium;
    if (options?.tags) params.tags = true;
    if (options?.geoLocation) params.geoLocation = options.geoLocation;
    if (options?.dateBegin != null && options?.dateEnd != null) {
        params.dateBegin = options.dateBegin;
        params.dateEnd = options.dateEnd;
    }

    const url = `${BASE_URL}/search`;
    const response = await axios.get<SearchResult>(url, { params });
    return response.data;
}

/**
 * Récupère le détail d’un objet par son ID.
 */
export async function getObject(objectID: number): Promise<ObjectDetails> {
    const url = `${BASE_URL}/objects/${objectID}`;
    const response = await axios.get<ObjectDetails>(url);
    return response.data;
}

/**
 * Liste tous les départements.
 */
export async function getDepartments(): Promise<Department[]> {
    const url = `${BASE_URL}/departments`;
    const response = await axios.get<{ departments: Department[] }>(url);
    return response.data.departments;
}
