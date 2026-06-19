const catchAsync = require('../utils/catchAsync');
const { recordAudit } = require('../utils/auditLogger');
const paymentService = require('../services/paymentService');
const { QuizExam, StudentProfile, QuizRegistration } = require('../models');
const crypto = require('crypto');

const normalizeEmail = (email) => (email ? String(email).trim().toLowerCase() : null);

const getStudentProfileForUser = async (user) => {
  if (!user) return null;
  const email = normalizeEmail(user.email);
  let student = null;
  if (email) {
    student = await StudentProfile.findOne({ where: { email } });
  }
  if (!student) {
    student = await StudentProfile.findByPk(user.id);
  }
  return student;
};

const findRegistrationById = async (id) => {
  if (!id) return null;
  let registration = await QuizRegistration.findByPk(id);
  if (!registration) {
    registration = await QuizRegistration.findOne({ where: { registrationId: id } });
  }
  return registration;
};

exports.createOrder = catchAsync(async (req, res) => {
  const { quizExamId, amount, phone } = req.body;

  // Require authenticated student for assessment registration
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication required to register for assessment' });
  }

  if (!quizExamId) {
    return res.status(400).json({ success: false, message: 'quizExamId required' });
  }

  const student = await getStudentProfileForUser(req.user);
  if (!student) {
    return res.status(400).json({ success: false, message: 'Student profile not found. Please contact support.' });
  }

  const quiz = await QuizExam.findByPk(quizExamId);
  if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

  const price = Number(amount || process.env.ASSESSMENT_PRICE || 199);
  if (Number.isNaN(price) || price <= 0) return res.status(400).json({ success: false, message: 'Invalid amount' });

  const existingPending = await QuizRegistration.findOne({
    where: {
      studentId: student.id,
      quizExamId,
      paymentStatus: 'pending',
      status: 'pending',
    },
  });
  if (existingPending) {
    return res.status(409).json({ success: false, message: 'An existing pending registration already exists. Please complete the payment or cancel before creating a new one.' });
  }

  const registration = await QuizRegistration.create({
    studentId: student.id,
    quizExamId,
    paymentStatus: 'pending',
    paymentReference: crypto.randomBytes(8).toString('hex'),
    status: 'pending',
    amount: price,
    currency: process.env.CURRENCY || 'INR',
  });

  console.info('[paymentController.createOrder] created registration', {
    id: registration.id,
    registrationId: registration.registrationId,
    studentId: student.id,
    quizExamId,
    price,
    currency: registration.currency,
  });

  const order = await paymentService.createOrder({
    amount: price,
    currency: registration.currency || 'INR',
    receipt: registration.paymentReference,
    notes: {
      registrationId: registration.id,
      registrationKey: registration.registrationId,
    },
  });
  console.info('[paymentController.createOrder] razorpay order', { orderId: order.id, amount: order.amount, currency: order.currency });

  registration.gatewayOrderId = order.id;
  registration.paymentGateway = 'razorpay';
  await registration.save();

  await recordAudit({ userId: student.id, action: 'CREATE', entityType: 'QuizRegistration', entityId: registration.id, newValue: registration.toJSON(), ipAddress: req.ip });

  const orderForClient = Object.assign({}, order);
  orderForClient.key = process.env.RAZORPAY_KEY_ID;
  orderForClient.amount = order.amount;
  orderForClient.prefill = {
    name: student.name,
    email: student.email,
    contact: phone || undefined,
  };

  return res.status(201).json({ success: true, data: { order: orderForClient, registration } });
});

exports.verify = catchAsync(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, registrationId } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ success: false, message: 'Missing payment verification fields' });
  }

  console.info('[paymentController.verify] payment verification start', {
    razorpay_order_id,
    razorpay_payment_id,
    registrationId,
  });
  const valid = paymentService.verifySignature({ orderId: razorpay_order_id, paymentId: razorpay_payment_id, signature: razorpay_signature });
  if (!valid) return res.status(400).json({ success: false, message: 'Invalid signature' });

  let registration = null;
  if (registrationId) registration = await findRegistrationById(registrationId);
  if (!registration) registration = await QuizRegistration.findOne({ where: { gatewayOrderId: razorpay_order_id } });
  if (!registration) return res.status(404).json({ success: false, message: 'Registration not found' });

  // CRITICAL FIX: Verify that authenticated user owns this registration
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  const student = await getStudentProfileForUser(req.user);
  if (!student || student.id !== registration.studentId) {
    return res.status(403).json({ success: false, message: 'Unauthorized: registration does not belong to authenticated user' });
  }

  const old = registration.toJSON();
  registration.paymentStatus = 'paid';
  registration.gatewayPaymentId = razorpay_payment_id;
  registration.gatewaySignature = razorpay_signature;
  registration.paymentCompletedAt = new Date();
  registration.activatedAt = new Date();
  registration.status = 'activated';
  registration.invoiceNumber = `INV-${Date.now()}-${registration.id.slice(0, 6)}`;
  registration.metadata = {
    ...registration.metadata,
    invoice: {
      invoiceNumber: registration.invoiceNumber,
      studentName: student.name,
      studentEmail: student.email,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      amount: registration.amount,
      currency: registration.currency,
      date: registration.paymentCompletedAt,
    },
  };
  await registration.save();

  await recordAudit({ userId: registration.studentId, action: 'UPDATE', entityType: 'QuizRegistration', entityId: registration.id, oldValue: old, newValue: registration.toJSON(), ipAddress: req.ip });

  console.info('[paymentController.verify] registration completed', {
    registrationId: registration.id,
    gatewayPaymentId: registration.gatewayPaymentId,
    gatewayOrderId: registration.gatewayOrderId,
    invoiceNumber: registration.invoiceNumber,
  });

  return res.status(200).json({ success: true, data: registration, registration });
});

