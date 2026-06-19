module.exports = {
  async up(queryInterface, Sequelize) {
    // Add columns to existing media table
    await queryInterface.addColumn('media', 'url', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('media', 'public_id', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('media', 'storage_provider', {
      type: Sequelize.ENUM('local', 'cloudinary'),
      allowNull: false,
      defaultValue: 'local',
    });

    await queryInterface.addColumn('media', 'folder', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('media', 'width', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn('media', 'height', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('media', 'height');
    await queryInterface.removeColumn('media', 'width');
    await queryInterface.removeColumn('media', 'folder');
    await queryInterface.removeColumn('media', 'storage_provider');
    await queryInterface.removeColumn('media', 'public_id');
    await queryInterface.removeColumn('media', 'url');
    // Drop ENUM type if necessary
    try {
      await queryInterface.sequelize.query("DROP TYPE IF EXISTS \"enum_media_storage_provider\";");
    } catch (e) {
      // ignore
    }
  }
};
