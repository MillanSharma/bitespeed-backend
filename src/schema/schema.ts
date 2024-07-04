import { z } from 'zod';
import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-zod'
export const contacts = pgTable('contacts', {
  id: serial('id').primaryKey(),
  phoneNumber: text('phone_number').unique(),
  email: text('email').unique(),
  linkedId: integer('linked_id'),
  linkPrecedence: text('link_precedence').default('primary'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  deletedAt: timestamp('deleted_at')
});

export const contactSchema = createSelectSchema(contacts);
export const identifySchema = z.object({
    email: z.string().email().optional(),
    phoneNumber: z.string().optional()
  }).refine(data => data.email || data.phoneNumber, {
    message: "Either email or phoneNumber must be provided"
});

export type Contact = z.infer<typeof contactSchema>;
export type NewContact = z.infer<typeof contactSchema>;
export type identifyScheam = z.infer<typeof identifySchema>; 