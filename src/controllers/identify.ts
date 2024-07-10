import { contacts, identifySchema, type Contact } from "@/schema/schema";
import { createHandler } from "@/utils/create";
import { db } from "@/utils/db";
import { eq, or, SQL } from "drizzle-orm";
import type { NextFunction, Request, Response } from "express";
import { z } from "zod";

const handleIdentify = createHandler(
  identifySchema,
  async (req: Request, res: Response, _next: NextFunction) => {
    const { phoneNumber, email } = req.body as z.infer<typeof identifySchema>;
    try {
      let foundContacts: Contact[];
      let whereClause: SQL<unknown> | undefined;

      if (email && phoneNumber) {
        whereClause = or(
          eq(contacts.email, email),
          eq(contacts.phoneNumber, phoneNumber),
        );
      } else if (email) {
        whereClause = eq(contacts.email, email);
      } else if (phoneNumber) {
        whereClause = eq(contacts.phoneNumber, phoneNumber);
      } else {
        // Handle the case where both email and phoneNumber are undefined
        return res
          .status(400)
          .json({ error: "Either email or phoneNumber must be provided" });
      }

      foundContacts = await db.select().from(contacts).where(whereClause);

      if (foundContacts.length === 0) {
        const [newContact] = await db
          .insert(contacts)
          .values({ email, phoneNumber, linkPrecedence: "primary" })
          .returning();
        return res.json({
          contact: {
            primaryContactId: newContact?.id,
            emails: [email],
            phoneNumbers: [phoneNumber],
            secondaryContactIds: [],
          },
        });
      }

      let primaryContact =
        foundContacts.find((contact) => contact.linkPrecedence === "primary") ||
        foundContacts[0];
      let secondaryContacts = foundContacts.filter(
        (contact) => contact.id !== primaryContact?.id,
      );

      if (!primaryContact?.linkPrecedence && primaryContact?.id) {
        await db
          .update(contacts)
          .set({ linkPrecedence: "primary" })
          .where(eq(contacts.id, primaryContact?.id));
      }

      for (let contact of secondaryContacts) {
        await db
          .update(contacts)
          .set({ linkedId: primaryContact?.id, linkPrecedence: "secondary" })
          .where(eq(contacts.id, contact.id));
      }

      const emails = [
        primaryContact?.email,
        ...secondaryContacts.map((contact) => contact.email),
      ];
      const phoneNumbers = [
        primaryContact?.phoneNumber,
        ...secondaryContacts.map((contact) => contact.phoneNumber),
      ];
      const secondaryContactIds = secondaryContacts.map(
        (contact) => contact.id,
      );

      res.json({
        contact: {
          primaryContactId: primaryContact?.id,
          emails: emails.filter(Boolean),
          phoneNumbers: phoneNumbers.filter(Boolean),
          secondaryContactIds,
        },
      });
    } catch (error) {
      console.error("Error:", error);
      res
        .status(500)
        .json({ error: "An error occurred while processing the request" });
    }
  },
);

export default handleIdentify;
