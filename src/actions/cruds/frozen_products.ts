import { FrozenProduct } from "@/types";
import {
  createRecord,
  getRecord,
  updateRecord,
  deleteRecord,
} from "@/actions/db/crud";
import { createProductsTable } from "@/actions/db/tables";

await createProductsTable();

export async function createProduct(data: Partial<FrozenProduct>) {
  return await createRecord("frozen_products", data);
}

export async function getProduct(where: Partial<FrozenProduct>) {
  return await getRecord("frozen_products", where);
}

export async function updateProduct(
  data: Partial<FrozenProduct>,
  where: Partial<FrozenProduct>
) {
  return await updateRecord("frozen_products", data, where);
}

export async function deleteProduct(where: Partial<FrozenProduct>) {
  return await deleteRecord("frozen_products", where);
}
