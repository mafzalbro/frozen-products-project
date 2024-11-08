"use server";

import { z } from "zod";
import { query } from "./db/connect";
import { createContactsTable } from "./db/tables";
import { getMeta } from "@/store/metadata";
import {
  getContactHtmlTemplate,
  getReplyHtmlTemplate,
} from "@/actions/mails/get-html";
import { sendMail } from "@/actions/mails/email";
import {
  checkIsAdmin,
  checkIsUserFreely,
  checkIsUser,
} from "./helpers/check-auth";
import { Contact, Message } from "@/types";
import { v4 as uuidv4 } from "uuid";

// Define a type for contact form input
export type ContactFormInput = {
  name: string;
  email: string;
  message: string;
};

// Initialize contacts table on module load
createContactsTable();

// Insert or update contact form data in MySQL
export async function insertContact({
  name,
  email,
  message,
}: ContactFormInput) {
  const { userId } = await checkIsUserFreely();
  const messageId = uuidv4();
  const checkEmailSql = `SELECT * FROM contacts WHERE email = ?`;
  const result = await query(checkEmailSql, [email]);

  try {
    if (result.length > 0) {
      // Append a new message with an empty replies array
      const updateSql = `
        UPDATE contacts
        SET messages = JSON_ARRAY_APPEND(messages, '$', JSON_OBJECT('id', ?, 'userId', ?, 'name', ?, 'message', ?, 'created_at', CURRENT_TIMESTAMP, 'replies', JSON_ARRAY())),
            name = ?  -- Update the contact name field as well
        WHERE email = ?;
      `;
      await query(updateSql, [messageId, userId, name, message, name, email]);
    } else {
      // Create a new contact with initial message and empty replies array
      const insertSql = `
        INSERT INTO contacts (userId, email, name, messages)
        VALUES (?, ?, ?, JSON_ARRAY(JSON_OBJECT('id', ?, 'userId', ?, 'name', ?, 'message', ?, 'created_at', CURRENT_TIMESTAMP, 'replies', JSON_ARRAY())));
      `;
      await query(insertSql, [
        userId,
        email,
        name,
        messageId,
        userId,
        name,
        message,
      ]);
    }
  } catch (error) {
    console.error("Error inserting/updating contact:", error);
    throw new Error("Database operation failed.");
  }
}

// Send email using nodemailer
export async function sendContactForm({
  name,
  email,
  message,
}: ContactFormInput) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
    throw new Error("Email credentials are not set.");
  }

  const to = process.env.GMAIL_USER;
  const subject = `Contact Form Submission from ${name}`;
  const html = getContactHtmlTemplate(
    name,
    email,
    message,
    getMeta().siteTitle
  );

  await sendMail(to, subject, html);
  await sendMail(
    email,
    "Message Received on " + getMeta().siteTitle,
    "Thanks for contacting us! We'll reach you soon!"
  );
}

// Handle the contact form submission
export async function handleContactForm(formData: ContactFormInput) {
  const schema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    message: z.string().min(1, "Message is required"),
  });

  const validationResult = schema.safeParse(formData);

  if (!validationResult.success) {
    return { errors: validationResult.error.flatten().fieldErrors };
  }

  try {
    await insertContact(validationResult.data);
    await sendContactForm(validationResult.data);
    return { success: true };
  } catch (error) {
    console.error("Error handling contact form:", error);
    return {
      errors: { global: "Failed to send the message. Please try again later." },
    };
  }
}

