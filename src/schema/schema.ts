import { z } from "zod";
import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";

export const itemSchema = z.object({
  itemId: z.string(),
  description: z.string(),
  quantity: z
    .object({
      $numberInt: z.string(),
    })
    .transform((data) => parseInt(data.$numberInt, 10)),
  price: z.string(),
});

const transactionSchema = z.object({
  _id: z.object({
    $oid: z.string(),
  }),
  transactionId: z.string(),
  userId: z.string(),
  amount: z.string(),
  username: z.string(),
  currency: z.string(),
  transactionType: z.string(),
  status: z.string(),
  paymentMethod: z.string(),
  timestamp: z.string().transform((date) => new Date(date)),
  createdAt: z.string().transform((date) => new Date(date)),
  updatedAt: z.string().transform((date) => new Date(date)),
  items: z.array(itemSchema),
  billingAddress: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    postalCode: z.string(),
    country: z.string(),
  }),
  shippingAddress: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    postalCode: z.string(),
    country: z.string(),
  }),
  additionalNotes: z.string(),
});

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  phoneNumber: text("phone_number").unique(),
  email: text("email").unique(),
  linkedId: integer("linked_id"),
  linkPrecedence: text("link_precedence").default("primary"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

export const contactSchema = createSelectSchema(contacts);

export const identifySchema = z.object({
  page: z.string().optional(),
  size: z.string().optional(),
});

const responseSchema = z.array(transactionSchema);

// Type inference for the response body structure
export type ResponseBody = z.infer<typeof responseSchema>;
export type Contact = z.infer<typeof contactSchema>;
export type NewContact = z.infer<typeof contactSchema>;
export type identifyScheam = z.infer<typeof identifySchema>;
