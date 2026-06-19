module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('quiz_registrations', 'amount', { type: Sequelize.DECIMAL(10,2), allowNull: true });
    await queryInterface.addColumn('quiz_registrations', 'currency', { type: Sequelize.STRING, allowNull: true, defaultValue: 'INR' });
    await queryInterface.addColumn('quiz_registrations', 'payment_gateway', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.addColumn('quiz_registrations', 'gateway_order_id', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.addColumn('quiz_registrations', 'gateway_payment_id', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.addColumn('quiz_registrations', 'gateway_signature', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.addColumn('quiz_registrations', 'payment_completed_at', { type: Sequelize.DATE, allowNull: true });
    await queryInterface.addColumn('quiz_registrations', 'invoice_number', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.addColumn('quiz_registrations', 'refund_status', { type: Sequelize.ENUM('none','requested','processed','failed'), allowNull: false, defaultValue: 'none' });
    await queryInterface.addColumn('quiz_registrations', 'refund_reason', { type: Sequelize.TEXT, allowNull: true });
    await queryInterface.addColumn('quiz_registrations', 'metadata', { type: Sequelize.JSON, allowNull: true });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('quiz_registrations', 'amount');
    await queryInterface.removeColumn('quiz_registrations', 'currency');
    await queryInterface.removeColumn('quiz_registrations', 'payment_gateway');
    await queryInterface.removeColumn('quiz_registrations', 'gateway_order_id');
    await queryInterface.removeColumn('quiz_registrations', 'gateway_payment_id');
    await queryInterface.removeColumn('quiz_registrations', 'gateway_signature');
    await queryInterface.removeColumn('quiz_registrations', 'payment_completed_at');
    await queryInterface.removeColumn('quiz_registrations', 'invoice_number');
    await queryInterface.removeColumn('quiz_registrations', 'refund_status');
    await queryInterface.removeColumn('quiz_registrations', 'refund_reason');
    await queryInterface.removeColumn('quiz_registrations', 'metadata');
  }
};
