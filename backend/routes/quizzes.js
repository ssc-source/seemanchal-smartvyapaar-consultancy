const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { requireAuth } = require('../middlewares/authMiddleware');

router.get('/', quizController.listQuizzes);
router.get('/:id', quizController.getQuiz);
// Require authentication for registration and attempts to prevent spoofing
// Allow registration by registration_id (no auth required) so users can register using business key from frontend
router.post('/:id/register', quizController.registerQuiz);
router.post('/:id/attempts', requireAuth, quizController.submitAttempt);

module.exports = router;
