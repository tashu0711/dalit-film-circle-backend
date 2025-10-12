const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Load .env explicitly (backup)
  require('dotenv').config();

  // Debug: Show what we're using
  console.log('\n📧 SMTP Configuration:');
  console.log('  Host:', process.env.EMAIL_HOST || '❌ undefined');
  console.log('  Port:', process.env.EMAIL_PORT || '❌ undefined');
  console.log('  User:', process.env.EMAIL_USER || '❌ undefined');
  console.log('  Pass:', process.env.EMAIL_PASS ? '✅ exists' : '❌ undefined');
  
  // Validate
  if (!process.env.EMAIL_HOST) {
    throw new Error('EMAIL_HOST not set in environment');
  }
  if (!process.env.EMAIL_USER) {
    throw new Error('EMAIL_USER not set in environment');
  }
  if (!process.env.EMAIL_PASS) {
    throw new Error('EMAIL_PASS not set in environment');
  }

  try {
    // Create transporter with explicit values
    const transporter = nodemailer.createTransport({
      host: String(process.env.EMAIL_HOST),
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: false, // false for port 587
      auth: {
        user: String(process.env.EMAIL_USER),
        pass: String(process.env.EMAIL_PASS)
      },
      tls: {
        rejectUnauthorized: false
      },
      debug: true, // Enable debug output
      logger: true // Log to console
    });

    console.log('\n🔍 Testing SMTP connection...');
    
    // Test connection
    await transporter.verify();
    console.log('✅ SMTP connection successful!\n');

    // Send email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html
    });

    console.log('✅ Email sent:', info.messageId);
    return info;

  } catch (error) {
    console.error('\n❌ Error details:', error);
    throw new Error(`Email failed: ${error.message}`);
  }
};

module.exports = sendEmail;