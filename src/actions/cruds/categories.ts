// src/actions/crud/categories.ts

import {
  createRecord,
  getRecord,
  updateRecord,
  deleteRecord,
  getPaginatedRecords,
  getRecordCount,
} from "@/actions/db/crud";
import { createCategoriesTable } from "@/actions/db/tables";
import { Category } from "@/types";

await createCategoriesTable();

// Create a new category
export async function createCategory(data: Partial<Category>) {
  console.log(`Creating category: ${data.name}`);
  return await createRecord("categories", data);
}

// Get a specific category
export async function getCategory(where: Partial<Category>) {
  console.log(`Fetching category: ${JSON.stringify(where)}`);
  return await getRecord("categories", where);
}

// Get all categories with optional filters
export async function getCategories(filters: Partial<Category> = {}) {
  console.log(`Fetching categories with filters: ${JSON.stringify(filters)}`);
  return await getRecord("categories", filters);
}

// Get paginated categories with filters, limit, and offset
export async function getPaginatedCategories(
  filters: Partial<Category> = {},
  limit: number,
  offset: number
) {
  console.log(
    `Fetching paginated categories - Limit: ${limit}, Offset: ${offset}, Filters: ${JSON.stringify(filters)}`
  );
  return await getPaginatedRecords("categories", filters, limit, offset);
}

// Get the total count of categories based on filters
export async function getCategoriesCount(filters: Partial<Category> = {}) {
  console.log(`Counting categories with filters: ${JSON.stringify(filters)}`);
  return await getRecordCount("categories", filters);
}

// Update a category
export async function updateCategory(
  data: Partial<Category>,
  where: Partial<Category>
) {
  console.log(`Updating category: ${JSON.stringify(data)}`);
  return await updateRecord("categories", data, where);
}

// Delete a category
export async function deleteCategory(where: Partial<Category>) {
  console.log(`Deleting category: ${JSON.stringify(where)}`);
  return await deleteRecord("categories", where);
}
