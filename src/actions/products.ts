"use server";

import {
  // getRecordCount,
  // getPaginatedRecords,
  createRecord,
  updateRecord,
  deleteRecord,
  getRecord,
} from "@/actions/db/crud";
import { FrozenProduct } from "@/types";
import { createProductsTable } from "./db/tables";
import { checkIsAdmin, checkIsUser } from "@/actions/helpers/check-auth";
import { revalidatePath } from "next/cache";
import { query } from "./db/connect";
import { RowDataPacket } from "mysql2";
import { reduceImageQualityAndCrop } from "@/utils/image-utils";

createProductsTable();

interface FetchProductParams {
  page?: string;
  pageSize?: string;
  searchQuery?: string;
  category?: string;
  maxPrice?: number | string;
  minPrice?: number | string;
}
// Fetch products with pagination, search, and filtering
export const fetchProducts = async ({
  page = "1",
  pageSize = "8",
  searchQuery = "",
  category = "",
  minPrice = 0,
  maxPrice = 0,
}: FetchProductParams): Promise<{
  products: FrozenProduct[];
  totalPages: number;
}> => {
  const pageNo = parseInt(page);
  const size = parseInt(pageSize);
  const offset = (pageNo - 1) * size;

  // Construct SQL WHERE conditions
  let whereClause = "WHERE 1=1";
  if (category && category !== "all")
    whereClause += ` AND category = '${category}'`;
  if (minPrice) whereClause += ` AND price >= ${minPrice}`;
  if (maxPrice) whereClause += ` AND price <= ${maxPrice}`;
  if (searchQuery) whereClause += ` AND name LIKE '%${searchQuery}%'`;

  // Get total count and calculate total pages
  const countResult = (await query(
    `SELECT COUNT(*) as count FROM frozen_products ${whereClause}`
  )) as RowDataPacket[];
  const totalRecords = countResult[0]?.count as number;
  const totalPages = Math.ceil(totalRecords / size);

  // Fetch paginated product records, sorted by createdAt
  const products = (await query(
    `SELECT * FROM frozen_products ${whereClause} ORDER BY createdAt DESC LIMIT ${size} OFFSET ${offset}`
  )) as FrozenProduct[];

  return { products, totalPages };
};

// Fetch product by slug
export const fetchProductBySlug = async (
  slug: string
): Promise<FrozenProduct | null> => {
  const products = await getRecord("frozen_products", { slug });
  // console.log(products, products[0]);

  return products.length > 0 ? (products[0] as FrozenProduct) : null;
};

// Fetch product by id
export const fetchProductById = async (
  id: string
): Promise<FrozenProduct | null> => {
  const products = await getRecord("frozen_products", { id });
  return products.length > 0 ? (products[0] as FrozenProduct) : null;
};

// Create a new frozen product
export const createProduct = async (
  product: Partial<FrozenProduct>,
  mainImageFile?: File | string, // Allow either File or URL for the main image
  detailedImagesFiles?: (File | string)[] // Allow either File or URL for detailed images
): Promise<FrozenProduct> => {
  const { isAuthenticated } = await checkIsAdmin();
  if (!isAuthenticated) throw new Error("Only admins can create products.");

  // Process the main image if provided
  if (mainImageFile) {
    const mainImageDataUrl = await reduceImageQualityAndCrop(mainImageFile);
    product.image_url = mainImageDataUrl;
  }

  // Process detailed images if provided
  if (detailedImagesFiles) {
    const detailedImagesPromises = detailedImagesFiles.map((file) =>
      reduceImageQualityAndCrop(file)
    );
    const detailedImagesDataUrls = await Promise.all(detailedImagesPromises);
    product.detailed_images = detailedImagesDataUrls;
  }

  const newProduct = await createRecord("frozen_products", product);
  return newProduct as FrozenProduct;
};

// Update an existing frozen product
export const updateProduct = async (
  product: Partial<FrozenProduct>
): Promise<FrozenProduct> => {
  const { isAuthenticated } = await checkIsAdmin();
  if (!isAuthenticated) throw new Error("Only admins can update products.");

  const { id, ...data } = product;
  if (!id) throw new Error("Product ID is required for update");
  await updateRecord("frozen_products", data, { id });
  return { id, ...data } as FrozenProduct;
};

// Delete a frozen product by ID
export const deleteProduct = async (
  id: number
): Promise<{ message: string; success: boolean }> => {
  const { isAuthenticated } = await checkIsAdmin();
  if (!isAuthenticated) throw new Error("Only admins can delete products.");

  try {
    const result = await deleteRecord("frozen_products", { id });
    const res = JSON.parse(JSON.stringify(result));
    // console.log({ res });

    if (res.affectedRows == 0) {
      return { success: false, message: "Product does not exists!" };
    } else {
      return { success: true, message: "Product successfully deleted" };
    }
  } catch {
    return { success: false, message: "Product failed to be deleted!" };
  }
};

