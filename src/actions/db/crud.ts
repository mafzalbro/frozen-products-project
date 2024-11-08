// src/actions/db/crud.ts
import { query } from "@/actions/db/connect";
import { createNotification } from "@/actions/cruds/notifications";
import { cookies } from "next/headers";

// Generic CRUD functions

// Fetch paginated records with conditions and sorting

// Adjust the `getRecordCount` utility to handle price range filtering
export async function getRecordCount(
  table: string,
  where: Record<string, unknown> = {}
): Promise<number> {
  const whereConditions: string[] = [];
  const values: unknown[] = [];

  // Build the where clause for price range
  if ("minPrice" in where) {
    whereConditions.push(`price >= ?`);
    values.push(where.minPrice);
  }
  if ("maxPrice" in where) {
    whereConditions.push(`price <= ?`);
    values.push(where.maxPrice);
  }

  // Add other conditions to where clause
  for (const key of Object.keys(where)) {
    if (key !== "minPrice" && key !== "maxPrice") {
      whereConditions.push(`${key} = ?`);
      values.push(where[key]);
    }
  }

  const whereClause = whereConditions.length
    ? `WHERE ${whereConditions.join(" AND ")}`
    : "";

  const sql = `SELECT COUNT(*) AS total FROM ${table} ${whereClause}`;
  const result = await query(sql, values);
  return result[0]?.total || 0;
}

// Adjust the `getPaginatedRecords` utility to handle price range filtering
export async function getPaginatedRecords(
  table: string,
  where: Record<string, unknown> = {},
  limit: number = 10,
  offset: number = 0,
  orderBy: string = "id",
  orderDirection: "ASC" | "DESC" = "ASC"
): Promise<unknown[]> {
  const whereConditions: string[] = [];
  const values: unknown[] = [];

  // Build the where clause for price range
  if ("minPrice" in where) {
    whereConditions.push(`price >= ?`);
    values.push(where.minPrice);
  }
  if ("maxPrice" in where) {
    whereConditions.push(`price <= ?`);
    values.push(where.maxPrice);
  }

  // Add other conditions to where clause
  for (const key of Object.keys(where)) {
    if (key !== "minPrice" && key !== "maxPrice") {
      whereConditions.push(`${key} = ?`);
      values.push(where[key]);
    }
  }

  const whereClause = whereConditions.length
    ? `WHERE ${whereConditions.join(" AND ")}`
    : "";

  const sql = `SELECT * FROM ${table} ${whereClause} ORDER BY ${orderBy} ${orderDirection} LIMIT ? OFFSET ?`;
  values.push(limit, offset);

  const records = await query(sql, values);
  return records.map((record) =>
    Object.fromEntries(
      Object.entries(record).map(([key, value]) => [key, parseJSON(value)])
    )
  );
}

// Fetch multiple records by IDs
export async function getRecordsByIds(
  table: string,
  ids: Array<number | string>
): Promise<unknown[]> {
  if (ids.length === 0) {
    throw new Error("IDs array cannot be empty");
  }

  // Create placeholders for each ID to prevent SQL injection
  const placeholders = ids.map(() => "?").join(", ");
  const sql = `SELECT * FROM ${table} WHERE id IN (${placeholders})`;

  const records = await query(sql, ids);
  return records.map((record) =>
    Object.fromEntries(
      Object.entries(record).map(([key, value]) => [key, parseJSON(value)])
    )
  );
}

// Create a new record with stringified JSON values
export async function createRecord(
  table: string,
  data: Record<string, unknown>
): Promise<unknown> {
  const keys = Object.keys(data);
  const values = Object.values(data).map(stringifyJSON); // Stringify JSON-like values

  if (keys.length === 0) throw new Error("Data cannot be empty for insert");

  const sql = `INSERT INTO ${table} (${keys.join(", ")}) VALUES (${keys
    .map(() => "?")
    .join(", ")})`;

  const result = await query(sql, values);

  if (table !== "notifications") {
    const user = (await cookies()).get("user")?.value;

    if (user) {
      const { username, id } = JSON.parse(user);
      // Create a notification for record creation
      await createNotification({
        userId: id,
        username,
        title: `New "${table}" added`,
        type: "added",
        raw_details: JSON.stringify(data),
        tableName: table,
      });
    } else {
      await createNotification({
        title: `New "${table}" added`,
        type: "added",
        raw_details: JSON.stringify(data),
        tableName: table,
      });
    }
  }

  return result;
}

function extractDataUrls(input: string): string[] {
  // Regex pattern to match data URLs
  const dataUrlRegex = /data:image\/[a-zA-Z]+;base64,[A-Za-z0-9+/=]+/g;

  // Find matches
  const matches = input.match(dataUrlRegex);
  return matches || []; // Return matches or an empty array if none found
}

