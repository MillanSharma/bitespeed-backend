import { z } from "zod";
import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
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

export const identifySchema = z
  .object({
    email: z.string().email().optional(),
    phoneNumber: z
      .string()
      .refine((value) => /^\+?[1-9]\d{1,14}$/.test(value), {
        message: "Invalid phone number format",
      })
      .optional(),
  })
  .refine((data) => {
    if (!(data.email || data.phoneNumber)) {
      throw new Error("Either email or phoneNumber must be provided");
    }
    return true;
  });

const responseBody = z.object({
  primaryContatctId: z.number(),
  emails: z.array(z.string()),
  phoneNumbers: z.array(z.string()),
  secondaryContactIds: z.array(z.number()),
});

// Type inference for the response body structure
export type ResponseBody = z.infer<typeof responseBody>;
export type Contact = z.infer<typeof contactSchema>;
export type NewContact = z.infer<typeof contactSchema>;
export type identifyScheam = z.infer<typeof identifySchema>;
