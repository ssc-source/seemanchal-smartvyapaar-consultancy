const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

console.log('🟧 [Email] Module loaded. Resend API key configured:', !!process.env.RESEND_API_KEY);

const getAdminEmailTemplate = (data) => {
  return `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #0f172a; color: #fff; padding: 20px; text-align: center;">
        <h2 style="margin: 0;">New Inquiry Received</h2>
        <p style="margin: 5px 0 0; color: #94a3b8;">Seemanchal SmartVyapaar Consultancy</p>
      </div>
      <div style="padding: 20px;">
        <h3 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-top: 0;">Lead Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; width: 35%;">Name:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">${data.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Email:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">
              <a href="mailto:${data.email}" style="color: #2563eb; text-decoration: none;">${data.email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Phone:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">${data.phone || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Company:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">${data.company || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Service of Interest:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">${data.serviceOfInterest || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Source:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">${data.source || 'Direct'}</td>
          </tr>
        </table>
        
        <h3 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-top: 30px;">Message</h3>
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; border: 1px solid #e2e8f0; white-space: pre-wrap;">${data.message || 'No message provided.'}</div>
        
        <div style="margin-top: 30px; text-align: center;">
          <a href="mailto:${data.email}?subject=Re: Your Inquiry with SSC" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold;">Reply to Lead</a>
        </div>
      </div>
      <div style="background-color: #f8fafc; padding: 15px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
        This is an automated notification from your website's contact form.
      </div>
    </div>
  `;
};

exports.sendAdminNotification = async (leadData) => {
  console.log('🟧 [Email] sendAdminNotification called', {
    name: leadData.name,
    email: leadData.email,
    timestamp: new Date().toISOString()
  });

  if (!process.env.RESEND_API_KEY) {
    console.warn('🟨 [Email] Resend API key not configured. Email will not be sent.');
    return false;
  }

  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const emailFrom = process.env.EMAIL_FROM || 'SSC Website <onboarding@resend.dev>';
    
    console.log('🟧 [Email] Sending email via Resend', {
      from: emailFrom,
      to: adminEmail,
      subject: `New Lead: ${leadData.name}`,
      timestamp: new Date().toISOString()
    });
    
    const result = await resend.emails.send({
      from: emailFrom,
      to: adminEmail,
      replyTo: leadData.email,
      subject: `New Lead: ${leadData.name} - ${leadData.serviceOfInterest || 'General Inquiry'}`,
      html: getAdminEmailTemplate(leadData),
    });

    if (result.error) {
      console.error('🟥 [Email] Resend API error:', result.error);
      return false;
    }

    console.log('🟢 [Email] Email sent successfully via Resend', {
      emailId: result.id,
      timestamp: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('🟥 [Email] Exception in sendAdminNotification:', error.message);
    return false;
  }
};

exports.sendCareerApplicationEmail = async (data) => {
  try {
    console.log("🟧 [Career Email] Sending application email");

    const html = `
      <div style="font-family: Arial; padding: 20px;">
        <h2>New Career Application</h2>

        <p><strong>Full Name:</strong> ${data.fullName}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Location:</strong> ${data.location}</p>

        <hr />

        <p><strong>College:</strong> ${data.college}</p>
        <p><strong>Degree:</strong> ${data.degree}</p>
        <p><strong>Graduation Year:</strong> ${data.graduationYear}</p>

        <hr />

        <p><strong>Applying For:</strong> ${data.role}</p>
        <p><strong>Internship Type:</strong> ${data.internshipType}</p>

        <hr />

        <p><strong>GitHub:</strong> ${data.github}</p>
        <p><strong>LinkedIn:</strong> ${data.linkedin}</p>
        <p><strong>Portfolio:</strong> ${data.portfolio}</p>

        <hr />

        <h3>Projects / Experience</h3>
        <p>${data.experience}</p>

        <h3>Why Join SSC?</h3>
        <p>${data.whyJoin}</p>
      </div>
    `;

    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: `New Career Application - ${data.fullName}`,
      html,
    });

    console.log("🟢 Career Application Email Sent:", response);

    return true;
  } catch (error) {
    console.error("Career Email Error:", error);
    return false;
  }
};

exports.sendCommunityApplicationEmail = async (data) => {

  try {

    console.log("🟧 Sending SSC Community Email");

    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">

        <h2 style="color:#2563eb;">
          New SSC Community Join Request
        </h2>

        <hr />

        <p><strong>Full Name:</strong> ${data.fullName}</p>

        <p><strong>Email:</strong> ${data.email}</p>

        <p><strong>Phone:</strong> ${data.phone}</p>

        <p><strong>Location:</strong> ${data.location}</p>

        <p><strong>Profession:</strong> ${data.profession}</p>

        <p><strong>Skills:</strong> ${data.skills}</p>

        <p><strong>LinkedIn:</strong> ${data.linkedin}</p>

        <p><strong>GitHub:</strong> ${data.github}</p>

        <hr />

        <h3>Why Join SSC Community?</h3>

        <p>${data.reason}</p>

      </div>
    `;

    const response = await resend.emails.send({

      from: process.env.EMAIL_FROM,

      to: process.env.ADMIN_EMAIL,

      subject: `New SSC Community Join Request - ${data.fullName}`,

      html,

    });

    console.log("🟢 Community Email Sent:", response);

    return true;

  } catch (error) {

    console.error("❌ Community Email Error:", error);

    return false;

  }

};