exports.refund = catchAsync(async (req, res) => {
  const { registrationId, amount, reason } = req.body;
  if (!registrationId) return res.status(400).json({ success: false, message: 'registrationId required' });

  const registration = await findRegistrationById(registrationId);
  if (!registration) return res.status(404).json({ success: false, message: 'Registration not found' });
  if (!registration.gatewayPaymentId) return res.status(400).json({ success: false, message: 'No gateway payment to refund' });

  const resp = await paymentService.refund({ paymentId: registration.gatewayPaymentId, amount });

  const old = registration.toJSON();
  registration.refundStatus = 'processed';
  registration.refundReason = reason || null;
  await registration.save();

  await recordAudit({ userId: req.admin?.id || null, action: 'UPDATE', entityType: 'QuizRegistration', entityId: registration.id, oldValue: old, newValue: registration.toJSON(), ipAddress: req.ip });

  return res.status(200).json({ success: true, data: resp });
});

exports.getStudentPayments = catchAsync(async (req, res) => {
  const student = await getStudentProfileForUser(req.user);
  if (!student) {
    return res.status(404).json({ success: false, message: 'Student profile not found' });
  }

  const regs = await QuizRegistration.findAll({ where: { studentId: student.id }, order: [['createdAt', 'DESC']] });
  return res.status(200).json({ success: true, data: regs });
});

// Return a single registration to the authenticated owner
exports.getRegistrationById = catchAsync(async (req, res) => {
  const regId = req.params.id;
  if (!req.user) return res.status(401).json({ success: false, message: 'Authentication required' });

  const reg = await findRegistrationById(regId);
  if (!reg) return res.status(404).json({ success: false, message: 'Registration not found' });

  const student = await getStudentProfileForUser(req.user);
  if (!student || student.id !== reg.studentId) {
    return res.status(403).json({ success: false, message: 'Forbidden: registration does not belong to authenticated user' });
  }

  return res.status(200).json({ success: true, data: reg });
});

exports.getAdminPayments = catchAsync(async (req, res) => {
  const { page = 1, limit = 50 } = req.query;
  const offset = (page - 1) * limit;
  const result = await QuizRegistration.findAndCountAll({ order: [['createdAt', 'DESC']], limit: Number(limit), offset: Number(offset) });
  return res.status(200).json({ success: true, data: result.rows, meta: { page: Number(page), limit: Number(limit), total: result.count } });
});

exports.getAdminPaymentById = catchAsync(async (req, res) => {
  const reg = await findRegistrationById(req.params.id);
  if (!reg) return res.status(404).json({ success: false, message: 'Payment not found' });
  return res.status(200).json({ success: true, data: reg });
});

exports.getInvoice = catchAsync(async (req, res) => {
  const reg = await findRegistrationById(req.params.id);
  if (!reg) return res.status(404).send('Not found');
  // allow only owner or admin
  const student = await getStudentProfileForUser(req.user);
  const isOwner = student && student.id === reg.studentId;
  const isAdmin = req.user && req.user.role === 'admin';
  if (!isOwner && !isAdmin) return res.status(403).send('Forbidden');

  const invoiceHtml = `<!doctype html><html><head><meta charset="utf-8"><title>Invoice ${reg.invoiceNumber || reg.id}</title></head><body><h1>Invoice</h1><p>Invoice: ${reg.invoiceNumber || reg.id}</p><p>Student: ${reg.studentId}</p><p>Quiz: ${reg.quizExamId}</p><p>Amount: ${reg.amount || ''} ${reg.currency || ''}</p><p>Status: ${reg.paymentStatus}</p><p>Date: ${reg.paymentCompletedAt || reg.createdAt}</p></body></html>`;
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Disposition', `attachment; filename="invoice-${reg.id}.html"`);
  return res.send(invoiceHtml);
});