function parseOrExtractDataUrls(value: unknown): unknown {
  if (typeof value === "string") {
    const trimmedValue = value.trim();

    // Extract data URLs from the string
    const urls = extractDataUrls(trimmedValue);

    if (urls.length > 0) {
      return urls; // Return the extracted URLs if found
    }

    // Attempt to parse as JSON if no data URLs were found
    try {
      const parsed = JSON.parse(trimmedValue);
      return Array.isArray(parsed) ? parsed : [parsed]; // Ensure a consistent return type
    } catch (error) {
      console.error("Failed to parse JSON:", error);
      console.error("Error details:", error);
    }
  }

  // If input is not a string or parsing fails, return it as-is
  return value;
}

// Utility to parse JSON strings safely
function parseJSON(value: unknown): unknown {
  if (typeof value === "string") {
    try {
      if (value.includes("data") && value.includes("base64")) {
        return parseOrExtractDataUrls(value);
      }
      return JSON.parse(value);
    } catch {
      return value; // Return the value as-is if it's not valid JSON
    }
  }
  return value;
}

// Fetch records based on conditions and parse JSON fields
export async function getRecord(
  table: string,
  where: Record<string, unknown> = {}
): Promise<unknown[]> {
  const whereClause = Object.keys(where).length
    ? `WHERE ${Object.keys(where)
        .map((key) => `${key} = ?`)
        .join(" AND ")}`
    : "";
  const sql = `SELECT * FROM ${table} ${whereClause}`;

  const records = await query(sql, Object.values(where));

  try {
  } catch (error) {
    console.log(error ? "" : "");
  }

  return records.map((record) =>
    Object.fromEntries(
      Object.entries(record).map(([key, value]) => [key, parseJSON(value)])
    )
  );
}

// Utility to stringify JSON-like data safely
function stringifyJSON(value: unknown): unknown {
  return typeof value === "object" ? JSON.stringify(value) : value;
}

// Update records based on conditions
export async function updateRecord(
  table: string,
  data: Record<string, unknown>,
  where: Record<string, unknown>
): Promise<unknown> {
  if (Object.keys(data).length === 0)
    throw new Error("Data cannot be empty for update");

  const setClause = Object.keys(data)
    .map((key) => `${key} = ?`)
    .join(", ");
  const whereClause = Object.keys(where)
    .map((key) => `${key} = ?`)
    .join(" AND ");
  const sql = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;

  const values = [
    ...Object.values(data).map(stringifyJSON), // Ensure JSON-like values are stringified
    ...Object.values(where),
  ];

  const result = await query(sql, values);

  if (table !== "notifications") {
    const user = (await cookies()).get("user")?.value;
    if (user) {
      const { username, id } = JSON.parse(user);
      await createNotification({
        userId: id,
        username,
        title: `Record in "${table}" updated`,
        type: "updated",
        tableName: table,
        raw_details: JSON.stringify(where),
      });
    } else {
      // Create a notification for record update
      await createNotification({
        title: `Record in "${table}" updated`,
        type: "updated",
        tableName: table,
        raw_details: JSON.stringify(where),
      });
    }
  }

  return result;
}

// Delete records based on conditions
export async function deleteRecord(
  table: string,
  where: Record<string, unknown>
): Promise<unknown> {
  if (Object.keys(where).length === 0)
    throw new Error("Delete requires a condition to prevent full table wipe");

  const whereClause = Object.keys(where)
    .map((key) => `${key} = ?`)
    .join(" AND ");
  const sql = `DELETE FROM ${table} WHERE ${whereClause}`;

  const result = await query(sql, Object.values(where));

  if (table !== "notifications") {
    const user = (await cookies()).get("user")?.value;
    if (user) {
      const { username, id } = JSON.parse(user);

      // Create a notification for record deletion
      await createNotification({
        userId: id,
        username,
        title: `Record in "${table}" deleted`,
        type: "deleted",
        tableName: table,
        raw_details: JSON.stringify(where),
      });
    } else {
      // Create a notification for record deletion
      await createNotification({
        title: `Record in "${table}" deleted`,
        type: "deleted",
        tableName: table,
        raw_details: JSON.stringify(where),
      });
    }
  }

  return result;
}
export async function deleteAllRecords(table: string): Promise<unknown> {
  const user = (await cookies()).get("user")?.value;
  const isAdmin = JSON.parse(user || "")?.isAdmin === 1;

  if (!isAdmin) {
    throw new Error("Unauthorized: Only admins can delete records.");
  }

  const allowedTables = ["notifications"];
  if (!allowedTables.includes(table)) {
    throw new Error("Invalid table name.");
  }

  const sql = `DELETE FROM ${table}`;

  try {
    const result = await query(sql);

    if (table !== "notifications") {
      if (user) {
        const { username, id } = JSON.parse(user);
        await createNotification({
          userId: id,
          username,
          title: `Record in "${table}" deleted`,
          type: "deleted",
          tableName: table,
          raw_details: "",
        });
      } else {
        await createNotification({
          title: `All Records in "${table}" deleted`,
          type: "deleted",
          tableName: table,
          raw_details: "",
        });
      }
    }

    return result;
  } catch (error) {
    console.error("Error deleting records:", error);
    throw new Error("Failed to delete records.");
  }
}
