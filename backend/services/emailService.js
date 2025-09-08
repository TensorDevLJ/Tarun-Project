const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendRegistrationConfirmation = async (userEmail, userName, registrationId) => {
  const msg = {
    to: userEmail,
    from: {
      email: process.env.FROM_EMAIL,
      name: process.env.FROM_NAME
    },
    subject: 'Registration Confirmation - JNTU-GV Certification Program',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #004080, #0066cc); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">JNTU-GV Certification Program</h1>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #004080;">Registration Confirmed!</h2>
          
          <p>Dear ${userName},</p>
          
          <p>Thank you for registering for the <strong>Certification in Emerging Technologies</strong> program at JNTU-GV.</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #004080; margin-top: 0;">Registration Details:</h3>
            <p><strong>Registration ID:</strong> ${registrationId}</p>
            <p><strong>Course:</strong> Certification in Emerging Technologies</p>
            <p><strong>Duration:</strong> 3 Months</p>
            <p><strong>Mode:</strong> Hybrid (Online + Offline)</p>
          </div>
          
          <p>Your application is currently under review. You will receive another email once your registration is approved by our admissions team.</p>
          
          <p>If you have any questions, please contact us at:</p>
          <ul>
            <li>Email: certifications@jntugv.edu.in</li>
            <li>Phone: +91-8922-248001</li>
          </ul>
          
          <p>Best regards,<br>
          <strong>JNTU-GV Admissions Team</strong></p>
        </div>
        
        <div style="background: #004080; padding: 20px; text-align: center; color: white;">
          <p style="margin: 0;">© 2024 JNTU-GV, Vizianagaram. All rights reserved.</p>
        </div>
      </div>
    `
  };

  try {
    await sgMail.send(msg);
    console.log('Registration confirmation email sent to:', userEmail);
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

const sendApprovalNotification = async (userEmail, userName, registrationId) => {
  const msg = {
    to: userEmail,
    from: {
      email: process.env.FROM_EMAIL,
      name: process.env.FROM_NAME
    },
    subject: 'Registration Approved - JNTU-GV Certification Program',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #28a745, #20c997); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">🎉 Registration Approved!</h1>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #28a745;">Congratulations ${userName}!</h2>
          
          <p>We're excited to inform you that your registration for the <strong>Certification in Emerging Technologies</strong> program has been approved!</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #004080; margin-top: 0;">Next Steps:</h3>
            <ol>
              <li>You will receive course materials and schedule details soon</li>
              <li>Join our WhatsApp group for updates and announcements</li>
              <li>Attend the orientation session (details will be shared)</li>
              <li>Your certificate will be available for download after course completion</li>
            </ol>
          </div>
          
          <p>Welcome to the JNTU-GV family! We look forward to your journey in emerging technologies.</p>
          
          <p>Best regards,<br>
          <strong>JNTU-GV Academic Team</strong></p>
        </div>
        
        <div style="background: #004080; padding: 20px; text-align: center; color: white;">
          <p style="margin: 0;">© 2024 JNTU-GV, Vizianagaram. All rights reserved.</p>
        </div>
      </div>
    `
  };

  try {
    await sgMail.send(msg);
    console.log('Approval notification email sent to:', userEmail);
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

module.exports = {
  sendRegistrationConfirmation,
  sendApprovalNotification
};