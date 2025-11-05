import { Request, Response } from 'express';
import { PaymentTransactionModel } from '../models/mongoose';
import { logger } from '../utils/logger.util';
import { v4 as uuidv4 } from 'uuid';

// Verify SePay webhook using API Key header if configured
function verifySePay(req: Request): boolean {
  const expectedKey = process.env.SEPAY_API_KEY?.trim();
  if (!expectedKey) return true; // allow if not set (for sandbox/dev)
  const header = req.header('Authorization') || '';
  // Docs: "Authorization: Apikey <API_KEY>"
  const prefix = 'Apikey ';
  if (!header.startsWith(prefix)) return false;
  const provided = header.substring(prefix.length).trim();
  return provided === expectedKey;
}

export async function sepayWebhook(req: Request, res: Response) {
  try {
    if (!verifySePay(req)) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const payload = req.body || {};
    const sepayId = payload.id;
    if (typeof sepayId !== 'number') {
      return res.status(400).json({ success: false, message: 'Invalid payload' });
    }

    const doc = {
      sepayId,
      gateway: payload.gateway,
      transactionDate: payload.transactionDate ? new Date(payload.transactionDate) : undefined,
      accountNumber: payload.accountNumber,
      code: payload.code ?? null,
      content: payload.content,
      transferType: payload.transferType,
      transferAmount: payload.transferAmount,
      accumulated: payload.accumulated,
      subAccount: payload.subAccount ?? null,
      referenceCode: payload.referenceCode,
      description: payload.description,
      raw: payload,
    } as any;

    // Idempotent upsert by sepayId
    const result = await PaymentTransactionModel.findOneAndUpdate(
      { sepayId },
      { $set: doc },
      { upsert: true, new: true }
    );

    logger.info('SePay webhook processed', { sepayId });

    // Per docs, respond with success true and HTTP 201/200
    return res.status(201).json({ success: true, id: result.sepayId });
  } catch (err) {
    logger.error('SePay webhook error', { error: err });
    return res.status(500).json({ success: false });
  }
}

export async function createQrPayment(req: Request, res: Response) {
  try {
    const {
      amount,
      description,
      bank = process.env.PAYMENT_BANK_NAME,
      accountNumber = process.env.PAYMENT_ACCOUNT_NUMBER,
      accountName = process.env.PAYMENT_ACCOUNT_NAME,
      referenceId,
    } = req.body || {};

    if (!bank || !accountNumber) {
      return res.status(400).json({ success: false, message: 'Missing bank or accountNumber' });
    }
    if (!amount || Number.isNaN(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    // Tạo mã tham chiếu để nhận diện trong webhook (nằm trong content)
    const shortCode = (referenceId || uuidv4()).toString().replace(/-/g, '').slice(0, 10).toUpperCase();
    const content = `${description ? description + ' ' : ''}CODE:${shortCode}`.trim();

    const params = new URLSearchParams({
      acc: String(accountNumber),
      bank: String(bank),
      amount: String(Number(amount)),
      des: content,
    });
    const qrUrl = `https://qr.sepay.vn/img?${params.toString()}`;

    return res.status(200).json({
      success: true,
      data: {
        qrUrl,
        amount: Number(amount),
        bank,
        accountNumber,
        accountName,
        content,
        code: shortCode,
      },
    });
  } catch (err) {
    logger.error('Create QR payment error', { error: err });
    return res.status(500).json({ success: false });
  }
}


