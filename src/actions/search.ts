// src/actions/search.ts
"use server";

import { fetchCategories } from "./categories";
import { fetchProducts } from "./products";

// Updated searchItems function
export async function searchItems(query: string): Promise<{
  combinedResults: Array<{
    id: string;
    slug: string;
    name: string;
    description: string;
    type: string;
    createdAt?: string;
  }>;
}> {
  if (!query) return { combinedResults: [] };

  const allProducts = (await fetchProducts({})).products;
  const allCategories = (await fetchCategories({})).categories;

  // Filter items based on the query (case-insensitive)
  const filteredProducts = allProducts.filter(
    (item) =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
  );

  const filteredCategories = allCategories.filter(
    (item) =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item?.description?.toLowerCase().includes(query.toLowerCase())
  );

  // Combine products and categories and add `type` to each item
  const combinedResults = [
    ...filteredProducts.map((item) => ({ ...item, type: "Product" })),
    ...filteredCategories.map((item) => ({ ...item, type: "Category" })),
  ];

  // Sort combined results alphabetically by the first letter of the title
  combinedResults.sort((a, b) => a.name.localeCompare(b.name));

  return { combinedResults: JSON.parse(JSON.stringify(combinedResults)) };
}
