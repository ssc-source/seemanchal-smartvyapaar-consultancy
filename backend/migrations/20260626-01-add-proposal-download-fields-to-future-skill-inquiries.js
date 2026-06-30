module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('future_skill_inquiries', 'proposal_downloaded', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
    await queryInterface.addColumn('future_skill_inquiries', 'proposal_downloaded_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('future_skill_inquiries', 'proposal_download_count', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('future_skill_inquiries', 'proposal_downloaded');
    await queryInterface.removeColumn('future_skill_inquiries', 'proposal_downloaded_at');
    await queryInterface.removeColumn('future_skill_inquiries', 'proposal_download_count');
  }
};