// Reply to a particular message if admin
export async function replyToMessage({
  messageId,
  reply,
  userId,
  email,
}: {
  messageId: string;
  reply: string;
  userId?: number | null; // Optional userId to see user exists?
  email: string; // Email is always required
}) {
  const { isAuthenticated } = await checkIsAdmin();
  if (!isAuthenticated) {
    throw new Error("Admin authentication required.");
  }

  // Prepare the SQL query and parameters based on whether userId is provided
  let getUserContactSql = `SELECT email, name, messages FROM contacts WHERE `;
  const queryParams: (number | string)[] = [];

  if (userId) {
    // If userId is available, fetch contact by userId
    getUserContactSql += `userId = ?`;
    queryParams.push(userId);
  } else {
    // If userId is not available, fetch contact by email
    getUserContactSql += `email = ?`;
    queryParams.push(email);
  }

  const contactResult = await query(getUserContactSql, queryParams);

  if (!contactResult.length) {
    throw new Error("Contact not found.");
  }

  const { name, messages } = contactResult[0];

  console.log({ contactResult });

  const parsedMessages = JSON.parse(messages);

  // Update the message with the new reply
  const updatedMessages = parsedMessages.map(
    (msg: {
      id: string;
      replies: { replyId: string; replyText: string; replyDate: string }[];
    }) => {
      if (msg.id === messageId) {
        const newReply = {
          replyId: uuidv4(), // Generate a new reply ID
          replyText: reply,
          replyDate: new Date().toISOString(),
        };
        // Add the new reply to the existing replies array
        msg.replies = msg.replies ? [...msg.replies, newReply] : [newReply];
      }
      return msg;
    }
  );

  try {
    // Update the messages field in the database
    const updateSql = `
      UPDATE contacts
      SET messages = ?
      WHERE ${userId ? "userId" : "email"} = ?;
    `;
    await query(updateSql, [
      JSON.stringify(updatedMessages),
      userId || email, // Use userId if available, otherwise email
    ]);

    // Send a confirmation email
    const html = getReplyHtmlTemplate(name, reply, getMeta().siteTitle);
    await sendMail(email, "Reply to Your Message", html);

    return { success: true };
  } catch (error) {
    console.error("Error replying to message:", error);
    throw new Error("Failed to reply to the message.");
  }
}

// Fetch all contacts for admin with pagination
export const fetchContacts = async ({
  page = 1,
  limit = 10,
}: {
  page?: number;
  limit?: number;
}): Promise<{
  contacts: Contact[];
  totalPages?: number;
  totalContacts?: number;
}> => {
  const { isAuthenticated } = await checkIsAdmin();
  if (!isAuthenticated) {
    return { contacts: [], totalPages: 0 };
  }

  const offset = (page - 1) * limit;

  try {
    const fetchContactsSql = `SELECT * FROM contacts LIMIT ? OFFSET ?`;
    const contacts = await query(fetchContactsSql, [limit, offset]);

    const countSql = `SELECT COUNT(*) as total FROM contacts`;
    const countResult = await query(countSql);
    const totalContacts = countResult[0].total;

    const parsedContacts = contacts.map((contact) => {
      const messages = JSON.parse(contact.messages); // Parse messages JSON
      return { ...contact, messages };
    });

    return {
      contacts: JSON.parse(JSON.stringify(parsedContacts)),
      totalContacts,
      totalPages: Math.ceil(totalContacts / limit),
    };
  } catch (error) {
    console.error("Error fetching contacts:", error);
    throw new Error("Failed to fetch contacts.");
  }
};

// Delete all messages for a contact by userId or email
export async function deleteAllMessages({
  userId,
  email,
}: {
  userId?: number | null;
  email?: string;
}) {
  const { isAuthenticated } = await checkIsAdmin();
  if (!isAuthenticated) {
    throw new Error("Admin authentication required.");
  }

  if (!userId && !email) {
    throw new Error("Either userId or email must be provided.");
  }

  try {
    const deleteMessagesSql = `
      UPDATE contacts
      SET messages = JSON_ARRAY()
      WHERE ${userId ? "userId" : "email"} = ?;
    `;
    await query(deleteMessagesSql, [userId || email]);

    return { success: true };
  } catch (error) {
    console.error("Error deleting messages:", error);
    throw new Error("Failed to delete messages.");
  }
}

// Fetch messages by userId (with replies)
export async function getMessagesForCurrentUser(): Promise<{
  messages: Message[];
  success: boolean;
}> {
  const sql = `SELECT * FROM contacts WHERE userId = ? And email = ?`;

  const { userId, user, isAuthenticated } = await checkIsUser();

  if (!isAuthenticated) {
    return { messages: [], success: false };
  }

  if (user?.email) {
    const result = await query(sql, [userId, user.email]);
    if (result.length === 0) {
      return { messages: [], success: false };
    }

    const messages = JSON.parse(result[0].messages);
    return { messages, success: true };
  } else {
    return { messages: [], success: false };
  }
}
