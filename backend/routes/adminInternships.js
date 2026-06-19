const express = require('express');
const router = express.Router();
const adminInternshipController = require('../controllers/adminInternshipController');
const adminInternshipNoteController = require('../controllers/adminInternshipNoteController');
const { upload } = require('../utils/resumeUpload');
const { protect, requirePermission } = require('../middlewares/authMiddleware');
const { PERMISSIONS } = require('../security/permissions');

router.use(protect);

router.route('/')
  .get(requirePermission(PERMISSIONS.INTERNSHIPS_READ), adminInternshipController.getAllApplications)
  .post(requirePermission(PERMISSIONS.INTERNSHIPS_WRITE), adminInternshipController.createApplication);

router.route('/:id')
  .get(requirePermission(PERMISSIONS.INTERNSHIPS_READ), adminInternshipController.getApplication)
  .put(requirePermission(PERMISSIONS.INTERNSHIPS_WRITE), adminInternshipController.updateApplication)
  .delete(requirePermission(PERMISSIONS.INTERNSHIPS_WRITE), adminInternshipController.deleteApplication);

// Resume management endpoints
router.route('/:id/resume')
  .get(requirePermission(PERMISSIONS.INTERNSHIPS_READ), adminInternshipController.getResume);

router.route('/:id/resume/download')
  .get(requirePermission(PERMISSIONS.INTERNSHIPS_READ), adminInternshipController.downloadResume);

router.route('/:id/resume/replace')
  .put(requirePermission(PERMISSIONS.INTERNSHIPS_WRITE), upload.single('resume'), adminInternshipController.replaceResume);

router.route('/:id/resume')
  .delete(requirePermission(PERMISSIONS.INTERNSHIPS_WRITE), adminInternshipController.deleteResume);

// Internship notes endpoints
router.route('/:applicationId/notes')
  .get(requirePermission(PERMISSIONS.INTERNSHIPS_READ), adminInternshipNoteController.getNotes)
  .post(requirePermission(PERMISSIONS.INTERNSHIPS_WRITE), adminInternshipNoteController.createNote);

router.route('/:applicationId/notes/:noteId')
  .put(requirePermission(PERMISSIONS.INTERNSHIPS_WRITE), adminInternshipNoteController.updateNote)
  .delete(requirePermission(PERMISSIONS.INTERNSHIPS_WRITE), adminInternshipNoteController.deleteNote);

// Internship history endpoint
router.route('/:applicationId/history')
  .get(requirePermission(PERMISSIONS.INTERNSHIPS_READ), adminInternshipNoteController.getHistory);

module.exports = router;
