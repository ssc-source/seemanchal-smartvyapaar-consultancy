const express = require('express');
const router = express.Router();
const paymentService = require('../services/paymentService');
const { recordAudit } = require('../utils/auditLogger');
const { QuizRegistration } = require('../models');

// Use raw body for signature verification. This router should be mounted with raw body parser.
router.post('/', async (req, res) => {
  try {
    const raw = req.body; // Buffer when mounted with express.raw()
    const signature = req.get('x-razorpay-signature');
    const rawString = raw.toString();
    const valid = paymentService.verifyWebhookSignature(rawString, signature);
    if (!valid) {
      await recordAudit({ userId: null, action: 'WEBHOOK_INVALID', entityType: 'PaymentWebhook', entityId: null, newValue: { headers: req.headers }, ipAddress: req.ip });
      return res.status(400).send('invalid signature');
    }

    const payload = JSON.parse(rawString);
    // Minimal handling: on payment.captured update registration
    if (payload.event === 'payment.captured' && payload.payload && payload.payload.payment && payload.payload.payment.entity) {
      const payment = payload.payload.payment.entity;
      const orderId = payment.order_id;
      const reg = await QuizRegistration.findOne({ where: { gatewayOrderId: orderId } });
      if (reg) {
        // idempotent: ignore if already paid
        if (reg.paymentStatus === 'paid') {
          await recordAudit({ userId: reg.studentId, action: 'WEBHOOK_IGNORED', entityType: 'QuizRegistration', entityId: reg.id, newValue: { note: 'already paid' }, ipAddress: req.ip });
        } else {
        const old = reg.toJSON();
        reg.paymentStatus = 'paid';
        reg.gatewayPaymentId = payment.id;
        reg.paymentCompletedAt = new Date(payment.created_at * 1000 || Date.now());
        reg.activatedAt = reg.activatedAt || new Date();
        reg.status = 'activated';
        await reg.save();
        await recordAudit({ userId: reg.studentId, action: 'WEBHOOK_UPDATE', entityType: 'QuizRegistration', entityId: reg.id, oldValue: old, newValue: reg.toJSON(), ipAddress: req.ip });
        }
      }
    }

    // record webhook payload
    await recordAudit({ userId: null, action: 'WEBHOOK_RECEIVED', entityType: 'PaymentWebhook', entityId: null, newValue: payload, ipAddress: req.ip });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Webhook error', err);
    return res.status(500).json({ success: false });
  }
});

module.exports = router;
