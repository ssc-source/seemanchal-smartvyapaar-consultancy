module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('blog_revisions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      blog_post_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      excerpt: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      featured_image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      author_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      author_image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED'),
        allowNull: false,
        defaultValue: 'DRAFT',
      },
      published_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      seo_metadata_id: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      category_id: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      tag_snapshot: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      meta_title: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      meta_description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      canonical_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      og_image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      twitter_card: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      reading_time: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addConstraint('blog_revisions', {
      fields: ['blog_post_id'],
      type: 'foreign key',
      name: 'fk_blog_revisions_blog_post',
      references: {
        table: 'blog_posts',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('blog_revisions', 'fk_blog_revisions_blog_post').catch(() => {});
    await queryInterface.dropTable('blog_revisions');
  },
};