const Razorpay = require('razorpay');
const crypto = require('crypto');

const key_id = process.env.RAZORPAY_KEY_ID;
const key_secret = process.env.RAZORPAY_KEY_SECRET;

const instance = new Razorpay({ key_id, key_secret });

module.exports = {
  createOrder: async ({ amount, currency = 'INR', receipt = null, notes = {} }) => {
    // Razorpay expects amount in paise (integer)
    const amountPaise = Math.round(Number(amount) * 100);
    const payload = {
      amount: amountPaise,
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      payment_capture: 1,
      notes,
    };
    const order = await instance.orders.create(payload);
    return order;
  },

  verifySignature: ({ orderId, paymentId, signature }) => {
    const generated = crypto.createHmac('sha256', key_secret).update(`${orderId}|${paymentId}`).digest('hex');
    return generated === signature;
  },

  verifyWebhookSignature: (rawBody, signature) => {
    const generated = crypto.createHmac('sha256', key_secret).update(rawBody).digest('hex');
    return generated === signature;
  },

  refund: async ({ paymentId, amount }) => {
    // amount in rupees or paise? expect amount in rupees (decimal) and convert
    const payload = {};
    if (amount) payload.amount = Math.round(Number(amount) * 100);
    // Razorpay refund API: instance.payments.refund(paymentId, payload)
    const resp = await instance.payments.refund(paymentId, payload);
    return resp;
  },
};
