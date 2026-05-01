const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.example.com',
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

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
  if (process.env.SMTP_DISABLED === 'true') {
    console.log('Email sending is disabled. Lead Data:', leadData);
    return true;
  }

  try {
    const transporter = createTransporter();
    
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@example.com';
    
    const info = await transporter.sendMail({
      from: `"SSC Website" <${fromEmail}>`,
      to: adminEmail,
      replyTo: leadData.email,
      subject: `New Lead: ${leadData.name} - ${leadData.serviceOfInterest || 'General Inquiry'}`,
      html: getAdminEmailTemplate(leadData),
    });

    console.log('Admin notification sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending admin email notification:', error);
    // Don't throw, we don't want to break the inquiry submission flow
    return false;
  }
};
