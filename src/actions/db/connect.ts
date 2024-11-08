import type {
  Connection,
  RowDataPacket,
  // ResultSetHeader,
} from "mysql2/promise";
import mysql from "mysql2/promise";
import { config } from "dotenv";

config();

// Function to create a new database connection
export async function getConnection(): Promise<Connection> {
  try {
    return await mysql.createConnection({
      host: process.env.DB_HOST as string,
      user: process.env.DB_USER as string,
      password: process.env.DB_PASSWORD as string,
      database: process.env.DB_NAME as string,
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    throw error; // Rethrow the error after logging it
  }
}

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    console.log("Connected to the database successfully!");
    await connection.end();
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}

testConnection();

// Function to execute a query
export async function query<T extends RowDataPacket[]>(
  sql: string,
  params: unknown[] = []
) {
  const connection = await getConnection();
  try {
    // Execute the query and get results
    const [results] = await connection.execute<T>(sql, params);

    // Ensure correct types
    return results;
  } finally {
    await connection.end(); // Ensure the connection is closed after query execution
  }
}
