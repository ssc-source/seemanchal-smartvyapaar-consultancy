const express = require('express');
const router = express.Router();
const adminQuizController = require('../controllers/adminQuizController');
const { protect, requirePermission } = require('../middlewares/authMiddleware');
const { PERMISSIONS } = require('../security/permissions');

router.use(protect);

router.route('/')
  .get(requirePermission(PERMISSIONS.QUIZZES_READ), adminQuizController.getAllQuizzes)
  .post(requirePermission(PERMISSIONS.QUIZZES_WRITE), adminQuizController.createQuiz);

router.route('/:id')
  .get(requirePermission(PERMISSIONS.QUIZZES_READ), adminQuizController.getQuiz)
  .put(requirePermission(PERMISSIONS.QUIZZES_WRITE), adminQuizController.updateQuiz)
  .delete(requirePermission(PERMISSIONS.QUIZZES_WRITE), adminQuizController.deleteQuiz);

router.route('/:id/questions')
  .get(requirePermission(PERMISSIONS.QUIZZES_READ), adminQuizController.getQuizQuestions)
  .post(requirePermission(PERMISSIONS.QUIZZES_WRITE), adminQuizController.createQuizQuestion);

router.route('/questions/:questionId')
  .put(requirePermission(PERMISSIONS.QUIZZES_WRITE), adminQuizController.updateQuizQuestion)
  .delete(requirePermission(PERMISSIONS.QUIZZES_WRITE), adminQuizController.deleteQuizQuestion);

router.route('/:id/attempts')
  .get(requirePermission(PERMISSIONS.QUIZZES_READ), adminQuizController.getQuizAttempts);

module.exports = router;
