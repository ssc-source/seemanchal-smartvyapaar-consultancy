const express = require('express');
const router = express.Router();
const adminBlogPostController = require('../controllers/adminBlogPostController');
const adminBlogCategoryController = require('../controllers/adminBlogCategoryController');
const adminBlogTagController = require('../controllers/adminBlogTagController');
const { safeRoute } = require('../utils/blogSafe');
const { protect, requirePermission } = require('../middlewares/authMiddleware');
const { PERMISSIONS } = require('../security/permissions');

// Protect all admin blog routes
router.use(protect);

// Blog Categories Routes
router.route('/categories')
  .get(requirePermission(PERMISSIONS.BLOG_READ), safeRoute(adminBlogCategoryController.getAllBlogCategories))
  .post(requirePermission(PERMISSIONS.BLOG_WRITE), safeRoute(adminBlogCategoryController.createBlogCategory));

router.route('/categories/:id')
  .get(requirePermission(PERMISSIONS.BLOG_READ), safeRoute(adminBlogCategoryController.getBlogCategory))
  .put(requirePermission(PERMISSIONS.BLOG_WRITE), safeRoute(adminBlogCategoryController.updateBlogCategory))
  .delete(requirePermission(PERMISSIONS.BLOG_WRITE), safeRoute(adminBlogCategoryController.deleteBlogCategory));

// Blog Tags Routes
router.route('/tags')
  .get(requirePermission(PERMISSIONS.BLOG_READ), safeRoute(adminBlogTagController.getAllBlogTags))
  .post(requirePermission(PERMISSIONS.BLOG_WRITE), safeRoute(adminBlogTagController.createBlogTag));

router.route('/tags/:id')
  .get(requirePermission(PERMISSIONS.BLOG_READ), safeRoute(adminBlogTagController.getBlogTag))
  .put(requirePermission(PERMISSIONS.BLOG_WRITE), safeRoute(adminBlogTagController.updateBlogTag))
  .delete(requirePermission(PERMISSIONS.BLOG_WRITE), safeRoute(adminBlogTagController.deleteBlogTag));

// Blog Posts Routes
router.route('/')
  .get(requirePermission(PERMISSIONS.BLOG_READ), safeRoute(adminBlogPostController.getAllBlogPosts))
  .post(requirePermission(PERMISSIONS.BLOG_WRITE), safeRoute(adminBlogPostController.createBlogPost));

router.route('/:id')
  .get(requirePermission(PERMISSIONS.BLOG_READ), safeRoute(adminBlogPostController.getBlogPost))
  .put(requirePermission(PERMISSIONS.BLOG_WRITE), safeRoute(adminBlogPostController.updateBlogPost))
  .delete(requirePermission(PERMISSIONS.BLOG_WRITE), safeRoute(adminBlogPostController.deleteBlogPost));

// Publish/Archive Workflow Routes
router.route('/:id/publish')
  .post(requirePermission(PERMISSIONS.BLOG_PUBLISH), safeRoute(adminBlogPostController.publishBlogPost));

router.route('/:id/archive')
  .post(requirePermission(PERMISSIONS.BLOG_WRITE), safeRoute(adminBlogPostController.archiveBlogPost));

// Revisions Routes
router.route('/:id/revisions')
  .get(requirePermission(PERMISSIONS.BLOG_READ), safeRoute(adminBlogPostController.getBlogPostRevisions));

router.route('/:id/revisions/:revisionId')
  .get(requirePermission(PERMISSIONS.BLOG_READ), safeRoute(adminBlogPostController.getBlogPostRevision));

module.exports = router;
