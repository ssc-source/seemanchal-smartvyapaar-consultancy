module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('blog_posts', 'author_name', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('blog_posts', 'author_image', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('blog_posts', 'category_id', {
      type: Sequelize.UUID,
      allowNull: true,
    });

    await queryInterface.addColumn('blog_posts', 'meta_title', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('blog_posts', 'meta_description', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn('blog_posts', 'canonical_url', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('blog_posts', 'og_image', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('blog_posts', 'twitter_card', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('blog_posts', 'reading_time', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.changeColumn('blog_posts', 'status', {
      type: Sequelize.ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED'),
      allowNull: false,
      defaultValue: 'DRAFT',
    });

    await queryInterface.addConstraint('blog_posts', {
      fields: ['category_id'],
      type: 'foreign key',
      name: 'fk_blog_posts_category',
      references: {
        table: 'blog_categories',
        field: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('blog_posts', 'fk_blog_posts_category').catch(() => {});
    await queryInterface.removeColumn('blog_posts', 'reading_time').catch(() => {});
    await queryInterface.removeColumn('blog_posts', 'twitter_card').catch(() => {});
    await queryInterface.removeColumn('blog_posts', 'og_image').catch(() => {});
    await queryInterface.removeColumn('blog_posts', 'canonical_url').catch(() => {});
    await queryInterface.removeColumn('blog_posts', 'meta_description').catch(() => {});
    await queryInterface.removeColumn('blog_posts', 'meta_title').catch(() => {});
    await queryInterface.removeColumn('blog_posts', 'category_id').catch(() => {});
    await queryInterface.removeColumn('blog_posts', 'author_image').catch(() => {});
    await queryInterface.removeColumn('blog_posts', 'author_name').catch(() => {});
    await queryInterface.changeColumn('blog_posts', 'status', {
      type: Sequelize.ENUM('draft', 'review', 'published', 'archived'),
      allowNull: false,
      defaultValue: 'draft',
    });
  },
};