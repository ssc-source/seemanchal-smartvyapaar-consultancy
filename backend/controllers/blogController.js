const { BlogPost, BlogCategory, BlogTag } = require('../models');
const catchAsync = require('../utils/catchAsync');
const { getPagination, buildOrder } = require('../utils/apiQuery');
const { Op } = require('sequelize');

exports.getAllPublishedBlogPosts = catchAsync(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const { search, category, tag, sortBy, sortOrder } = req.query;

  const where = { status: 'PUBLISHED' };

  // Search filter
  if (search && typeof search === 'string' && search.trim()) {
    where[Op.or] = [
      { title: { [Op.like]: `%${search}%` } },
      { excerpt: { [Op.like]: `%${search}%` } },
      { content: { [Op.like]: `%${search}%` } },
    ];
  }

  // Category filter
  if (category) {
    where.categoryId = category;
  }

  const result = await BlogPost.findAndCountAll({
    where,
    order: buildOrder(
      { sortBy: sortBy || 'publishedAt', sortOrder: sortOrder || 'DESC' },
      ['publishedAt', 'createdAt', 'title'],
      [['publishedAt', 'DESC']]
    ),
    limit,
    offset,
    include: [
      { model: BlogCategory, attributes: ['id', 'name', 'slug'] },
      { model: BlogTag, attributes: ['id', 'name', 'slug'], through: { attributes: [] } },
    ],
    attributes: {
      exclude: ['seoMetadataId'],
    },
  });

  res.status(200).json({
    success: true,
    data: result.rows,
    meta: { page, limit, total: result.count, totalPages: Math.ceil(result.count / limit) || 1 },
  });
});

exports.getBlogPostBySlug = catchAsync(async (req, res) => {
  const post = await BlogPost.findOne({
    where: {
      slug: req.params.slug,
      status: 'PUBLISHED',
    },
    include: [
      { model: BlogCategory, attributes: ['id', 'name', 'slug'] },
      { model: BlogTag, attributes: ['id', 'name', 'slug'], through: { attributes: [] } },
    ],
  });

  if (!post) {
    return res.status(404).json({ success: false, message: 'Blog post not found' });
  }

  res.status(200).json({ success: true, data: post });
});

exports.getBlogPostById = catchAsync(async (req, res) => {
  const post = await BlogPost.findOne({
    where: {
      id: req.params.id,
      status: 'PUBLISHED',
    },
    include: [
      { model: BlogCategory, attributes: ['id', 'name', 'slug'] },
      { model: BlogTag, attributes: ['id', 'name', 'slug'], through: { attributes: [] } },
    ],
  });

  if (!post) {
    return res.status(404).json({ success: false, message: 'Blog post not found' });
  }

  res.status(200).json({ success: true, data: post });
});

exports.getRelatedBlogPosts = catchAsync(async (req, res) => {
  const post = await BlogPost.findOne({
    where: { slug: req.params.slug, status: 'PUBLISHED' },
  });

  if (!post) {
    return res.status(404).json({ success: false, message: 'Blog post not found' });
  }

  // Get posts with same category or tags
  const related = await BlogPost.findAll({
    where: {
      id: { [Op.ne]: post.id },
      status: 'PUBLISHED',
      [Op.or]: [
        { categoryId: post.categoryId },
      ],
    },
    limit: 5,
    order: [['publishedAt', 'DESC']],
    include: [
      { model: BlogCategory, attributes: ['id', 'name', 'slug'] },
      { model: BlogTag, attributes: ['id', 'name', 'slug'], through: { attributes: [] } },
    ],
  });

  res.status(200).json({
    success: true,
    data: related,
    meta: { total: related.length },
  });
});

exports.getBlogPostsByCategory = catchAsync(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);

  const result = await BlogPost.findAndCountAll({
    where: {
      categoryId: req.params.categoryId,
      status: 'PUBLISHED',
    },
    order: [['publishedAt', 'DESC']],
    limit,
    offset,
    include: [
      { model: BlogCategory, as: 'BlogCategory', attributes: ['id', 'name', 'slug'] },
      { model: BlogTag, attributes: ['id', 'name', 'slug'], through: { attributes: [] } },
    ],
  });

  res.status(200).json({
    success: true,
    data: result.rows,
    meta: { page, limit, total: result.count, totalPages: Math.ceil(result.count / limit) || 1 },
  });
});

exports.getBlogPostsByTag = catchAsync(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);

  const result = await BlogPost.findAndCountAll({
    where: { status: 'PUBLISHED' },
    include: [
      {
        model: BlogTag,
        attributes: ['id'],
        where: { id: req.params.tagId },
        through: { attributes: [] },
      },
      { model: BlogCategory, attributes: ['id', 'name', 'slug'] },
    ],
    order: [['publishedAt', 'DESC']],
    limit,
    offset,
    attributes: ['id', 'title', 'slug', 'excerpt', 'featuredImage', 'authorName', 'publishedAt', 'readingTime'],
  });

  res.status(200).json({
    success: true,
    data: result.rows,
    meta: { page, limit, total: result.count, totalPages: Math.ceil(result.count / limit) || 1 },
  });
});

exports.getBlogCategories = catchAsync(async (req, res) => {
  const categories = await BlogCategory.findAll({
    attributes: ['id', 'name', 'slug'],
    order: [['name', 'ASC']],
  });

  res.status(200).json({
    success: true,
    data: categories,
    meta: { total: categories.length },
  });
});

exports.getBlogTags = catchAsync(async (req, res) => {
  const tags = await BlogTag.findAll({
    attributes: ['id', 'name', 'slug'],
    order: [['name', 'ASC']],
  });

  res.status(200).json({
    success: true,
    data: tags,
    meta: { total: tags.length },
  });
});

exports.getBlogMetadata = catchAsync(async (req, res) => {
  const totalPosts = await BlogPost.count({ where: { status: 'PUBLISHED' } });
  const categories = await BlogCategory.findAll({
    attributes: ['id', 'name', 'slug'],
    order: [['name', 'ASC']],
  });
  const tags = await BlogTag.findAll({
    attributes: ['id', 'name', 'slug'],
    order: [['name', 'ASC']],
  });

  res.status(200).json({
    success: true,
    data: {
      totalPosts,
      categories: categories.length,
      tags: tags.length,
    },
  });
});
