import { Order } from "@/types";
import {
  createRecord,
  getRecord,
  updateRecord,
  deleteRecord,
} from "@/actions/db/crud";
import { createOrdersTable } from "@/actions/db/tables";

await createOrdersTable();

export async function createOrder(data: Partial<Order>) {
  return await createRecord("orders", data);
}

export async function getOrder(where: Partial<Order>) {
  return await getRecord("orders", where);
}

export async function updateOrder(data: Partial<Order>, where: Partial<Order>) {
  return await updateRecord("orders", data, where);
}

export async function deleteOrder(where: Partial<Order>) {
  return await deleteRecord("orders", where);
}
