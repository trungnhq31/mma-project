import { Router } from 'express';
import { sepayWebhook, createQrPayment } from '../../controllers/payment.controller';

const router = Router();

/**
 * @openapi
 * /api/v1/payment/create-qr:
 *   post:
 *     summary: Tao QR thanh toan SePay (dong)
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               description:
 *                 type: string
 *               bank:
 *                 type: string
 *               accountNumber:
 *                 type: string
 *               referenceId:
 *                 type: string
 *             required: [amount]
 *     responses:
 *       200:
 *         description: URL QR va thong tin giao dich
 */
// Client requests QR for payment
router.post('/create-qr', createQrPayment);

/**
 * @openapi
 * /api/v1/payment/webhook:
 *   post:
 *     summary: Nhan webhook SePay
 *     tags: [Payment]
 *     responses:
 *       201:
 *         description: Da ghi nhan thanh cong
 */
// SePay will POST to this endpoint
router.post('/webhook', sepayWebhook);

export default router;


