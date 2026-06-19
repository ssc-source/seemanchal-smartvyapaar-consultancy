const express = require('express');
const router = express.Router();
const adminStudentController = require('../controllers/adminStudentController');
const { protect, requirePermission } = require('../middlewares/authMiddleware');
const { PERMISSIONS } = require('../security/permissions');

router.use(protect);

router.route('/')
  .get(requirePermission(PERMISSIONS.STUDENTS_READ), adminStudentController.getAllStudents)
  .post(requirePermission(PERMISSIONS.STUDENTS_WRITE), adminStudentController.createStudent);

router.route('/:id')
  .get(requirePermission(PERMISSIONS.STUDENTS_READ), adminStudentController.getStudent)
  .put(requirePermission(PERMISSIONS.STUDENTS_WRITE), adminStudentController.updateStudent)
  .delete(requirePermission(PERMISSIONS.STUDENTS_WRITE), adminStudentController.deleteStudent);

module.exports = router;
