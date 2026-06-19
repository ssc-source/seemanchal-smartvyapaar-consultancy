module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('blog_post_tags', {
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
      blog_tag_id: {
        type: Sequelize.UUID,
        allowNull: false,
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

    await queryInterface.addIndex('blog_post_tags', ['blog_post_id', 'blog_tag_id'], {
      unique: true,
      name: 'idx_blog_post_tags_post_tag',
    });

    await queryInterface.addConstraint('blog_post_tags', {
      fields: ['blog_post_id'],
      type: 'foreign key',
      name: 'fk_blog_post_tags_blog_post',
      references: {
        table: 'blog_posts',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('blog_post_tags', {
      fields: ['blog_tag_id'],
      type: 'foreign key',
      name: 'fk_blog_post_tags_blog_tag',
      references: {
        table: 'blog_tags',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('blog_post_tags', 'fk_blog_post_tags_blog_tag').catch(() => {});
    await queryInterface.removeConstraint('blog_post_tags', 'fk_blog_post_tags_blog_post').catch(() => {});
    await queryInterface.removeIndex('blog_post_tags', 'idx_blog_post_tags_post_tag').catch(() => {});
    await queryInterface.dropTable('blog_post_tags');
  },
};