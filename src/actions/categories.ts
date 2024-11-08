"use server";

import {
  getPaginatedCategories,
  getCategoriesCount,
} from "@/actions/cruds/categories";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/actions/cruds/categories";

import { Category } from "@/types";

// interface FetchCategoryParams {
//   page?: number;
//   searchQuery?: string;
//   priceRange?: string;
//   category?: string;
// }

// Fetch all categories with optional pagination and search
export const fetchCategories = async ({
  page = 1,
  searchQuery = "",
  category = "all",
  name,
  slug,
  pageSize = 10,
}: {
  page?: number;
  searchQuery?: string;
  category?: string;
  name?: string; // New: For checking name duplicates
  slug?: string; // New: For checking slug duplicates
  pageSize?: number;
}): Promise<{
  categories: Category[];
  totalResults: number;
  totalPages: number;
}> => {
  const limit = pageSize;
  const offset = (page - 1) * limit;

  const filters: Partial<Category> = {};
  if (searchQuery) {
    filters.name = `%${searchQuery.toLowerCase()}%`;
  }
  if (category !== "all") {
    filters.slug = category;
  }
  if (name) {
    filters.name = name;
  }
  if (slug) {
    filters.slug = slug;
  }

  const totalResults = await getCategoriesCount(filters);
  const categories = (await getPaginatedCategories(
    filters,
    limit,
    offset
  )) as Category[];
  
  // Calculate total pages based on total results and limit
  const totalPages = Math.ceil(totalResults / limit);

  return { categories, totalResults, totalPages };
};

// Fetch a single category by slug
export const fetchCategoryBySlug = async (
  slug: string
): Promise<Category | undefined> => {
  console.log(`Fetching category by slug: ${slug}`);
  const category = (await getCategories({ slug })) as Category[];
  return category[0];
};

// Fetch a single category by id
export const fetchCategoryById = async (
  id: number
): Promise<Category | undefined> => {
  console.log(`Fetching category by id: ${id}`);
  const category = (await getCategories({ id })) as Category[];
  return category[0];
};

// Create a new category
export const addCategory = async (
  data: Partial<Category>
): Promise<Category> => {
  console.log(`Adding new category: ${data.name}`);
  return (await createCategory(data)) as Category;
};

// Update an existing category
export const modifyCategory = async (
  data: Partial<Category>,
  id: number
): Promise<Category> => {
  console.log(`Updating category with id: ${id}`);
  return (await updateCategory(data, { id })) as Category;
};

// Delete a category
export const removeCategory = async (
  id: number
): Promise<{ success: boolean; message: string }> => {
  console.log(`Deleting category with id: ${id}`);
  try {
    const result = await deleteCategory({ id });
    const res = JSON.parse(JSON.stringify(result));
    // console.log(res);

    if (res.affectedRows == 0) {
      return { success: false, message: "Category does not exists!" };
    } else {
      return { success: true, message: "Category successfully deleted" };
    }
  } catch {
    return { success: false, message: "Category failed to be deleted!" };
  }
};
