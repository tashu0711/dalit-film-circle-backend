// Load .env at the very top
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

console.log('\n🧪 Email Test Starting...\n');
console.log('Current directory:', __dirname);
console.log('.env path:', path.join(__dirname, '../.env'));
console.log('');

// Check environment
console.log('Environment check:');
console.log('  EMAIL_HOST:', process.env.EMAIL_HOST || '❌ NOT FOUND');
console.log('  EMAIL_PORT:', process.env.EMAIL_PORT || '❌ NOT FOUND');
console.log('  EMAIL_USER:', process.env.EMAIL_USER || '❌ NOT FOUND');
console.log('  EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Found' : '❌ NOT FOUND');
console.log('');

if (!process.env.EMAIL_HOST) {
  console.error('❌ FATAL: .env file not loading properly!');
  console.error('\nPossible fixes:');
  console.error('1. Make sure .env file is in backend/ folder');
  console.error('2. Run: cd backend && node utils/testEmail.js');
  console.error('3. Check .env file name (not .env.txt)');
  process.exit(1);
}

const sendEmail = require('./sendEmail');

const testEmail = async () => {
  try {
    console.log('📤 Attempting to send test email...\n');
    
    await sendEmail({
      email: process.env.EMAIL_USER,
      subject: 'Test Email - Dalit Film Circle',
      message: 'Test successful!',
      html: '<h1>✅ Success!</h1><p>Email configuration working!</p>'
    });

    console.log('\n✅ TEST PASSED!');
    console.log('📬 Check inbox:', process.env.EMAIL_USER);
    console.log('');

  } catch (error) {
    console.error('\n❌ TEST FAILED!');
    console.error('Error:', error.message);
    console.error('');
  }
};

testEmail();