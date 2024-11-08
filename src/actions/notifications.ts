"use server";

import {
  getNotificationsForCurrentUser,
  createNotification,
  removeNotificationById as deleteNotification,
  removeAllNotificationsForCurrentUser,
  getAllNotifications,
  updateNotification,
  removeAllNotifications,
} from "@/actions/cruds/notifications";

import { Notification } from "@/types";

// Fetch notifications for the current user with optional pagination
export const fetchNotificationsForCurrentUser = async ({
  page = 1,
  pageSize = 10,
}: {
  page?: number;
  pageSize?: number;
}): Promise<{
  notifications: Notification[];
  totalResults: number;
  totalPages: number;
}> => {
  const { notifications, totalResults, totalPages } =
    await getNotificationsForCurrentUser(page, pageSize);
  return { notifications, totalResults, totalPages };
};

// Fetch all notifications if the user is admin with optional pagination
export const fetchAllNotifications = async ({
  page = 1,
  pageSize = 10,
}: {
  page?: number;
  pageSize?: number;
}): Promise<{
  notifications: Notification[];
  totalResults: number;
  totalPages: number;
}> => {
  const { notifications, totalResults, totalPages } = await getAllNotifications(
    page,
    pageSize
  );

  return { notifications, totalResults, totalPages };
};

// Create a new notification
export const addNotification = async (
  data: Partial<Notification>
): Promise<Notification> => {
  console.log(`Adding new notification: ${data.title}`);
  return (await createNotification(data)) as Notification;
};

// Update an existing notification
export const modifyNotification = async (
  data: Partial<Notification>,
  id: number
): Promise<Notification> => {
  console.log(`Updating notification with id: ${id}`);
  return (await updateNotification(id, data)) as Notification;
};

// Delete a notification by ID
export const removeNotification = async (
  id: number
): Promise<{ success: boolean; message: string }> => {
  console.log(`Deleting notification with id: ${id}`);
  return await deleteNotification(id);
};

// Remove all notifications for the current user
export const clearAllNotifications = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  console.log(`Removing all notifications for the current user.`);
  return await removeAllNotificationsForCurrentUser();
};

// Remove all notifications (admin only)
export const removeAllAdminNotifications = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  console.log(`Removing all notifications (admin only).`);
  const result = await removeAllNotifications()
  return result;
};
