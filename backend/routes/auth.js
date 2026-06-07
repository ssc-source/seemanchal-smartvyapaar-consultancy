const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const { validate } = require('../middlewares/validate');
const { loginSchema, refreshSchema, changePasswordSchema } = require('../validators/schemas/auth');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts. Please try again later.', errors: [] },
});

router.post('/login', loginLimiter, validate(loginSchema), authController.login);
router.post('/logout', protect, authController.logout);
router.post('/refresh', validate(refreshSchema), authController.refresh);
router.get('/me', protect, authController.me);
router.post('/change-password', protect, validate(changePasswordSchema), authController.changePassword);

module.exports = router;
