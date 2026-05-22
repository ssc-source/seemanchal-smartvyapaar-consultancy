const { sendCareerApplicationEmail } = require("../utils/email");

exports.submitCareerApplication = async (req, res) => {
  try {
    const data = req.body;

    console.log("🟪 Career Application Received:", {
      name: data.fullName,
      email: data.email,
    });

    // SEND EMAIL
    await sendCareerApplicationEmail(data);

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
    });
  } catch (error) {
    console.error("Career Application Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit application",
    });
  }
};