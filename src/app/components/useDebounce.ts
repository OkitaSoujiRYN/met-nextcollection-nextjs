// src/app/components/useDebounce.ts
"use client";

import { useState, useEffect } from "react";

/**
 * Renvoie la valeur “value” uniquement après un délai “delay” sans changement.
 * Utile pour ne pas lancer la recherche à chaque frappe.
 */
export function useDebounce<T>(value: T, delay = 400): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
}
