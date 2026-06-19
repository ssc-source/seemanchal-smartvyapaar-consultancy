const catchAsync = require('../utils/catchAsync');
const { QuizRegistration, Certificate, QuizExam, StudentProfile, QuizAttempt } = require('../models');
const { Op } = require('sequelize');

exports.getSummary = catchAsync(async (req, res) => {
  const todayStart = new Date();
  todayStart.setHours(0,0,0,0);
  const monthStart = new Date();
  monthStart.setDate(1); monthStart.setHours(0,0,0,0);

  const totalRevenueResult = await QuizRegistration.sum('amount', { where: { paymentStatus: 'paid' } });
  const todaysRevenue = await QuizRegistration.sum('amount', { where: { paymentStatus: 'paid', paymentCompletedAt: { [Op.gte]: todayStart } } });
  const monthlyRevenue = await QuizRegistration.sum('amount', { where: { paymentStatus: 'paid', paymentCompletedAt: { [Op.gte]: monthStart } } });
  const paidCount = await QuizRegistration.count({ where: { paymentStatus: 'paid' } });
  const refundCount = await QuizRegistration.count({ where: { refundStatus: 'processed' } });
  const certCount = await Certificate.count();

  // build last 30 days timeseries
  const timeseries = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0,0,0,0);
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    const daySum = await QuizRegistration.sum('amount', { where: { paymentStatus: 'paid', paymentCompletedAt: { [Op.gte]: d, [Op.lt]: next } } });
    timeseries.push({ date: d.toISOString().slice(0,10), amount: daySum || 0 });
  }

  return res.status(200).json({ success: true, data: { totalRevenue: totalRevenueResult || 0, todaysRevenue: todaysRevenue || 0, monthlyRevenue: monthlyRevenue || 0, paidCount, refundCount, certCount, timeseries } });
});

exports.listPayments = catchAsync(async (req, res) => {
  const { page = 1, limit = 50, paymentStatus, search } = req.query;
  const offset = (page - 1) * limit;

  const where = {};
  if (paymentStatus) {
    where.paymentStatus = paymentStatus;
  }

  const include = [
    {
      model: StudentProfile,
      attributes: ['id', 'name', 'email', 'phone', 'track'],
      where: search ? {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } }
        ]
      } : undefined
    },
    { model: QuizExam, attributes: ['id', 'title'] },
    { model: QuizAttempt, as: 'attempts', attributes: ['id', 'score', 'passed', 'createdAt'] }
  ];

  const result = await QuizRegistration.findAndCountAll({
    where,
    include,
    order: [['createdAt', 'DESC']],
    limit: Number(limit),
    offset: Number(offset)
  });

  return res.status(200).json({ success: true, data: result.rows, meta: { page: Number(page), limit: Number(limit), total: result.count } });
});

exports.exportPayments = catchAsync(async (req, res) => {
  // Simple CSV export
  const rows = await QuizRegistration.findAll({ where: { paymentStatus: 'paid' }, order: [['createdAt', 'DESC']] });
  const header = 'id,studentId,quizExamId,amount,currency,paymentGateway,gatewayOrderId,gatewayPaymentId,paymentCompletedAt,createdAt';
  const csv = [header].concat(rows.map(r => `${r.id},${r.studentId},${r.quizExamId},${r.amount || ''},${r.currency || ''},${r.paymentGateway || ''},${r.gatewayOrderId || ''},${r.gatewayPaymentId || ''},${r.paymentCompletedAt || ''},${r.createdAt}`)).join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="payments.csv"');
  return res.send(csv);
});
