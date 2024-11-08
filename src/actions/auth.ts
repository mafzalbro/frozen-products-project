"use server";

import { cookies } from "next/headers";
import { signJwt, verifyJwt } from "@/actions/jwt";
import bcrypt from "bcryptjs";
import { createRecord, getRecord, updateRecord } from "@/actions/db/crud";
import { createUsersTable } from "@/actions/db/tables"; // Ensure this function exists to create the users table
import { User } from "@/types";
import { z } from "zod";
import {
  getResetHtmlTemplate,
  getVerifyUserHtmlTemplate,
} from "@/actions/mails/get-html";
import { sendMail } from "@/actions/mails/email";
import { getAllUsers } from "./cruds/users";
import { checkIsAdmin } from "./helpers/check-auth";

const COOKIE_NAME = "authToken";
const COOKIE_USER_NAME = "user";

await createUsersTable(); // Create the users table if not exists

// Verify Auth (Server-side action to protect routes)
export const verifyAuth = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    return { isAuthenticated: false };
  }

  const verified = verifyJwt(token);
  return { isAuthenticated: !!verified, user: verified, token };
};

// Get User From Cookies
export const verifyUser = async () => {
  const cookieStore = await cookies();
  const userString = cookieStore.get(COOKIE_USER_NAME)?.value;

  const user: Partial<User> = userString ? JSON.parse(userString) : null;

  return user
    ? { isAuthenticated: true, user: user }
    : { isAuthenticated: false };
};

const userSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password confirmation is required"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zip: z.string().min(1, "Zip code is required"),
  }),
  agreeToTerms: z.boolean().refine((val) => val, {
    message: "You must agree to the terms",
  }),
});

// Define the Zod schema for validation
const updateAccountSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  username: z.string().min(1, "Username is required"),
  email: z.string().min(1, "Email is required"),
  phone: z.string().optional(),
  address: z
    .object({
      street: z.string().min(1, "Street is required"),
      city: z.string().min(1, "City is required"),
      state: z.string().min(1, "State is required"),
      zip: z.string().min(1, "Zip code is required"),
    })
    .optional(),
});

export const updateAccount = async (
  formData: FormData,
  id: number,
  username: string
) => {
  // Convert FormData to a plain object
  const updatedData: { [key: string]: unknown } = {};
  formData.forEach((value, key) => {
    updatedData[key] = value;
  });

  // Create a nested address object from the flat form data
  const address = {
    street: updatedData["address.street"],
    city: updatedData["address.city"],
    state: updatedData["address.state"],
    zip: updatedData["address.zip"],
  };

  // Construct the final object with nested address
  const finalData = {
    ...updatedData,
    address: address, // Nest the address object here
    username, // Include username as well
  };

  // Validate the structured data using Zod
  const parsedData = updateAccountSchema.safeParse(finalData);

  if (!parsedData.success) {
    return {
      success: false,
      message: JSON.stringify(parsedData.error.flatten().fieldErrors),
    };
  }

  // Proceed with updating the user's data in the database
  await updateRecord("users", parsedData.data, { id: id });

  (await cookies()).set("user", JSON.stringify(finalData));

  return { success: true, message: "Account updated successfully" };
};

interface GetAllUsersIfAdminResponse {
  success: boolean;
  message?: string;
  totalPages?: number;
  total?: number;
  users?: User[];
}
// Function to get all users if the requester is an admin
export const getAllUsersIfAdmin = async ({
  page = 1,
  limit = 10,
  searchQuery = "",
  all = false,
}: {
  page?: number;
  limit?: number;
  searchQuery?: string;
  all?: boolean;
}): Promise<GetAllUsersIfAdminResponse> => {
  const { isAuthenticated, message } = await checkIsAdmin();

  if (!isAuthenticated) {
    return {
      success: false,
      message: message,
    };
  }

  // If the user is an admin, proceed to fetch users
  if (all) {
    const result = await query("select * from users");

    const users = JSON.parse(JSON.stringify(result));

    return { totalPages: 1, total: users.length, success: true, users };
  }
  const { total, totalPages, users } = await getAllUsers({
    page,
    limit,
    searchQuery,
  });

  return { totalPages, total, success: true, users };
};

