const { Op } = require('sequelize');
const { QuizExam, QuizQuestion, QuizAttempt, QuizRegistration, StudentProfile } = require('../models');
const catchAsync = require('../utils/catchAsync');
const { getPagination, buildOrder } = require('../utils/apiQuery');
const { recordAudit } = require('../utils/auditLogger');

const normalizeQuestionPayload = (body, quizId) => {
  const questionText = body.question ?? body.questionText;
  const optionsFromBody = body.options;

  const resolveOptions = (input) => {
    if (Array.isArray(input)) return input.filter((value) => value !== undefined && value !== null && value !== '');
    if (input && typeof input === 'object') {
      return ['A', 'B', 'C', 'D'].map((key) => input[key] ?? input[key.toLowerCase()]).filter((value) => value !== undefined && value !== null && value !== '');
    }
    return [];
  };

  let options = resolveOptions(optionsFromBody);
  if (!options.length) {
    options = ['optionA', 'optionB', 'optionC', 'optionD']
      .map((key) => body[key])
      .filter((value) => value !== undefined && value !== null && value !== '');
  }

  return {
    quizExamId: quizId,
    questionText,
    questionType: body.questionType || 'single_choice',
    options: options.length ? options : null,
    correctAnswer: body.correctAnswer ?? body.correct_answer ?? null,
    marks: body.marks ?? 1,
  };
};

const formatQuestionForResponse = (question) => {
  const q = question.toJSON ? question.toJSON() : question;
  const optionsFromModel = Array.isArray(q.options)
    ? q.options
    : q.options && typeof q.options === 'object'
      ? ['A', 'B', 'C', 'D'].map((key) => q.options[key] ?? q.options[key.toLowerCase()]).filter((value) => value !== undefined && value !== null && value !== '')
      : [];

  return {
    id: q.id,
    question: q.questionText,
    questionText: q.questionText,
    questionType: q.questionType,
    optionA: optionsFromModel[0] ?? '',
    optionB: optionsFromModel[1] ?? '',
    optionC: optionsFromModel[2] ?? '',
    optionD: optionsFromModel[3] ?? '',
    options: optionsFromModel,
    correctAnswer: q.correctAnswer,
    marks: q.marks,
    createdAt: q.createdAt,
    updatedAt: q.updatedAt,
  };
};

exports.getAllQuizzes = catchAsync(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const where = {};

  if (req.query.status) where.status = req.query.status;
  if (req.query.q) {
    where[Op.or] = [
      { title: { [Op.like]: `%${req.query.q}%` } },
      { description: { [Op.like]: `%${req.query.q}%` } },
    ];
  }

  const result = await QuizExam.findAndCountAll({
    where,
    order: buildOrder(req.query, ['title', 'status', 'createdAt'], [['createdAt', 'DESC']]),
    limit,
    offset,
  });

  return res.status(200).json({
    success: true,
    data: result.rows,
    meta: { page, limit, total: result.count, totalPages: Math.ceil(result.count / limit) || 1 },
  });
});

exports.getQuiz = catchAsync(async (req, res) => {
  const quiz = await QuizExam.findByPk(req.params.id, {
    include: [{ model: QuizQuestion, attributes: ['id', 'questionText', 'questionType', 'options', 'correctAnswer', 'marks', 'createdAt', 'updatedAt'] }],
  });
  if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });
  const quizJson = quiz.toJSON();
  quizJson.QuizQuestions = (quizJson.QuizQuestions || []).map(formatQuestionForResponse);
  return res.status(200).json({ success: true, data: quizJson });
});

exports.createQuiz = catchAsync(async (req, res) => {
  const quiz = await QuizExam.create(req.body);
  await recordAudit({
    userId: req.admin?.id || null,
    action: 'CREATE',
    entityType: 'QuizExam',
    entityId: quiz.id,
    newValue: quiz.toJSON(),
    ipAddress: req.ip,
  });
  return res.status(201).json({ success: true, data: quiz });
});

