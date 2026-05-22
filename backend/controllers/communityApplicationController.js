const {
  sendCommunityApplicationEmail,
} = require("../utils/email");

exports.submitCommunityApplication = async (req, res) => {

  try {

    const data = req.body;

    console.log("🟪 Community Application Received:", {
      name: data.fullName,
      email: data.email,
    });

    await sendCommunityApplicationEmail(data);

    return res.status(201).json({
      success: true,
      message: "Community application submitted successfully",
    });

  } catch (error) {

    console.error("❌ Community Application Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit application",
    });

  }

};