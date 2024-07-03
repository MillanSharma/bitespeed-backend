
import { contacts, identifySchema } from "@/schema/schema";
import { createHandler } from "@/utils/create";
import { db } from "@/utils/db";
import { eq, or } from "drizzle-orm";
import type { NextFunction, Request, Response } from "express";

  
const handleIdentify = createHandler(identifySchema, async (req: Request, res: Response, _next: NextFunction ) => {
  const { email, phoneNumber } = req.body;

  try {
    let foundContacts;
    if (email && phoneNumber) {
      foundContacts = await db.select().from(contacts).where(or(eq(contacts.email, email), eq(contacts.phoneNumber, phoneNumber)));
    } else if (email) {
      foundContacts = await db.select().from(contacts).where(eq(contacts.email, email));
    } else {
      foundContacts = await db.select().from(contacts).where(eq(contacts.phoneNumber, phoneNumber));
    }

    if (foundContacts.length === 0) {
      const [newContact] = await db.insert(contacts).values({ email, phoneNumber, linkPrecedence: 'primary' }).returning();
      return res.json({
        contact: {
          primaryContactId: newContact?.id,
          emails: [email],
          phoneNumbers: [phoneNumber],
          secondaryContactIds: [],
        },
      });
    }

    let primaryContact = foundContacts.find(contact => contact.linkPrecedence === 'primary') || foundContacts[0];
    let secondaryContacts = foundContacts.filter(contact => contact.id !== primaryContact?.id);

    if (!primaryContact?.linkPrecedence) {
      await db.update(contacts).set({ linkPrecedence: 'primary' }).where(eq(contacts.id, primaryContact?.id));
    }

    for (let contact of secondaryContacts) {
      await db.update(contacts)
        .set({ linkedId: primaryContact?.id, linkPrecedence: 'secondary' })
        .where(eq(contacts.id, contact.id));
    }

    const emails = [primaryContact?.email, ...secondaryContacts.map(contact => contact.email)];
    const phoneNumbers = [primaryContact?.phoneNumber, ...secondaryContacts.map(contact => contact.phoneNumber)];
    const secondaryContactIds = secondaryContacts.map(contact => contact.id);

    res.json({
      contact: {
        primaryContactId: primaryContact?.id,
        emails: emails.filter(Boolean),
        phoneNumbers: phoneNumbers.filter(Boolean),
        secondaryContactIds,
      },
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing the request' });
  }
});

export default handleIdentify;