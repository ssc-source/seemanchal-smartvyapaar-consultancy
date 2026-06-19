const { BlogPost, BlogRevision, BlogCategory, BlogTag, BlogPostTag } = require('../models');
const catchAsync = require('../utils/catchAsync');
const { recordAudit } = require('../utils/auditLogger');
const { getPagination, buildSearchWhere, buildOrder } = require('../utils/apiQuery');
const { Op } = require('sequelize');

const calculateReadingTime = (content) => {
  if (!content) return null;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / 200); // Average 200 words per minute
};

const sanitizePayload = (body, userId) => ({
  title: body.title,
  slug: body.slug,
  content: body.content,
  excerpt: body.excerpt,
  featuredImage: body.featuredImage,
  authorName: body.authorName || null,
  authorImage: body.authorImage || null,
  authorId: userId || null,
  categoryId: body.categoryId || null,
  status: body.status || 'DRAFT',
  publishedAt: body.publishedAt || null,
  seoMetadataId: body.seoMetadataId || null,
  metaTitle: body.metaTitle || null,
  metaDescription: body.metaDescription || null,
  canonicalUrl: body.canonicalUrl || null,
  ogImage: body.ogImage || null,
  twitterCard: body.twitterCard || null,
  readingTime: calculateReadingTime(body.content),
});

const validatePost = (payload) => {
  const errors = [];
  if (!payload.title) errors.push('Title is required');
  if (!payload.slug) errors.push('Slug is required');
  if (!payload.content) errors.push('Content is required');
  if (payload.status && !['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(payload.status)) {
    errors.push('Invalid status');
  }
  return errors;
};

exports.getAllBlogPosts = catchAsync(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const result = await BlogPost.findAndCountAll({
    where: buildSearchWhere(req.query, ['title', 'slug', 'status']),
    order: buildOrder(req.query, ['createdAt', 'publishedAt', 'title'], [['createdAt', 'DESC']]),
    limit,
    offset,
    include: [
      { model: BlogCategory, attributes: ['id', 'name', 'slug'] },
      { model: BlogTag, attributes: ['id', 'name', 'slug'], through: { attributes: [] } },
    ],
  });

  res.status(200).json({
    success: true,
    data: result.rows,
    meta: { page, limit, total: result.count, totalPages: Math.ceil(result.count / limit) || 1 },
  });
});

exports.getBlogPost = catchAsync(async (req, res) => {
  const post = await BlogPost.findByPk(req.params.id, {
      include: [
        { model: BlogCategory, attributes: ['id', 'name', 'slug'] },
        { model: BlogTag, attributes: ['id', 'name', 'slug'], through: { attributes: [] } },
        { model: BlogRevision, attributes: ['id', 'createdAt', 'status'], order: [['createdAt', 'DESC']], limit: 10 },
      ],
  });

  if (!post) {
    return res.status(404).json({ success: false, message: 'Blog post not found' });
  }

  res.status(200).json({ success: true, data: post });
});

exports.createBlogPost = catchAsync(async (req, res) => {
  const payload = sanitizePayload(req.body, req.admin?.id);
  const errors = validatePost(payload);

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors });
  }

  // Check slug uniqueness
  const existing = await BlogPost.findOne({ where: { slug: payload.slug } });
  if (existing) {
    return res.status(409).json({ success: false, message: 'Slug already exists' });
  }

  const post = await BlogPost.create(payload);

  // Add tags if provided
  if (Array.isArray(req.body.tagIds) && req.body.tagIds.length > 0) {
    await post.addBlogTags(req.body.tagIds);
  }

  // Create initial revision
  const revision = await BlogRevision.create({
    blogPostId: post.id,
    title: post.title,
    slug: post.slug,
    content: post.content,
    excerpt: post.excerpt,
    featuredImage: post.featuredImage,
    authorName: post.authorName,
    authorImage: post.authorImage,
    status: post.status,
    publishedAt: post.publishedAt,
    seoMetadataId: post.seoMetadataId,
    categoryId: post.categoryId,
    metaTitle: post.metaTitle,
    metaDescription: post.metaDescription,
    canonicalUrl: post.canonicalUrl,
    ogImage: post.ogImage,
    twitterCard: post.twitterCard,
    readingTime: post.readingTime,
    tagSnapshot: req.body.tagIds || [],
  });

  await recordAudit({
    userId: req.admin?.id || null,
    action: 'CREATE',
    entityType: 'BlogPost',
    entityId: post.id,
    newValue: post.toJSON(),
    ipAddress: req.ip,
  });

  // Re-fetch with associations
  const postWithAssociations = await BlogPost.findByPk(post.id, {
      include: [
        { model: BlogCategory, attributes: ['id', 'name', 'slug'] },
        { model: BlogTag, attributes: ['id', 'name', 'slug'], through: { attributes: [] } },
      ],
  });

  res.status(201).json({ success: true, data: postWithAssociations });
});

