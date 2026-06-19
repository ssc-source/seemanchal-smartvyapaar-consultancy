const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { safeRoute } = require('../utils/blogSafe');

router.get('/', safeRoute(blogController.getAllPublishedBlogPosts));
router.get('/slug/:slug', safeRoute(blogController.getBlogPostBySlug));
router.get('/:id', safeRoute(blogController.getBlogPostById));
router.get('/related/:slug', safeRoute(blogController.getRelatedBlogPosts));
router.get('/category/:categoryId', safeRoute(blogController.getBlogPostsByCategory));
router.get('/tag/:tagId', safeRoute(blogController.getBlogPostsByTag));
router.get('/categories/list', safeRoute(blogController.getBlogCategories));
router.get('/tags/list', safeRoute(blogController.getBlogTags));
router.get('/metadata', safeRoute(blogController.getBlogMetadata));

module.exports = router;
