import type { Router } from "express";
import { createRouter } from "@/utils/create";
import handleIdentify from "@/controllers/identify";

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
  router.post("/identify", handleIdentify);
});