// Register new user
export const register = async (data: unknown) => {
  const parsedData = userSchema.safeParse(data);
  if (!parsedData.success) {
    return { success: false, message: parsedData.error.flatten().fieldErrors };
  }

  const {
    fullName,
    username,
    email,
    password,
    confirmPassword,
    phone,
    address,
  } = parsedData.data;

  if (password !== confirmPassword) {
    return { success: false, message: "Passwords do not match" };
  }

  const existingUser = (await getRecord("users", { email })) as User[];
  if (existingUser.length) {
    return { success: false, message: "Email already registered" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser: Partial<User> = {
    email,
    username,
    password: hashedPassword,
    fullName,
    phone,
    address,
    favourites: [],
    isVerified: false, // Set initial verification status
  };

  await createRecord("users", newUser);

  // Create a verification token
  const verificationToken = signJwt({ email, isVerified: true }); // Adjust the payload as needed
  const verificationLink = `${process.env.BASE_URL}/verify?token=${verificationToken}`;

  // Send verification email
  const htmlTemplate = getVerifyUserHtmlTemplate(fullName, verificationLink);
  await sendMail(email, "Email Verification", htmlTemplate);

  return {
    success: true,
    message:
      "Successfully registered. Please check your email for verification.",
  };
};

import { checkIsUser } from "@/actions/helpers/check-auth";
import { query } from "./db/connect";

// Resend verification email using the authenticated user's email
export const resendVerificationEmail = async () => {
  // Get authenticated user's information
  const authStatus = await checkIsUser();

  if (!authStatus.isAuthenticated || !authStatus.user) {
    return { success: false, message: "User is not authenticated" };
  }

  // Parse user email from the authenticated user's data
  const { email } = authStatus.user;

  // Check if user exists in the database
  const userRecord = (await getRecord("users", { email })) as User[];

  if (!userRecord.length) {
    return { success: false, message: "User not found" };
  }

  const user = userRecord[0];

  // Check if the user is already verified
  if (user.isVerified) {
    return { success: false, message: "User is already verified" };
  }

  if (email) {
    // Create a new verification token
    const verificationToken = signJwt({ email, isVerified: true });
    const verificationLink = `${process.env.BASE_URL}/verify?token=${verificationToken}`;

    // Send verification email
    const htmlTemplate = getVerifyUserHtmlTemplate(
      user.fullName,
      verificationLink
    );
    if (email) await sendMail(email, "Resend Email Verification", htmlTemplate);

    return {
      success: true,
      message: "Verification email has been resent. Please check your email.",
    };
  } else {
    return {
      success: false,
      message: "Verification email not exists. Please check your email.",
    };
  }
};

export const verifyRegisteredUser = async (token: string) => {
  // Verify the JWT token
  const verified = verifyJwt(token);

  // Check if the token is valid and contains the necessary data
  if (!verified || !verified.email) {
    return { success: false, message: "Invalid or expired verification token" };
  }

  // Update the user record to set isVerified to true
  await updateRecord("users", { isVerified: true }, { email: verified.email });
  const { user } = await verifyUser();

  (await cookies()).set("user", JSON.stringify({ ...user, isVerified: 1 }));

  return { success: true, message: "Email successfully verified" };
};

// Login
export const login = async (data: { userInput: string; password: string }) => {
  const { userInput, password } = data;

  const users = (await getRecord("users", { email: userInput })) as User[];
  const user =
    users[0] ||
    ((await getRecord("users", { username: userInput })) as User[])[0];

  if (!user) {
    return { success: false, message: "Invalid credentials" };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return { success: false, message: "Invalid credentials" };
  }

  const token = signJwt({ email: user.email });
  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    maxAge: 3600,
    path: "/",
    sameSite: "strict",
  });
  (await cookies()).set(COOKIE_USER_NAME, JSON.stringify(user), {
    httpOnly: true,
    maxAge: 3600,
    path: "/",
    sameSite: "strict",
  });

  return { success: true, message: "Successfully logged in" };
};

// Logout
export const logout = async () => {
  (await cookies()).delete(COOKIE_NAME);
  (await cookies()).delete(COOKIE_USER_NAME);
  return { success: true, message: "Successfully logged out" };
};

// Forgot Password
export const forgotPassword = async (email: string) => {
  const users = (await getRecord("users", { email })) as User[];
  if (!users.length) {
    return { success: false, message: "Email not found" };
  }

  const resetToken = signJwt({ email });
  const resetLink = `${process.env.BASE_URL}/reset-password?resetToken=${resetToken}`;
  const name = users[0].fullName; // Assuming the user's full name is stored

  // Sending the email
  const htmlTemplate = getResetHtmlTemplate(name, resetLink);
  const mailResponse = await sendMail(
    email,
    "Password Reset Request",
    htmlTemplate
  );

  return {
    success: true,
    message: "Reset token sent to email",
    mailResponse,
  };
};

export const verifyResetToken = async (resetToken: string) => {
  const verified = verifyJwt(resetToken);
  return verified
    ? { success: true, message: "Token valid" }
    : { success: false, message: "Invalid reset token" };
};

// Reset Password
export const resetPassword = async (
  resetToken: string,
  newPassword: string,
  confirmPassword: string
) => {
  const verified = verifyJwt(resetToken);
  if (!verified || newPassword !== confirmPassword) {
    return {
      success: false,
      message: "Invalid reset token or passwords do not match",
    };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await updateRecord(
    "users",
    { password: hashedPassword },
    { email: verified.email }
  ); // Use updateRecord utility

  return { success: true, message: "Password successfully reset" };
};

// Change Password
export const changePassword = async (
  email: string,
  oldPassword: string,
  newPassword: string,
  confirmPassword: string
) => {
  const users = (await getRecord("users", { email })) as User[];
  const user = users[0];
  if (!user || newPassword !== confirmPassword) {
    return {
      success: false,
      message: "User not found or passwords do not match",
    };
  }

  const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
  if (!isOldPasswordValid) {
    return { success: false, message: "Incorrect old password" };
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  await updateRecord("users", { password: hashedNewPassword }, { email }); // Use updateRecord utility

  return { success: true, message: "Password successfully changed" };
};

export const assignRole = async (
  role: "super_admin" | "admin" | "editor" | "user" | "custom",
  privileges: string[],
  userId: number
) => {
  try {
    console.log({ role, privileges, userId });

    if (userId) {
      // Update user role and privileges in the database
      await updateRecord(
        "users",
        { role, privileges: JSON.stringify(privileges) },
        { id: userId }
      );
    }

    return {
      success: true,
      message: "Role and privileges assigned successfully",
    };
  } catch {
    return { success: false, message: "Error assigning role and privileges" };
  }
};
