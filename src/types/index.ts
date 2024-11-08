// import { z } from "zod";
// export interface User {
//   id: number;
//   email: string;
//   username: string;
//   password: string;
//   fullName: string;
//   phone: string;
//   isVerified: boolean;
//   isAdmin: boolean;
//   address: {
//     street: string;
//     city: string;
//     state: string;
//     zip: string;
//   };
//   favourites: number[];
// }

// export interface FrozenProduct {
//   id?: number;
//   name: string;
//   description: string;
//   price?: number;
//   image_url?: string;
//   stock: number;
//   slug?: string;
//   category?: string;
//   createdAt?: string;
// }

// export interface Category {
//   id: number;
//   name: string;
//   slug: string;
//   description: string;
// }

// // export interface OrderItem {
// //   productId: number;
// //   quantity: number;
// // }

// export interface Order {
//   id: number;
//   customerId: number;
//   customerName: string;
//   email: string;
//   status: string;
//   orderItems: Record<string, any>[];
//   totalAmount: number;
//   trashed?: boolean;
//   createdAt?: string;
//   finalTrashed?: boolean;
// }

// // Define the Zod schema for the Order type
// export const OrderSchema = z.object({
//   id: z.number(),
//   customerId: z.number(),
//   customerName: z.string(),
//   email: z.string().email(),
//   status: z.string(),
//   orderItems: z.array(z.record(z.string(), z.any())), // Example structure for order items
//   totalAmount: z.number(),
//   createdAt: z.string().optional(),
//   trashed: z.boolean().optional(),
//   finalTrashed: z.boolean().optional(),
// });

// // Type inference from the Zod schema
// export type Order = z.infer<typeof OrderSchema>;

// export interface CheckoutInput {
//   name: string;
//   email: string;
//   phone: string;
//   otp?: string;
//   address: string;
//   cart: Array<{ id: number; name: string; price: number; quantity: number }>;
//   paymentMethod: string;
//   accountNumber: string;
// }

import { z } from "zod";

// User Schema
export const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  username: z.string(),
  password: z.string(),
  fullName: z.string(),
  phone: z.string(),
  isVerified: z.boolean(),
  isAdmin: z.boolean(),
  role: z
    .enum(["user", "admin", "editor", "super_admin", "custom"])
    .default("user"),
  privileges: z.array(z.string()).optional(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
  }),
  favourites: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
        slug: z.string(),
      })
    )
    .optional(),
  orders: z.array(z.number()),
  image_url: z.string().url().optional(),
});

export type User = z.infer<typeof UserSchema>;

// Define the FrozenProduct schema
export const FrozenProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  image_url: z.string().url().optional(),
  detailed_images: z.array(z.string().url()).optional(),
  stock: z.number(),
  slug: z.string(),
  category: z.string(),
  rating_number: z.number().optional(), // Average rating
  rating_count: z.number().optional(), // Count of ratings
  rating_users: z.array(z.number()).optional(), // Array of user IDs who rated
  likes_number: z.number().optional(), // Count of likes
  likes_users: z.array(z.number()).optional(), // Array of user IDs who liked
  dislikes_number: z.number().optional(), // Count of dislikes
  dislikes_users: z.array(z.number()).optional(), // Array of user IDs who disliked
  favourites: z.array(z.number()).optional(),
  favourites_number: z.number().optional(), // Count of likes
  comments: z
    .array(
      z.object({
        // Array of comments
        userId: z.number(), // ID of the user who commented
        isAdmin: z.number(), // ID of the user who commented
        user: z.string().optional(), // ID of the user who commented
        comment: z.string(), // Comment text
        createdAt: z.string(), // Timestamp of when the comment was made
      })
    )
    .optional(),
  createdAt: z.string().optional(),
});

// Infer the FrozenProduct type
export type FrozenProduct = z.infer<typeof FrozenProductSchema>;

// Category Schema
export const CategorySchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Category name is required."),
  slug: z.string().min(1, "Slug is required."),
  description: z.string().optional(),
  image_url: z.string().url().optional(),
  createdAt: z.string(),
});

export type Category = z.infer<typeof CategorySchema>;

// Category Contact
export const ContactSchema = z.object({
  id: z.number(),
  email: z.string().min(1, "Email is required."),
  userId: z.number().optional(),
  messages: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      message: z.string(),
      created_at: z.string(),
      replies: z.array(
        z.object({
          replyId: z.string(),
          replyText: z.string(),
          replyDate: z.string(),
        })
      ),
    })
  ),
  createdAt: z.string(),
});

export type Contact = z.infer<typeof ContactSchema>;

// Define the OrderItem schema
export const OrderItemSchema = z.object({
  productId: z.number(),
  quantity: z.number(),
});

// Infer the OrderItem type
export type OrderItem = z.infer<typeof OrderItemSchema>;

// Define the Order schema
export const OrderSchema = z.object({
  id: z.number(),
  customerId: z.number(),
  customerName: z.string(),
  email: z.string().email(),
  status: z.string(),
  orderItems: z.array(OrderItemSchema),
  totalAmount: z.number(),
  createdAt: z.string().optional(),
  trashed: z.boolean().optional(),
  finalTrashed: z.boolean().optional(),
});

// Infer the Order type
export type Order = z.infer<typeof OrderSchema>;

// Define the CheckoutInput schema
export const CheckoutInputSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  otp: z.string().optional(),
  address: z.string(),
  cart: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      price: z.number(),
      quantity: z.number(),
    })
  ),
  paymentMethod: z.string(),
  accountNumber: z.string(),
});

// Infer the CheckoutInput type
export type CheckoutInput = z.infer<typeof CheckoutInputSchema>;

export const NotificationSchema = z.object({
  id: z.number().optional(),
  userId: z.number().optional(), // Optional user ID
  username: z.string().optional(), // Optional user ID
  raw_details: z.string().optional(),
  title: z.string(),
  type: z.enum(["added", "updated", "deleted"]),
  tableName: z.string(), // The name of the table related to the notification
  createdAt: z.string().optional(),
});

// Infer the Notification type
export type Notification = z.infer<typeof NotificationSchema>;

export interface Comment {
  userId: number;
  user?: string | undefined;
  comment: string;
  isAdmin: number;
  createdAt: string;
  replies?: Comment[]; // Adding replies field
}

export interface Message {
  id: string;
  name: string;
  message: string;
  created_at: string;
  replies: { replyId: string; replyText: string; replyDate: string }[];
}
