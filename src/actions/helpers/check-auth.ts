"use server";

import { User } from "@/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { checkPageAccess } from "./check-access";
import { getPathname } from "./get-path";

// Utility function to check if the user is an admin
export async function checkIsAdmin(): Promise<{
  isAuthenticated: boolean;
  userId: string | null;
  status: string;
  role: "user" | "admin" | "super_admin" | "editor" | "custom" | "";
  message: string;
}> {
  const pathname = await getPathname();

  const hasAccess = await checkPageAccess(pathname || "/");

  const userString = (await cookies()).get("user")?.value;

  const user = userString ? JSON.parse(userString) : null;

  const { role, id } = user;

  if (!hasAccess) {
    return {
      isAuthenticated: false,
      role,
      userId: id || null,
      status: "error",
      message: "You have no access.",
    };
  }
  if (user) {
    if (role !== "user") {
      return {
        isAuthenticated: hasAccess,
        role,
        userId: id || null,
        status: "success",
        message: "Admin access granted.",
      };
    }
  }

  const message = "Please log in as an admin.";
  redirect(
    `/login?toastMessage=${encodeURIComponent(message)}&toastType=error`
  );

  return {
    isAuthenticated: false,
    userId: null,
    role: "",
    status: "error",
    message,
  };
}

// Utility function to check if the user is a regular user
export async function checkIsUser(): Promise<{
  isAuthenticated: boolean;
  isAdmin?: boolean;
  userId: string | null;
  user: Partial<User> | null;
  status: string;
  message: string;
}> {
  const userString = (await cookies()).get("user")?.value;
  const user = userString ? JSON.parse(userString) : null;
  if (user) {
    const { isAdmin, role, email, id } = user;
    if (isAdmin) {
      return {
        isAuthenticated: true,
        isAdmin: role === "super_admin",
        userId: id || null,
        user: user || undefined,
        status: "success",
        message: "Welcome, admin user.",
      };
    }
    return {
      isAuthenticated: !!email,
      userId: id || null,
      user: user || undefined,
      status: "success",
      message: "Welcome, regular user.",
    };
  }

  const message = "Please log in as a user.";
  redirect(
    `/login?toastMessage=${encodeURIComponent(message)}&toastType=error`
  );

  return {
    isAuthenticated: false,
    userId: null,
    user: null,
    status: "error",
    message,
  };
}

// Utility function to check if the user is a regular user
export async function checkIsUserFreely(): Promise<{
  isAuthenticated: boolean;
  isAdmin?: boolean;
  userId: string | null;
  user: string | undefined;
  role: "user" | "admin" | "super_admin" | "editor" | "custom" | "";
  status: string;
  message: string;
}> {
  const userString = (await cookies()).get("user")?.value;
  const user = userString ? JSON.parse(userString) : null;
  if (user) {
    const { isAdmin, role, email, id } = user;
    if (isAdmin) {
      return {
        isAuthenticated: true,
        isAdmin: role === "super_admin",
        role,
        userId: id || null,
        user: user || undefined,
        status: "success",
        message: "Welcome, admin user.",
      };
    }
    return {
      isAuthenticated: !!email,
      userId: id || null,
      user: user || undefined,
      role,
      status: "success",
      message: "Welcome, regular user.",
    };
  }

  const message = "Please log in as a user.";
  return {
    isAuthenticated: false,
    userId: null,
    role: "",
    user: undefined,
    status: "error",
    message,
  };
}
