import { Router } from 'express';
import { sepayWebhook, createQrPayment } from '../../controllers/payment.controller';

const router = Router();

// SePay will POST to this endpoint
router.post('/webhook', sepayWebhook);

// Client requests QR for payment
router.post('/create-qr', createQrPayment);

export default router;


