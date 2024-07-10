import type { Router, Request, Response } from "express";
import { createRouter } from "@/utils/create";
import { handleGetInvoices, handleGetTransactions } from "@/controllers/transactions";
import { Invoice, InvoiceResponse, Transaction, TransactionResponse } from "@/schema/transactions";

export default createRouter((router: Router) => {
  /**
   * @swagger
   * /status:
   *   get:
   *     summary: Get server status
   *     description: Returns server running status, uptime, and current timestamp (utility route)
   *     tags: [Status]
   *     responses:
   *       200:
   *         description: Successful response
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Server is running
   *                 uptime:
   *                   type: number
   *                   example: 12345.67
   *                 timestamp:
   *                   type: number
   *                   example: 1625244672000
   */
  router.get("/status", (_req, res) => {
    res.json({
      message: "Server is running",
      uptime: process.uptime(),
      timestamp: Date.now(),
    });
  });

  /**
   * @swagger
   * /identify:
   *   post:
   *     summary: Identify contact
   *     description: Identify a contact by email or phone number
   *     tags: [Identify]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 description: The email of the contact
   *               phoneNumber:
   *                 type: string
   *                 description: The phone number of the contact
   *     responses:
   *       200:
   *         description: Successful response
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 contact:
   *                   type: object
   *                   properties:
   *                     primaryContactId:
   *                       type: number
   *                     emails:
   *                       type: array
   *                       items:
   *                         type: string
   *                     phoneNumbers:
   *                       type: array
   *                       items:
   *                         type: string
   *                     secondaryContactIds:
   *                       type: array
   *                       items:
   *                         type: number
   *       500:
   *         description: Internal server error
   */
  router.get("/transactions", async (req: Request, res: Response) => {
    const page: number = parseInt(req.query.page as string, 10) || 1;
    const limit: number = parseInt(req.query.limit as string, 10) || 10;
  
    try {
      const transactions: TransactionResponse = await handleGetTransactions(page, limit);
      res.json(transactions);
    } catch (err) {
      console.error('Error retrieving transactions:', err);
      res.status(500).json({ error: 'Failed to retrieve transactions' });
    }
  });

 
  /**
   * @swagger
   * /identify:
   *   post:
   *     summary: Identify contact
   *     description: Identify a contact by email or phone number
   *     tags: [Identify]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 description: The email of the contact
   *               phoneNumber:
   *                 type: string
   *                 description: The phone number of the contact
   *     responses:
   *       200:
   *         description: Successful response
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 contact:
   *                   type: object
   *                   properties:
   *                     primaryContactId:
   *                       type: number
   *                     emails:
   *                       type: array
   *                       items:
   *                         type: string
   *                     phoneNumbers:
   *                       type: array
   *                       items:
   *                         type: string
   *                     secondaryContactIds:
   *                       type: array
   *                       items:
   *                         type: number
   *       500:
   *         description: Internal server error
   */
  router.get("/invoices", async (req: Request, res: Response) => {
    const page: number = parseInt(req.query.page as string, 10) || 1;
    const limit: number = parseInt(req.query.limit as string, 10) || 10;
  
    try {
      const invoices: InvoiceResponse= await handleGetInvoices(page, limit);
      res.json(invoices);
    } catch (err) {
      console.error('Error retrieving transactions:', err);
      res.status(500).json({ error: 'Failed to retrieve transactions' });
    }
  }); 
});