exports.updateBlogPost = catchAsync(async (req, res) => {
  const post = await BlogPost.findByPk(req.params.id);

  if (!post) {
    return res.status(404).json({ success: false, message: 'Blog post not found' });
  }

  const oldValue = post.toJSON();
  const payload = sanitizePayload(req.body, req.admin?.id);
  const errors = validatePost(payload);

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors });
  }

  // Check slug uniqueness (if changed)
  if (payload.slug !== post.slug) {
    const existing = await BlogPost.findOne({
      where: { slug: payload.slug, id: { [Op.ne]: post.id } },
    });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Slug already exists' });
    }
  }

  await post.update(payload);

  // Update tags
  if (Array.isArray(req.body.tagIds)) {
    await post.setBlogTags(req.body.tagIds);
  }

  // Create new revision for tracking
  await BlogRevision.create({
    blogPostId: post.id,
    title: post.title,
    slug: post.slug,
    content: post.content,
    excerpt: post.excerpt,
    featuredImage: post.featuredImage,
    authorName: post.authorName,
    authorImage: post.authorImage,
    status: post.status,
    publishedAt: post.publishedAt,
    seoMetadataId: post.seoMetadataId,
    categoryId: post.categoryId,
    metaTitle: post.metaTitle,
    metaDescription: post.metaDescription,
    canonicalUrl: post.canonicalUrl,
    ogImage: post.ogImage,
    twitterCard: post.twitterCard,
    readingTime: post.readingTime,
    tagSnapshot: req.body.tagIds || [],
  });

  await recordAudit({
    userId: req.admin?.id || null,
    action: 'UPDATE',
    entityType: 'BlogPost',
    entityId: post.id,
    oldValue,
    newValue: post.toJSON(),
    ipAddress: req.ip,
  });

  const updatedPost = await BlogPost.findByPk(post.id, {
      include: [
        { model: BlogCategory, attributes: ['id', 'name', 'slug'] },
        { model: BlogTag, attributes: ['id', 'name', 'slug'], through: { attributes: [] } },
      ],
  });

  res.status(200).json({ success: true, data: updatedPost });
});

exports.publishBlogPost = catchAsync(async (req, res) => {
  const post = await BlogPost.findByPk(req.params.id);

  if (!post) {
    return res.status(404).json({ success: false, message: 'Blog post not found' });
  }

  if (post.status === 'PUBLISHED') {
    return res.status(400).json({ success: false, message: 'Post is already published' });
  }

  const oldValue = post.toJSON();
  const now = new Date();

  await post.update({
    status: 'PUBLISHED',
    publishedAt: post.publishedAt || now,
  });

  // Create revision to mark publication
  const tags = await post.getBlogTags({ attributes: ['id'] });
  await BlogRevision.create({
    blogPostId: post.id,
    title: post.title,
    slug: post.slug,
    content: post.content,
    excerpt: post.excerpt,
    featuredImage: post.featuredImage,
    authorName: post.authorName,
    authorImage: post.authorImage,
    status: 'PUBLISHED',
    publishedAt: now,
    seoMetadataId: post.seoMetadataId,
    categoryId: post.categoryId,
    metaTitle: post.metaTitle,
    metaDescription: post.metaDescription,
    canonicalUrl: post.canonicalUrl,
    ogImage: post.ogImage,
    twitterCard: post.twitterCard,
    readingTime: post.readingTime,
    tagSnapshot: tags.map(t => t.id),
  });

  await recordAudit({
    userId: req.admin?.id || null,
    action: 'PUBLISH',
    entityType: 'BlogPost',
    entityId: post.id,
    oldValue,
    newValue: post.toJSON(),
    ipAddress: req.ip,
  });

  const publishedPost = await BlogPost.findByPk(post.id, {
      include: [
        { model: BlogCategory, attributes: ['id', 'name', 'slug'] },
        { model: BlogTag, attributes: ['id', 'name', 'slug'], through: { attributes: [] } },
      ],
  });

  res.status(200).json({
    success: true,
    data: publishedPost,
    message: 'Blog post published successfully',
  });
});

exports.archiveBlogPost = catchAsync(async (req, res) => {
  const post = await BlogPost.findByPk(req.params.id);

  if (!post) {
    return res.status(404).json({ success: false, message: 'Blog post not found' });
  }

  const oldValue = post.toJSON();

  await post.update({ status: 'ARCHIVED' });

  await recordAudit({
    userId: req.admin?.id || null,
    action: 'ARCHIVE',
    entityType: 'BlogPost',
    entityId: post.id,
    oldValue,
    newValue: post.toJSON(),
    ipAddress: req.ip,
  });

  res.status(200).json({
    success: true,
    data: post,
    message: 'Blog post archived successfully',
  });
});

exports.deleteBlogPost = catchAsync(async (req, res) => {
  const post = await BlogPost.findByPk(req.params.id);

  if (!post) {
    return res.status(404).json({ success: false, message: 'Blog post not found' });
  }

  const oldValue = post.toJSON();
  await post.destroy();

  await recordAudit({
    userId: req.admin?.id || null,
    action: 'DELETE',
    entityType: 'BlogPost',
    entityId: post.id,
    oldValue,
    ipAddress: req.ip,
  });

  res.status(200).json({ success: true, message: 'Blog post deleted successfully' });
});

exports.getBlogPostRevisions = catchAsync(async (req, res) => {
  const post = await BlogPost.findByPk(req.params.id);

  if (!post) {
    return res.status(404).json({ success: false, message: 'Blog post not found' });
  }

  const revisions = await BlogRevision.findAll({
    where: { blogPostId: req.params.id },
    order: [['createdAt', 'DESC']],
  });

  res.status(200).json({
    success: true,
    data: revisions,
    meta: { total: revisions.length },
  });
});

exports.getBlogPostRevision = catchAsync(async (req, res) => {
  const revision = await BlogRevision.findByPk(req.params.revisionId);

  if (!revision) {
    return res.status(404).json({ success: false, message: 'Revision not found' });
  }

  res.status(200).json({ success: true, data: revision });
});
