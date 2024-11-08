"use server";

import { getSidebarItems } from "@/store/sidebars-items";
import { checkIsUser } from "./check-auth";
import { notFound, redirect } from "next/navigation";

export const checkPageAccess = async (pathname: string) => {
  const { user, isAuthenticated } = await checkIsUser();

  // Deny access if not authenticated
  if (!isAuthenticated) {
    return false;
  }

  // Check access based on role
  switch (user?.role) {
    case "custom":
      // Custom role: check if the pathname is in user's privileges
      return user?.privileges?.includes(pathname) ?? false;

    case "super_admin":
    case "admin":
    case "editor":
      // For predefined roles, fetch sidebar items once based on role
      const sidebarItems = await getSidebarItems(user.role);
      return sidebarItems.some((item) => item.url === pathname);

    case "user":
      // Standard user has no access
      return false;

    default:
      // Default case for undefined or unhandled roles
      return false;
  }
};

export const restrictPageAccess = async (pathname: string) => {
  const hasAccess = await checkPageAccess(pathname);

  // Redirect based on access rights
  if (!hasAccess) {
    redirect("/admin");
    notFound();
  }
};
