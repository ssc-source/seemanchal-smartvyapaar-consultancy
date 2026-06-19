const fs = require("fs");
const path = require("path");
const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");
const QRCode = require("qrcode");

async function generateCertificate({
  certificateId,
  studentName,
  certificateType,
  verificationCode,
  issueDate,
  registrationId,
  internshipTitle = "Internship Program",
  score = null,
  grade = null,
}) {
  // -----------------------------
  // Load Template
  // -----------------------------
  const templatePath = path.join(
    __dirname,
    "..",
    "assets",
    "certificate-template.png"
  );

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template not found: ${templatePath}`);
  }

  const imageBytes = fs.readFileSync(templatePath);

  const pdfDoc = await PDFDocument.create();

  const templateImage = await pdfDoc.embedPng(imageBytes);

  const page = pdfDoc.addPage([
    templateImage.width,
    templateImage.height,
  ]);

  page.drawImage(templateImage, {
    x: 0,
    y: 0,
    width: templateImage.width,
    height: templateImage.height,
  });

  // -----------------------------
  // Fonts
  // -----------------------------
  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const pageWidth = page.getWidth();

  // -----------------------------
  // Helper
  // -----------------------------
  function drawCentered(text, y, size, font, color = rgb(0, 0, 0)) {
    if (!text) return;

    const width = font.widthOfTextAtSize(text, size);

    page.drawText(text, {
      x: (pageWidth - width) / 2,
      y,
      size,
      font,
      color,
    });
  }

  // -----------------------------
  // Main Content
  // -----------------------------

  drawCentered(
    "This certificate is presented to",
    1010,
    28,
    regular
  );

const upperName = (studentName || "").toUpperCase();

let nameSize = 75;
if (upperName.length > 22) nameSize = 60;
if (upperName.length > 30) nameSize = 48;
if (upperName.length > 38) nameSize = 36;

drawCentered(
  upperName,
  910,
  nameSize,
  bold,
  rgb(0.32, 0.60, 0.73)
);

  drawCentered(
    "In appreciation for your accomplishments in the company as a live project",
    810,
    28,
    regular
  );

  drawCentered(
    `intern position titled`,
    760,
    28,
    regular
  );

  drawCentered(
    `${internshipTitle}`,
    690,
    28,
    bold
  );

  drawCentered(
    `at Seemanchal SmartVyapaar Consultancy`,
    620,
    32,
    bold
  );

  let performanceText = "";

  if (score !== null && grade !== null) {
    performanceText =
      `He has secured ${score}% with Grade ${grade} ` +
      `as per his performance during the internship program.`;
  } else if (score !== null) {
    performanceText =
      `He has secured ${score}% during the internship program.`;
  } else if (grade !== null) {
    performanceText =
      `He has secured Grade ${grade} during the internship program.`;
  } else {
    performanceText =
      `Successfully completed the ${certificateType}.`;
  }

  drawCentered(
    performanceText,
    550,
    28,
    bold
  );

  drawCentered(
    "We take this opportunity to wish you a long, happy and successful career.",
    480,
    28,
    regular
  );

  drawCentered(
    `Issued on ${new Date(issueDate).toLocaleDateString("en-IN")}`,
    410,
    28,
    bold
  );

  // -----------------------------
  // QR Code
  // -----------------------------
  const verificationUrl =
    `${process.env.FRONTEND_URL || "http://localhost:3000"}` +
    `/career/certificate/verify/${certificateId}`;

  const qrData = await QRCode.toDataURL(verificationUrl);

  const qrImage = await pdfDoc.embedPng(
    Buffer.from(
      qrData.replace(/^data:image\/png;base64,/, ""),
      "base64"
    )
  );

  page.drawImage(qrImage, {
    x: 85,
    y: 140,
    width: 210,
    height: 210,
  });

  // -----------------------------
  // Footer Metadata
  // -----------------------------

  page.drawText(
    `Certificate ID: ${certificateId}`,
    {
      x: 55,
      y: 65,
      size: 24,
      font: bold,
      color: rgb(0, 0, 0),
    }
  );

  page.drawText(
    `Verification: ${verificationCode}`,
    {
      x: 520,
      y: 65,
      size: 24,
      font: bold,
      color: rgb(0, 0, 0),
    }
  );

  if (registrationId) {
    page.drawText(
      `Registration: ${registrationId}`,
      {
        x: pageWidth - 680,
        y: 65,
        size: 24,
        font: bold,
        color: rgb(0, 0, 0),
      }
    );
  }

  // -----------------------------
  // Save PDF
  // -----------------------------
  const outputDir = path.join(
    __dirname,
    "..",
    "public",
    "certificates"
  );

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(
    outputDir,
    `${certificateId}.pdf`
  );

  const pdfBytes = await pdfDoc.save();

  fs.writeFileSync(outputPath, pdfBytes);

  console.log(
    `Certificate PDF generated: /certificates/${certificateId}.pdf`
  );

  return {
    pdfUrl: `/certificates/${certificateId}.pdf`,
  };
}

module.exports = generateCertificate;