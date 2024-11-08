"use server";

// src/app/actions/fetchOrders.ts
import { cookies } from "next/headers";
import { Order, OrderSchema, User } from "@/types";
import {
  createOrder as dbCreateOrder,
  getOrder,
  updateOrder as dbUpdateOrder,
  deleteOrder as dbDeleteOrder,
} from "@/actions/cruds/orders";

// Fetch all orders for the authenticated user
import { getRecordCount, getPaginatedRecords } from "@/actions/db/crud";

// Fetch all orders for the authenticated user
export const fetchUserOrders = async ({
  page = 1,
}: {
  page?: number;
}): Promise<{ orders: Order[]; totalResults: number }> => {
  const userCookie = (await cookies()).get("user");
  if (!userCookie) {
    console.log("No user authenticated.");
    return { orders: [], totalResults: 0 };
  }

  const user = JSON.parse(userCookie.value);
  const userId = user.id;
  const isAdmin = user.isAdmin;
  const limit = 10; // Max items per page
  const offset = (page - 1) * limit;

  console.log(`Fetching all orders for user ID: ${userId}, Page: ${page}`);

  // Count all orders based on the user ID
  const totalResults = await getRecordCount(
    "orders",
    isAdmin ? {} : { customerId: userId, finalTrashed: false }
  );

  // Fetch paginated orders based on the user role and status
  const rawOrders = await getPaginatedRecords(
    "orders",
    isAdmin ? {} : { customerId: userId, finalTrashed: false },
    limit,
    offset
  );
  const orders = rawOrders.map((order) =>
    OrderSchema.partial().parse(order)
  ) as Order[];

  return { orders, totalResults };
};

// Fetch order by ID for the authenticated user
export const fetchUserOrderById = async (
  id: number
): Promise<Order | undefined> => {
  const userCookie = (await cookies()).get("user");
  if (!userCookie) {
    console.log("No user authenticated.");
    return undefined;
  }

  const user: Partial<User> = JSON.parse(userCookie.value);
  const userId = user.id;
  const isAdmin = user.isAdmin;
  console.log(`Fetching order by ID: ${id} for user ID: ${userId}`);

  // Fetch the order and validate it
  const rawOrder = await getOrder({ id, customerId: userId });
  if (!rawOrder) return undefined;

  const order = OrderSchema.partial().parse(rawOrder);

  // Return the order if the user is an admin or if the order is not finalTrashed
  return isAdmin || (order && !order.finalTrashed)
    ? (order as Order)
    : undefined;
};

// Create a new order for the authenticated user
export const createOrder = async (order: Order): Promise<Order> => {
  const userCookie = (await cookies()).get("user");
  if (!userCookie) {
    throw new Error("User not authenticated");
  }

  const userId = JSON.parse(userCookie.value).id;
  console.log(
    `Creating new order for customer: ${order.customerName} for user ID: ${userId}`
  );

  // Attach user ID to the order
  order.customerId = userId;

  // Validate order before creation
  const validOrder = OrderSchema.parse(order);
  return (await dbCreateOrder(validOrder)) as Order;
};

// Update an existing order for the authenticated user
export const updateOrder = async (order: Order): Promise<Order> => {
  const userCookie = (await cookies()).get("user");
  if (!userCookie) {
    throw new Error("User not authenticated");
  }

  const userId = JSON.parse(userCookie.value).id;
  console.log(`Updating order ID: ${order.id} for user ID: ${userId}`);

  if (order.customerId !== userId) {
    throw new Error("You do not have permission to update this order");
  }

  // Validate the updated order before saving
  const validOrder = OrderSchema.parse(order);
  return (await dbUpdateOrder(validOrder, {
    id: order.id,
    customerId: userId,
  })) as Order;
};

// Delete an order for the authenticated user
export const deleteOrder = async (id: number): Promise<void> => {
  const userCookie = (await cookies()).get("user");
  if (!userCookie) {
    throw new Error("User not authenticated");
  }

  const user = JSON.parse(userCookie.value);
  const userId = user.id;
  const isAdmin = user.isAdmin;

  console.log(
    `Attempting to delete order with id: ${id} for user ID: ${userId}`
  );

  // If the user is an admin, delete the order permanently
  if (isAdmin) {
    console.log(`Admin user deleting order with id: ${id}`);
    await dbDeleteOrder({ id });
    return;
  }

  // For non-admin users, move the order to trash
  const rawOrder = await getOrder({ id, customerId: userId });
  const order = OrderSchema.partial().parse(rawOrder);

  if (!order || order.finalTrashed) {
    throw new Error("You do not have permission to trash this order");
  }

  // Update the order's trashed status
  await dbUpdateOrder({ trashed: true }, { id, customerId: userId });
  console.log(`Order with id: ${id} moved to trash for user ID: ${userId}`);
};

// New function to fetch all orders for admin users with pagination and sorting by user ID
export const fetchAllOrders = async ({
  page = 1,
}: {
  page?: number;
}): Promise<{ orders: Order[]; totalResults: number }> => {
  const userCookie = (await cookies()).get("user");
  if (!userCookie) {
    throw new Error("No user authenticated.");
  }

  const user = JSON.parse(userCookie.value);
  const isAdmin = user.isAdmin;
  if (!isAdmin) {
    throw new Error("Access denied. Only admins can fetch all orders.");
  }

  const limit = 10; // Max items per page
  const offset = (page - 1) * limit;

  console.log(`Fetching all orders, Page: ${page}`);

  // Count all orders
  const totalResults = await getRecordCount("orders", {});

  // Fetch paginated orders sorted by customerId
  const rawOrders = await getPaginatedRecords(
    "orders",
    {},
    limit,
    offset,
    "customerId" // Sorting by user ID
  );

  const orders = rawOrders.map((order) =>
    OrderSchema.partial().parse(order)
  ) as Order[];

  return { orders, totalResults };
};
