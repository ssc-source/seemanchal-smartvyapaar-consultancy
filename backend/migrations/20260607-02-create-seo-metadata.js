"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('seo_metadata', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('(UUID())'),
        primaryKey: true,
        allowNull: false,
      },
      page_key: { type: Sequelize.STRING, allowNull: false, unique: true },
      title: { type: Sequelize.STRING, allowNull: true },
      description: { type: Sequelize.TEXT, allowNull: true },
      canonical_url: { type: Sequelize.STRING, allowNull: true },
      og_title: { type: Sequelize.STRING, allowNull: true },
      og_description: { type: Sequelize.TEXT, allowNull: true },
      og_image: { type: Sequelize.STRING, allowNull: true },
      robots: { type: Sequelize.STRING, allowNull: true },
      structured_data: { type: Sequelize.JSON, allowNull: true },
      status: { type: Sequelize.ENUM('draft','published'), allowNull: false, defaultValue: 'published' },
      display_order: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('seo_metadata');
  },
};
