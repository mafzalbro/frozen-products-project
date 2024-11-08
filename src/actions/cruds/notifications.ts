import { Notification } from "@/types";
import {
  createRecord,
  getPaginatedRecords,
  getRecordCount,
  deleteRecord,
  updateRecord,
  deleteAllRecords, // Import the utility for updating records
} from "@/actions/db/crud";
import { createNotificationsTable } from "@/actions/db/tables";
import { cookies } from "next/headers";
import { checkIsAdmin } from "../helpers/check-auth";

// Ensure the notifications table is created
await createNotificationsTable();

// Create a new notification
export async function createNotification(data: Partial<Notification>) {
  const userJSON = (await cookies()).get("user")?.value;
  let userId;

  // Check if user is authenticated
  if (!userJSON) {
    return;
  } else {
    userId = JSON.parse(userJSON)?.id;
  }

  const notificationData = {
    ...data,
    userId: userId ? userId : "",
  };
  return await createRecord("notifications", notificationData);
}

// Get notifications for the current user with pagination
export async function getNotificationsForCurrentUser(
  page = 1,
  pageSize = 10
): Promise<{
  notifications: Notification[];
  totalResults: number;
  totalPages: number;
}> {
  const userJSON = await (await cookies()).get("user")?.value;
  let userId;

  // Check if user is authenticated
  if (!userJSON) {
    return { notifications: [], totalResults: 0, totalPages: 0 };
  } else {
    userId = JSON.parse(userJSON)?.id;
  }

  const limit = pageSize;
  const offset = (page - 1) * limit;

  const totalResults = await getRecordCount("notifications", { userId });
  const notifications = await getPaginatedRecords(
    "notifications",
    { userId },
    limit,
    offset,
    "createdAt",
    "DESC"
  );

  const totalPages = Math.ceil(totalResults / limit);
  return {
    notifications: JSON.parse(JSON.stringify(notifications)),
    totalResults,
    totalPages,
  };
}

// Get all notifications if the user is admin
export async function getAllNotifications(
  page = 1,
  pageSize = 10
): Promise<{
  notifications: Notification[];
  totalResults: number;
  totalPages: number;
}> {
  const { isAuthenticated } = await checkIsAdmin();

  if (!isAuthenticated) {
    return { notifications: [], totalResults: 0, totalPages: 0 };
  }

  const limit = pageSize;
  const offset = (page - 1) * limit;

  const totalResults = await getRecordCount("notifications");
  const notifications = await getPaginatedRecords(
    "notifications",
    {},
    limit,
    offset,
    "createdAt",
    "DESC"
  );

  const totalPages = Math.ceil(totalResults / limit);
  return {
    notifications: JSON.parse(JSON.stringify(notifications)),
    totalResults,
    totalPages,
  };
}

// Update an existing notification
export async function updateNotification(
  id: number,
  data: Partial<Notification>
): Promise<Notification | null> {
  const userJSON = await (await cookies()).get("user")?.value;

  let userId;

  if (!userJSON) {
    return null;
  } else {
    userId = JSON.parse(userJSON)?.id;
  }

  try {
    // Update the notification
    const result = await updateRecord("notifications", { id, userId }, data);
    return result as Notification;
  } catch (error) {
    console.error("Error updating notification:", error);
    return null;
  }
}

// Delete a single notification by ID
export async function removeNotificationById(
  id: number
): Promise<{ success: boolean; message: string }> {
  const userJSON = await (await cookies()).get("user")?.value;
  let userId;

  if (!userJSON) {
    return { success: false, message: "Unauthorized: User not logged in." };
  } else {
    userId = JSON.parse(userJSON)?.id;
  }

  try {
    // Ensure the notification belongs to the current user
    const result = await deleteRecord("notifications", { id, userId });
    const res = JSON.parse(JSON.stringify(result));

    if (res.affectedRows === 0) {
      return {
        success: false,
        message: "Notification does not exist or unauthorized.",
      };
    } else {
      return { success: true, message: "Notification successfully deleted." };
    }
  } catch (error) {
    console.error("Error deleting notification:", error);
    return { success: false, message: "Failed to delete notification." };
  }
}

// Delete all notifications for the current user
export async function removeAllNotificationsForCurrentUser(): Promise<{
  success: boolean;
  message: string;
}> {
  const userJSON = await (await cookies()).get("user")?.value;
  let userId;

  if (!userJSON) {
    return { success: false, message: "Unauthorized: User not logged in." };
  } else {
    userId = JSON.parse(userJSON)?.id;
  }

  try {
    await deleteRecord("notifications", { userId });
    return {
      success: true,
      message: "All notifications for the user deleted successfully.",
    };
  } catch (error) {
    console.error("Error deleting user notifications:", error);
    return { success: false, message: "Failed to delete notifications." };
  }
}

// Delete all notifications (admin only)
export async function removeAllNotifications(): Promise<{
  success: boolean;
  message: string;
}> {
  const userJSON = await (await cookies()).get("user")?.value;
  const isAdmin = userJSON && JSON.parse(userJSON)?.role === "super_admin";

  const {} = await checkIsAdmin()
  if (!isAdmin) {
    return {
      success: false,
      message: "Unauthorized: Only admin can delete all notifications.",
    };
  }

  try {
    await deleteAllRecords("notifications");
    return {
      success: true,
      message: "All notifications deleted successfully.",
    };
  } catch (error) {
    console.error("Error deleting all notifications:", error);
    return { success: false, message: "Failed to delete notifications." };
  }
}
