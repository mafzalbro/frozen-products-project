"server-only";

import {
  FiPackage,
  FiUsers,
  FiClipboard,
  FiMessageSquare,
  FiBell,
  FiEdit2,
  FiHome,
  FiLock,
  FiUser,
  FiSettings,
  FiHeart,
  FiShoppingBag,
} from "react-icons/fi";
import {
  Home,
  Lock,
  User,
  Settings,
  Heart,
  ShoppingBasketIcon,
} from "lucide-react";
import { MdAccountBox } from "react-icons/md";

const sidebarItems = {
  super_admin: [
    { title: "Home", url: "/admin", icon: FiHome },
    {
      title: "Notifications",
      url: "/admin/manage-notifications",
      icon: FiBell,
    },
    { title: "Products", url: "/admin/manage-products", icon: FiPackage },
    { title: "Categories", url: "/admin/manage-categories", icon: FiClipboard },
    { title: "Users", url: "/admin/manage-users", icon: FiUsers },
    { title: "Orders", url: "/admin/manage-orders", icon: FiClipboard },
    { title: "Contacts", url: "/admin/manage-contacts", icon: FiMessageSquare },
    { title: "Edit Frontend", url: "/admin/manage-ui-settings", icon: FiEdit2 },
    { title: "Accounts", url: "/admin/manage-accounts", icon: MdAccountBox },
  ],
  admin: [
    { title: "Home", url: "/admin", icon: FiHome },
    {
      title: "Notifications",
      url: "/admin/manage-notifications",
      icon: FiBell,
    },
    { title: "Products", url: "/admin/manage-products", icon: FiPackage },
    { title: "Categories", url: "/admin/manage-categories", icon: FiClipboard },
    { title: "Users", url: "/admin/manage-users", icon: FiUsers },
    { title: "Orders", url: "/admin/manage-orders", icon: FiClipboard },
    { title: "Contacts", url: "/admin/manage-contacts", icon: FiMessageSquare },
    { title: "Edit Frontend", url: "/admin/manage-ui-settings", icon: FiEdit2 },
  ],
  editor: [
    { title: "Home", url: "/admin", icon: FiHome },
    { title: "Products", url: "/admin/manage-products", icon: FiPackage },
    { title: "Categories", url: "/admin/manage-categories", icon: FiClipboard },
  ],
  user: [
    { title: "Home", url: "/user", icon: FiHome },
    { title: "Your Orders", url: "/user/orders", icon: FiShoppingBag },
    { title: "Change Password", url: "/user/change-password", icon: FiLock },
    { title: "Update Account", url: "/user/update-account", icon: FiUser },
    { title: "Settings", url: "/user/settings", icon: FiSettings },
    {
      title: "Favourite Products",
      url: "/user/favourite-products",
      icon: FiHeart,
    },
    { title: "Contacts", url: "/user/contacts", icon: FiUser },
  ],
  custom: [],
};