// Give rating to a product
export const giveRating = async (
  productId: number,
  rating: number
): Promise<{
  rating_count: number;
  rating_number: number;
  isRated: boolean;
}> => {
  const { isAuthenticated, userId } = await checkIsUser();
  if (!isAuthenticated || !userId)
    throw new Error("User must be logged in to give ratings");
  const parsedUserId = JSON.parse(userId);

  const product = await fetchProductById(productId.toString());
  if (!product) throw new Error("Product not found");

  // Check if the user has already rated the product
  const ratingUsers = product.rating_users || [];
  if (ratingUsers.includes(parsedUserId)) {
    throw new Error("User has already rated this product");
  }

  // Add the user's ID to rating_users and update rating count and average
  ratingUsers.push(parsedUserId);
  product.rating_count = (product.rating_count || 0) + 1;
  product.rating_number =
    ((product.rating_number || 0) * (product.rating_count - 1) + rating) /
    product.rating_count;

  await updateRecord(
    "frozen_products",
    {
      rating_count: product.rating_count,
      rating_number: product.rating_number,
      rating_users: JSON.stringify(ratingUsers),
    },
    { id: productId }
  );

  return {
    rating_count: product.rating_count,
    rating_number: product.rating_number,
    isRated: ratingUsers.includes(parsedUserId),
  };
};

// Add or remove a like
export const toggleLike = async (productId: number): Promise<void> => {
  const { isAuthenticated, userId } = await checkIsUser();
  if (!isAuthenticated || !userId)
    throw new Error("User must be logged in to like products");

  const product = await fetchProductById(productId.toString());
  if (!product) throw new Error("Product not found");

  const parsedUserId = parseInt(userId);

  const likes: number[] = product.likes_users || [];
  const index = likes.indexOf(parsedUserId);

  if (index > -1) {
    // User is already in likes, remove them
    likes.splice(index, 1);
    product.likes_number = (product.likes_number || 0) - 1; // Decrement likes count
  } else {
    // User is not in likes, add them
    likes.push(parsedUserId);
    product.likes_number = (product.likes_number || 0) + 1; // Increment likes count
  }

  await updateRecord(
    "frozen_products",
    {
      likes_users: JSON.stringify(likes),
      likes_number: product.likes_number,
    },
    { id: productId }
  );
};

// Type for comments in FrozenProduct
// interface Comment {
//   userId: number;
//   isAdmin?: number;
//   comment: string;
//   createdAt: string;
//   user?: Partial<User> | undefined;
// }

// Add a comment to a product
export const addComment = async (
  productId: number,
  comment: string
): Promise<void> => {
  const { isAuthenticated, userId, user } = await checkIsUser();
  if (!isAuthenticated || !userId)
    throw new Error("User must be logged in to comment on products");

  const parsedUserId = parseInt(userId);
  const product: FrozenProduct | null = await fetchProductById(
    productId.toString()
  );
  if (!product) throw new Error("Product not found");

  const comments = product.comments || [];
  comments.push({
    userId: parsedUserId,
    user: JSON.parse(JSON.stringify(user)) || undefined,
    isAdmin: user?.isAdmin ? 1 : 0,
    comment,
    createdAt: new Date().toISOString(),
  });

  await updateRecord(
    "frozen_products",
    {
      comments: JSON.stringify(comments),
    },
    { id: productId }
  );

  // Revalidate the product page to reflect the new comment
  revalidatePath(`/products/${product.slug}`);
};

// Add or remove a product from favorites
export const toggleFavorite = async (productId: number): Promise<void> => {
  const { isAuthenticated, userId, user } = await checkIsUser();
  if (!isAuthenticated || !userId)
    throw new Error("User must be logged in to favorite products");

  const parsedUser = user || null;
  const parsedUserId = userId ? parseInt(userId) : null;

  if (!parsedUser || parsedUserId === null)
    throw new Error("Invalid user data");

  // Fetch product details to add to user's favorites
  const product: FrozenProduct | null = await fetchProductById(
    productId.toString()
  );
  if (!product) throw new Error("Product not found");

  const productDetails = {
    id: product.id,
    name: product.name,
    slug: product.slug,
  };

  // Check if product is already favorited by the user
  const userFavorites: { id: number; name: string; slug: string }[] =
    parsedUser.favourites || [];
  const userFavoriteIndex = userFavorites.findIndex(
    (fav) => fav.id === productDetails.id
  );

  if (userFavoriteIndex > -1) {
    // Product is already in user's favorites, remove it
    userFavorites.splice(userFavoriteIndex, 1);
  } else {
    // Product is not in user's favorites, add it
    userFavorites.push(productDetails);
  }

  // Update the user's favorites in the database
  await updateRecord(
    "users",
    { favourites: JSON.stringify(userFavorites) },
    { id: parsedUserId }
  );

  // Update the product's favorites to include or remove the user ID
  const productFavorites: number[] = product.favourites || [];
  const productFavoriteIndex = productFavorites.indexOf(parsedUserId);

  if (productFavoriteIndex > -1) {
    // User is already in product's favorites, remove them
    productFavorites.splice(productFavoriteIndex, 1);
  } else {
    // User is not in product's favorites, add them
    productFavorites.push(parsedUserId);
  }

  // Update the product's favorites in the database
  await updateRecord(
    "frozen_products",
    {
      favourites: JSON.stringify(productFavorites),
      favourites_number: productFavorites.length,
    },
    { id: productId }
  );
};
