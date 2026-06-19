const { InternshipNote, InternshipApplication, InternshipHistory, User } = require('../models');
const catchAsync = require('../utils/catchAsync');
const { getPagination } = require('../utils/apiQuery');
const { recordAudit } = require('../utils/auditLogger');

const attachCreatedBy = (items) => items.map((item) => {
  const json = item.toJSON ? item.toJSON() : item;
  return {
    ...json,
    createdBy: item.User?.name || item.User?.email || null,
  };
});

exports.getNotes = catchAsync(async (req, res) => {
  const applicationId = req.params.applicationId;
  const application = await InternshipApplication.findByPk(applicationId);
  if (!application) {
    return res.status(404).json({ success: false, message: 'Application not found' });
  }

  const { page, limit, offset } = getPagination(req.query);
  const where = { applicationId };

  if (req.query.noteType) where.noteType = req.query.noteType;

  const result = await InternshipNote.findAndCountAll({
    where,
    include: [{ model: User, attributes: ['id', 'email', 'name'] }],
    order: [['createdAt', 'DESC']],
    limit,
    offset,
  });

  return res.status(200).json({
    success: true,
    data: attachCreatedBy(result.rows),
    meta: { page, limit, total: result.count, totalPages: Math.ceil(result.count / limit) || 1 },
  });
});

exports.createNote = catchAsync(async (req, res) => {
  const { applicationId } = req.params;
  const { content, noteType = 'GENERAL', isPrivate = true } = req.body;

  const application = await InternshipApplication.findByPk(applicationId);
  if (!application) {
    return res.status(404).json({ success: false, message: 'Application not found' });
  }

  if (!content || !content.trim()) {
    return res.status(400).json({ success: false, message: 'Content cannot be empty', errors: [] });
  }

  const note = await InternshipNote.create({
    applicationId,
    userId: req.admin?.id || null,
    noteType,
    content,
    isPrivate,
  });

  await recordAudit({
    userId: req.admin?.id || null,
    action: 'CREATE',
    entityType: 'InternshipNote',
    entityId: note.id,
    newValue: note.toJSON(),
    ipAddress: req.ip,
  });

  const noteWithUser = await note.reload({
    include: [{ model: User, attributes: ['id', 'email', 'name'] }],
  });

  return res.status(201).json({ success: true, data: attachCreatedBy([noteWithUser])[0] });
});

exports.updateNote = catchAsync(async (req, res) => {
  const { applicationId, noteId } = req.params;
  const { content, noteType, isPrivate } = req.body;

  const note = await InternshipNote.findOne({
    where: { id: noteId, applicationId },
  });

  if (!note) {
    return res.status(404).json({ success: false, message: 'Note not found' });
  }

  const oldValue = note.toJSON();
  if (content) note.content = content;
  if (noteType) note.noteType = noteType;
  if (isPrivate !== undefined) note.isPrivate = isPrivate;

  await note.save();

  await recordAudit({
    userId: req.admin?.id || null,
    action: 'UPDATE',
    entityType: 'InternshipNote',
    entityId: note.id,
    oldValue,
    newValue: note.toJSON(),
    ipAddress: req.ip,
  });

  const noteWithUser = await note.reload({
    include: [{ model: User, attributes: ['id', 'email', 'name'] }],
  });

  return res.status(200).json({ success: true, data: attachCreatedBy([noteWithUser])[0] });
});

exports.deleteNote = catchAsync(async (req, res) => {
  const { applicationId, noteId } = req.params;

  const note = await InternshipNote.findOne({
    where: { id: noteId, applicationId },
  });

  if (!note) {
    return res.status(404).json({ success: false, message: 'Note not found' });
  }

  const oldValue = note.toJSON();
  await note.destroy();

  await recordAudit({
    userId: req.admin?.id || null,
    action: 'DELETE',
    entityType: 'InternshipNote',
    entityId: note.id,
    oldValue,
    newValue: null,
    ipAddress: req.ip,
  });

  return res.status(200).json({ success: true, message: 'Note deleted' });
});

exports.getHistory = catchAsync(async (req, res) => {
  const { applicationId } = req.params;
  const { page, limit, offset } = getPagination(req.query);

  const application = await InternshipApplication.findByPk(applicationId);
  if (!application) {
    return res.status(404).json({ success: false, message: 'Application not found' });
  }

  const result = await InternshipHistory.findAndCountAll({
    where: { applicationId },
    include: [{ model: User, attributes: ['id', 'email', 'name'] }],
    order: [['createdAt', 'DESC']],
    limit,
    offset,
  });

  return res.status(200).json({
    success: true,
    data: attachCreatedBy(result.rows),
    meta: { page, limit, total: result.count, totalPages: Math.ceil(result.count / limit) || 1 },
  });
});
