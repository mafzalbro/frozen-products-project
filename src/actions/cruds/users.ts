import {
  createRecord,
  getRecord,
  updateRecord,
  deleteRecord,
  getPaginatedRecords,
  getRecordCount,
} from "@/actions/db/crud";
import { User } from "@/types";

// Type definition for the options in getAllUsers
interface GetAllUsersOptions {
  page?: number;
  limit?: number;
  searchQuery?: string;
  filters?: Record<string, unknown>;
  sortBy?: string[];
  sortDirection?: "ASC" | "DESC";
  returnTotalCount?: boolean;
}

type GetAllUsersResponse = {
  total: number | undefined;
  totalPages: number | undefined;
  currentPage: number | undefined;
  users: User[];
};
// Function to get all users with pagination, search, sort, and filter
export async function getAllUsers({
  page = 1,
  limit = 10,
  searchQuery = "",
  filters = {},
  sortBy = ["id"], // Default sort by 'id'
  sortDirection = "ASC", // Default sorting order
  returnTotalCount = true, // Option to return total count
}: GetAllUsersOptions): Promise<GetAllUsersResponse> {
  const offset = (page - 1) * limit;

  // Build the where clause for the search and filters
  const whereClause: string[] = [];
  const searchConditions: (string | unknown)[] = []; // Allow any type for search conditions

  if (searchQuery) {
    whereClause.push(`(username LIKE ? OR email LIKE ? OR fullName LIKE ?)`);
    const searchValue = `%${searchQuery}%`;
    searchConditions.push(searchValue, searchValue, searchValue);
  }

  // Adding additional filters to the where clause
  for (const [key, value] of Object.entries(filters)) {
    if (typeof value === "string") {
      whereClause.push(`${key} = ?`);
      searchConditions.push(value);
    } else {
      // Handle other types as necessary, you may add more cases if needed
      throw new Error(`Unsupported filter type for ${key}`);
    }
  }

  // Combine the where clause into a single string
  const whereClauseString = whereClause.length
    ? `WHERE ${whereClause.join(" AND ")}`
    : {};

  // Get the total count of users that match the search and filters if required
  const totalCount = returnTotalCount
    ? await getRecordCount("users", whereClauseString)
    : 0;

  // Get the paginated records of users
  const users = await getPaginatedRecords(
    "users",
    whereClauseString,
    limit,
    offset,
    sortBy.join(", "), // Join sorting fields
    sortDirection
  );

  return {
    total: returnTotalCount ? totalCount : undefined,
    users: JSON.parse(JSON.stringify(users)),
    currentPage: page,
    totalPages: returnTotalCount ? Math.ceil(totalCount / limit) : undefined,
  };
}

// Create a new user
export async function createUser(data: Partial<User>) {
  try {
    return await createRecord("users", data);
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("User creation failed");
  }
}

// Get a user by specified criteria
export async function getUser(where: Partial<User>): Promise<User | null> {
  try {
    const users = await getRecord("users", where);
    return users.length > 0 ? (users[0] as User) : null; // Ensure to cast the result to User
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("User retrieval failed");
  }
}

// Update an existing user
export async function updateUser(data: Partial<User>, where: Partial<User>) {
  try {
    return await updateRecord("users", data, where);
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("User update failed");
  }
}

// Delete a user by specified criteria
export async function deleteUser(where: Partial<User>) {
  try {
    return await deleteRecord("users", where);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("User deletion failed");
  }
}