exports.updateQuiz = catchAsync(async (req, res) => {
  const quiz = await QuizExam.findByPk(req.params.id);
  if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

  const oldValue = quiz.toJSON();
  Object.assign(quiz, req.body);
  await quiz.save();

  await recordAudit({
    userId: req.admin?.id || null,
    action: 'UPDATE',
    entityType: 'QuizExam',
    entityId: quiz.id,
    oldValue,
    newValue: quiz.toJSON(),
    ipAddress: req.ip,
  });

  return res.status(200).json({ success: true, data: quiz });
});

exports.deleteQuiz = catchAsync(async (req, res) => {
  const quiz = await QuizExam.findByPk(req.params.id);
  if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

  const oldValue = quiz.toJSON();
  await quiz.destroy();

  await recordAudit({
    userId: req.admin?.id || null,
    action: 'DELETE',
    entityType: 'QuizExam',
    entityId: quiz.id,
    oldValue,
    newValue: null,
    ipAddress: req.ip,
  });

  return res.status(200).json({ success: true, message: 'Quiz deleted' });
});

exports.getQuizQuestions = catchAsync(async (req, res) => {
  const quiz = await QuizExam.findByPk(req.params.id);
  if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

  const questions = await QuizQuestion.findAll({ where: { quizExamId: req.params.id }, order: [['createdAt', 'ASC']] });
  return res.status(200).json({ success: true, data: questions.map(formatQuestionForResponse) });
});

exports.createQuizQuestion = catchAsync(async (req, res) => {
  const quiz = await QuizExam.findByPk(req.params.id);
  if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

  const payload = normalizeQuestionPayload(req.body, req.params.id);
  const question = await QuizQuestion.create(payload);

  await recordAudit({
    userId: req.admin?.id || null,
    action: 'CREATE',
    entityType: 'QuizQuestion',
    entityId: question.id,
    newValue: question.toJSON(),
    ipAddress: req.ip,
  });

  return res.status(201).json({ success: true, data: formatQuestionForResponse(question) });
});

exports.updateQuizQuestion = catchAsync(async (req, res) => {
  const question = await QuizQuestion.findByPk(req.params.questionId);
  if (!question) return res.status(404).json({ success: false, message: 'Question not found' });

  const oldValue = question.toJSON();
  Object.assign(question, normalizeQuestionPayload(req.body, question.quizExamId));
  await question.save();

  await recordAudit({
    userId: req.admin?.id || null,
    action: 'UPDATE',
    entityType: 'QuizQuestion',
    entityId: question.id,
    oldValue,
    newValue: question.toJSON(),
    ipAddress: req.ip,
  });

  return res.status(200).json({ success: true, data: formatQuestionForResponse(question) });
});

exports.deleteQuizQuestion = catchAsync(async (req, res) => {
  const question = await QuizQuestion.findByPk(req.params.questionId);
  if (!question) return res.status(404).json({ success: false, message: 'Question not found' });

  const oldValue = question.toJSON();
  await question.destroy();

  await recordAudit({
    userId: req.admin?.id || null,
    action: 'DELETE',
    entityType: 'QuizQuestion',
    entityId: question.id,
    oldValue,
    newValue: null,
    ipAddress: req.ip,
  });

  return res.status(200).json({ success: true, message: 'Question deleted' });
});

exports.getQuizAttempts = catchAsync(async (req, res) => {
  const quiz = await QuizExam.findByPk(req.params.id);
  if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

  const { page, limit, offset } = getPagination(req.query);
  const result = await QuizAttempt.findAndCountAll({
    include: [{
      model: QuizRegistration,
      where: { quizExamId: req.params.id },
      include: [{ model: StudentProfile, attributes: ['id', 'name', 'email', 'track', 'batchId'] }],
    }],
    order: [['completedAt', 'DESC']],
    limit,
    offset,
  });

  return res.status(200).json({
    success: true,
    data: result.rows,
    meta: { page, limit, total: result.count, totalPages: Math.ceil(result.count / limit) || 1 },
  });
});
