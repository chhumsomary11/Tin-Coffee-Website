//Purpose:  Function for Frontend API call layer\
//Note: This service is to be called in hooks or server components to fetch menu data from the backend API.
//Note: Component will use this service through the hook

import type { MenuItem, MenuFilters } from "@/types/menu";
import type { ApiResponse } from "@/types/data";

export async function fetchMenu(
  filters: MenuFilters = {},
): Promise<MenuItem[]> {
  const searchParams = new URLSearchParams();

  //Note: Condition SEarch by itemName
  if (filters.search?.trim()) {
    searchParams.set("search", filters.search.trim());
  }

  if (filters.category && filters.category !== "ALL") {
    searchParams.set("category", filters.category);
  }
  if (typeof filters.available === "boolean") {
    searchParams.set("available", String(filters.available));
  }

  if (typeof filters.isNew === "boolean") {
    searchParams.set("isNew", String(filters.isNew));
  }
  // Note: if the endpoint has query string
  const queryString = searchParams.toString();

  const endpoint = queryString ? `/api/menu?${queryString}` : "/api/menu";

  const response = await fetch(endpoint);

  const result = (await response.json()) as ApiResponse<MenuItem[]>;

  if (!response.ok || !result.success || !result.data) {
    throw new Error(result.message || "Failed to fetch menu");
  }

  return result.data;
}
