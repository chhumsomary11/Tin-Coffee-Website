// src/hooks/useMenu.ts

"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchMenu } from "@/lib/api/menuAPI";
import type { MenuItem } from "@/types/menu";

export function useMenu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getErrorMessage = (error: unknown) =>
    error instanceof Error ? error.message : "Failed to load menu";

  const loadMenu = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await fetchMenu();

      setMenuItems(data);
    } catch (error: unknown) {
      setError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isActive = true;

    fetchMenu()
      .then((data) => {
        if (isActive) {
          setMenuItems(data);
        }
      })
      .catch((error: unknown) => {
        if (isActive) {
          setError(getErrorMessage(error));
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  return {
    menuItems,
    isLoading,
    error,
    refetch: loadMenu,
  };
}
