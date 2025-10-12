// Signup confirmation email
exports.signupConfirmation = (name) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎬 Dalit Film Circle</h1>
        </div>
        <div class="content">
          <h2>Welcome, ${name}! 🎉</h2>
          <p>Thank you for registering with <strong>Dalit Film Circle</strong>.</p>
          <p>Your account has been created successfully and is currently <strong>pending admin approval</strong>.</p>
          
          <h3>What's Next?</h3>
          <ul>
            <li>Our admin team will review your profile within 24-48 hours</li>
            <li>You'll receive a confirmation email once approved</li>
            <li>After approval, you can login and access the directory</li>
          </ul>
          
          <p>If you have any questions, feel free to reach out to us.</p>
          
          <p><strong>Best regards,</strong><br>Dalit Film Circle Team</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Dalit Film Circle. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Admin notification email (new member signup)
exports.adminNewMemberNotification = (name, email, department, languages) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2d3748; color: white; padding: 20px; text-align: center; }
        .content { background: #fff; padding: 30px; border: 1px solid #e2e8f0; }
        .info-box { background: #f7fafc; padding: 15px; border-left: 4px solid #667eea; margin: 15px 0; }
        .button { display: inline-block; background: #48bb78; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>🔔 New Member Registration</h2>
        </div>
        <div class="content">
          <h3>New member awaiting approval</h3>
          
          <div class="info-box">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Department:</strong> ${department}</p>
            <p><strong>Languages:</strong> ${languages.join(', ')}</p>
          </div>
          
          <p>Please review and approve/reject this member from the admin dashboard.</p>
          
          <a href="${process.env.FRONTEND_URL}/admin/pending" class="button">Review Member</a>
          
          <p style="margin-top: 20px; font-size: 12px; color: #666;">
            This is an automated notification from Dalit Film Circle.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Approval confirmation email
exports.approvalConfirmation = (name) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .success-icon { font-size: 48px; text-align: center; margin: 20px 0; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎊 Congratulations!</h1>
        </div>
        <div class="content">
          <div class="success-icon">✅</div>
          <h2>Welcome to Dalit Film Circle, ${name}!</h2>
          
          <p>Great news! Your account has been <strong>approved</strong> by our admin team.</p>
          
          <h3>You can now:</h3>
          <ul>
            <li>✨ Access the complete filmmaker directory</li>
            <li>🔍 Search and connect with other members</li>
            <li>📝 Update your profile and portfolio</li>
            <li>🎬 Collaborate with fellow filmmakers</li>
          </ul>
          
          <a href="${process.env.FRONTEND_URL}/login" class="button">Login to Your Account</a>
          
          <p style="margin-top: 30px;">We're excited to have you as part of our community!</p>
          
          <p><strong>Best regards,</strong><br>Dalit Film Circle Team</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Dalit Film Circle. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Rejection notification email
exports.rejectionNotification = (name, reason = '') => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #e53e3e; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Application Update</h1>
        </div>
        <div class="content">
          <h2>Hello ${name},</h2>
          
          <p>Thank you for your interest in joining Dalit Film Circle.</p>
          
          <p>Unfortunately, we are unable to approve your application at this time.</p>
          
          ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
          
          <p>If you believe this was a mistake or have questions, please contact us at <a href="mailto:${process.env.EMAIL_USER}">${process.env.EMAIL_USER}</a></p>
          
          <p><strong>Best regards,</strong><br>Dalit Film Circle Team</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Dalit Film Circle. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};