const profileItems = {
  super_admin: [
    {
      title: "Notifications",
      url: "/admin/manage-notifications",
      icon: FiBell,
      bgColor: "bg-blue-100 dark:bg-blue-900",
      textColor: "text-blue-900 dark:text-blue-100",
    },
    {
      title: "Products",
      url: "/admin/manage-products",
      icon: FiPackage,
      bgColor: "bg-purple-100 dark:bg-purple-900",
      textColor: "text-purple-900 dark:text-purple-100",
    },
    {
      title: "Categories",
      url: "/admin/manage-categories",
      icon: FiClipboard,
      bgColor: "bg-yellow-100 dark:bg-yellow-800",
      textColor: "text-yellow-900 dark:text-yellow-200",
    },
    {
      title: "Users",
      url: "/admin/manage-users",
      icon: FiUsers,
      bgColor: "bg-green-100 dark:bg-green-900",
      textColor: "text-green-900 dark:text-green-100",
    },
    {
      title: "Orders",
      url: "/admin/manage-orders",
      icon: FiClipboard,
      bgColor: "bg-red-100 dark:bg-red-900",
      textColor: "text-red-900 dark:text-red-100",
    },
    {
      title: "Contacts",
      url: "/admin/manage-contacts",
      icon: FiMessageSquare,
      bgColor: "bg-teal-100 dark:bg-teal-900",
      textColor: "text-teal-900 dark:text-teal-100",
    },
    {
      title: "Edit Frontend",
      url: "/admin/manage-ui-settings",
      icon: FiEdit2,
      bgColor: "bg-indigo-100 dark:bg-indigo-900",
      textColor: "text-indigo-900 dark:text-indigo-100",
    },
    {
      title: "Accounts",
      url: "/admin/manage-accounts",
      icon: MdAccountBox,
      bgColor: "bg-orange-100 dark:bg-orange-900",
      textColor: "text-orange-900 dark:text-orange-100",
    },
  ],
  admin: [
    {
      title: "Notifications",
      url: "/admin/manage-notifications",
      icon: FiBell,
      bgColor: "bg-blue-100 dark:bg-blue-900",
      textColor: "text-blue-900 dark:text-blue-100",
    },
    {
      title: "Products",
      url: "/admin/manage-products",
      icon: FiPackage,
      bgColor: "bg-purple-100 dark:bg-purple-900",
      textColor: "text-purple-900 dark:text-purple-100",
    },
    {
      title: "Categories",
      url: "/admin/manage-categories",
      icon: FiClipboard,
      bgColor: "bg-yellow-100 dark:bg-yellow-800",
      textColor: "text-yellow-900 dark:text-yellow-200",
    },
    {
      title: "Users",
      url: "/admin/manage-users",
      icon: FiUsers,
      bgColor: "bg-green-100 dark:bg-green-900",
      textColor: "text-green-900 dark:text-green-100",
    },
    {
      title: "Orders",
      url: "/admin/manage-orders",
      icon: FiClipboard,
      bgColor: "bg-red-100 dark:bg-red-900",
      textColor: "text-red-900 dark:text-red-100",
    },
    {
      title: "Contacts",
      url: "/admin/manage-contacts",
      icon: FiMessageSquare,
      bgColor: "bg-teal-100 dark:bg-teal-900",
      textColor: "text-teal-900 dark:text-teal-100",
    },
    {
      title: "Edit Frontend",
      url: "/admin/manage-ui-settings",
      icon: FiEdit2,
      bgColor: "bg-indigo-100 dark:bg-indigo-900",
      textColor: "text-indigo-900 dark:text-indigo-100",
    },
  ],
  editor: [
    {
      title: "Products",
      url: "/admin/manage-products",
      icon: FiPackage,
      bgColor: "bg-purple-100 dark:bg-purple-900",
      textColor: "text-purple-900 dark:text-purple-100",
    },
    {
      title: "Categories",
      url: "/admin/manage-categories",
      icon: FiClipboard,
      bgColor: "bg-yellow-100 dark:bg-yellow-800",
      textColor: "text-yellow-900 dark:text-yellow-200",
    },
  ],
  user: [
    {
      title: "Home",
      url: "/user",
      icon: Home,
      bgColor: "bg-blue-100 dark:bg-blue-900",
      textColor: "text-blue-900 dark:text-blue-100",
    },
    {
      title: "Your Orders",
      url: "/user/orders",
      icon: ShoppingBasketIcon,
      bgColor: "bg-purple-100 dark:bg-purple-900",
      textColor: "text-purple-900 dark:text-purple-100",
    },
    {
      title: "Change Password",
      url: "/user/change-password",
      icon: Lock,
      bgColor: "bg-yellow-100 dark:bg-yellow-800",
      textColor: "text-yellow-900 dark:text-yellow-200",
    },
    {
      title: "Update Account",
      url: "/user/update-account",
      icon: User,
      bgColor: "bg-green-100 dark:bg-green-900",
      textColor: "text-green-900 dark:text-green-100",
    },
    {
      title: "Settings",
      url: "/user/settings",
      icon: Settings,
      bgColor: "bg-red-100 dark:bg-red-900",
      textColor: "text-red-900 dark:text-red-100",
    },
    {
      title: "Favourite Products",
      url: "/user/favourite-products",
      icon: Heart,
      bgColor: "bg-teal-100 dark:bg-teal-900",
      textColor: "text-teal-900 dark:text-teal-100",
    },
  ],
  custom: [],
};
export const getSidebarItems = async (
  role: "super_admin" | "admin" | "editor" | "user" | "custom",
  privileges?: string[]
) => {
  if (role === "custom" && privileges?.length !== 0) {
    // Filter sidebar items based on provided privileges
    return sidebarItems["super_admin"].filter((item) =>
      privileges?.includes(item.url)
    );
  }
  return sidebarItems[role] || sidebarItems["user"];
};

export const getProfileItems = async (
  role: "super_admin" | "admin" | "editor" | "user" | "custom",
  privileges?: string[]
) => {
  if (role === "custom" && privileges?.length !== 0) {
    // Filter profile items based on provided privileges
    return profileItems["super_admin"].filter((item) =>
      privileges?.includes(item.url)
    );
  }
  return profileItems[role] || profileItems["user"];
};
