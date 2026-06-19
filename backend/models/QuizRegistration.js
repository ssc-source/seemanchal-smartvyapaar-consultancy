const { DataTypes } = require('sequelize');
const crypto = require('crypto');
const sequelize = require('../config/database');

const QuizRegistration = sequelize.define('QuizRegistration', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  registrationId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    defaultValue: () => `SSC-REG-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
    field: 'registration_id',
  },
  studentId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'student_id',
  },
  quizExamId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'quiz_exam_id',
  },
  status: {
    type: DataTypes.ENUM('pending', 'activated', 'completed', 'cancelled'),
    allowNull: false,
    defaultValue: 'pending',
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'paid', 'failed'),
    allowNull: false,
    defaultValue: 'pending',
    field: 'payment_status',
  },
  paymentReference: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'payment_reference',
  },
  amount: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: true,
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'INR',
  },
  paymentGateway: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'payment_gateway',
  },
  gatewayOrderId: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'gateway_order_id',
  },
  gatewayPaymentId: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'gateway_payment_id',
  },
  gatewaySignature: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'gateway_signature',
  },
  paymentCompletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'payment_completed_at',
  },
  invoiceNumber: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'invoice_number',
  },
  refundStatus: {
    type: DataTypes.ENUM('none','requested','processed','failed'),
    allowNull: false,
    defaultValue: 'none',
    field: 'refund_status',
  },
  refundReason: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'refund_reason',
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  registeredAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'registered_at',
  },
  activatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'activated_at',
  },
}, {
  tableName: 'quiz_registrations',
  underscored: true,
  timestamps: true,
});

module.exports = QuizRegistration;
