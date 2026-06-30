const { Op } = require('sequelize');
const { FutureSkillInquiry } = require('../models');
const generateProposalPDF = require('../utils/proposalGenerator');
const catchAsync = require('../utils/catchAsync');
const { validationResult } = require('express-validator');

exports.generateProposal = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { principalName, schoolName, email, phone, schoolAddress } = req.body;

  // Search by Email OR Phone
  let inquiry = await FutureSkillInquiry.findOne({
    where: {
      [Op.or]: [
        { email: email.trim() },
        { phone: phone.trim() }
      ]
    }
  });

  // Parse city and state from address as best effort
  const addressParts = schoolAddress.split(',').map(p => p.trim());
  let city = 'Araria';
  let state = 'Bihar';
  if (addressParts.length >= 2) {
    state = addressParts[addressParts.length - 1];
    city = addressParts[addressParts.length - 2];
  } else if (addressParts.length === 1 && addressParts[0]) {
    city = addressParts[0];
  }

  if (inquiry) {
    // Found: Update proposal downloaded flags
    inquiry.proposalDownloaded = true;
    inquiry.proposalDownloadedAt = new Date();
    inquiry.proposalDownloadCount += 1;

    // Update missing school details if empty
    if (!inquiry.schoolName) inquiry.schoolName = schoolName.trim();
    if (!inquiry.principalName) inquiry.principalName = principalName.trim();
    
    // Store/append address in message/notes if not already present
    const addressStr = `School Address: ${schoolAddress.trim()}`;
    if (!inquiry.message) {
      inquiry.message = addressStr;
    } else if (!inquiry.message.includes('School Address:')) {
      inquiry.message = `${inquiry.message}\n${addressStr}`;
    }

    if (!inquiry.city || inquiry.city === 'Araria') inquiry.city = city;
    if (!inquiry.state || inquiry.state === 'Bihar') inquiry.state = state;

    await inquiry.save();
  } else {
    // Not found: Create new record
    inquiry = await FutureSkillInquiry.create({
      schoolName: schoolName.trim(),
      principalName: principalName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      boardType: 'cbse', // default board type
      city,
      state,
      message: `School Address: ${schoolAddress.trim()}`,
      status: 'new',
      source: 'proposal_download',
      proposalDownloaded: true,
      proposalDownloadedAt: new Date(),
      proposalDownloadCount: 1,
    });
  }

  // Generate the personalized PDF
  const pdfBytes = await generateProposalPDF({
    principalName: principalName.trim(),
    schoolName: schoolName.trim(),
    schoolAddress: schoolAddress.trim()
  });

  // Stream PDF back to client
  const filename = `${schoolName.trim().replace(/[^a-zA-Z0-9]/g, '_')}_Future_Skills_Proposal.pdf`;
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  return res.send(Buffer.from(pdfBytes));
});
