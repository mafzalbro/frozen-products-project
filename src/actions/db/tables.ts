// src/utils/tables.ts
import { query } from "./connect";

// Create tables if they don't exist
export async function createUsersTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) UNIQUE,
      username VARCHAR(50) UNIQUE,
      password VARCHAR(255),
      fullName VARCHAR(100),
      isVerified TINYINT(1) DEFAULT 0,
      isAdmin TINYINT(1) DEFAULT 0,
      phone VARCHAR(15),
      address TEXT,  -- Changed from JSON to TEXT
      favourites TEXT,  -- Changed from JSON to TEXT
      orders TEXT,  -- Changed from JSON to TEXT
      privileges TEXT,
      role ENUM('super_admin', 'admin', 'editor', 'user', 'custom') DEFAULT 'user'  -- Added role column
    )
  `;
  try {
    const data = await query(sql);
    const result = Object(data);
    if (result?.affectedRows) {
      console.log("Users table created successfully.");
    }
  } catch (error) {
    console.error("Error creating users table:", error);
  }
}

export async function createProductsTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS frozen_products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      description TEXT,
      price DECIMAL(10, 2),
      image_url TEXT,
      stock INT,
      slug VARCHAR(100) UNIQUE NOT NULL,
      category VARCHAR(100),
      detailed_images TEXT,  -- stores an array of image URLs
      rating_number DECIMAL(3, 2) DEFAULT 0,  -- average rating (up to 2 decimal places)
      rating_count INT DEFAULT 0,  -- number of ratings
      rating_users TEXT,  -- stores an array of user IDs who rated
      likes_number INT DEFAULT 0,  -- total number of likes
      likes_users TEXT,  -- stores an array of user IDs who liked
      favourites TEXT,  -- stores an array of user IDs who favourite
      favourites_number INT DEFAULT 0,  -- total number of likes
      dislikes_number INT DEFAULT 0,  -- total number of dislikes
      dislikes_users TEXT,  -- stores an array of user IDs who disliked
      comments TEXT,  -- stores an array of comments (as JSON)
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  try {
    const data = await query(sql);
    const result = Object(data);
    if (result?.affectedRows) {
      console.log("Products table created successfully.");
    }
  } catch (error) {
    console.error("Error creating products table:", error);
  }
}

export async function createCategoriesTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(50),
      slug VARCHAR(50) UNIQUE,
      description TEXT,
      image_url TEXT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  try {
    const data = await query(sql);
    const result = Object(data);
    if (result?.affectedRows) {
      console.log("Categories table created successfully.");
    }
  } catch (error) {
    console.error("Error creating categories table:", error);
  }
}

export async function createOrdersTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      customerId INT,
      customerName VARCHAR(100),
      email VARCHAR(255),
      status VARCHAR(50),
      orderItems TEXT,  -- Changed from JSON to TEXT
      totalAmount DECIMAL(10, 2),
      trashed TINYINT(1) DEFAULT 0,
      finalTrashed TINYINT(1) DEFAULT 0,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  try {
    const data = await query(sql);
    const result = Object(data);
    if (result?.affectedRows) {
      console.log("Orders table created successfully.");
    }
  } catch (error) {
    console.error("Error creating orders table:", error);
  }
}
// Function to create the contacts table
export async function createContactsTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS contacts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT,
      name VARCHAR(255),
      email VARCHAR(255) UNIQUE NOT NULL,
      messages JSON NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    const data = await query(sql);
    const result = Object(data);
    if (result?.affectedRows) {
      console.log("Contacts table created successfully.");
    }
  } catch (error) {
    console.error("Error creating contacts table:", error);
  }
}

export async function createNotificationsTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS notifications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT,
      username VARCHAR(255),
      title VARCHAR(255),
      raw_details TEXT,
      type ENUM('added', 'updated', 'deleted'),
      tableName VARCHAR(100),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  try {
    const data = await query(sql);
    const result = Object(data);
    if (result?.affectedRows) {
      console.log("Notifications table created successfully.");
    }
  } catch (error) {
    console.error("Error creating notifications table:", error);
  }
}
