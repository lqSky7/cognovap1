const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const readline = require('readline');
require('dotenv').config();

const User = require('./models/user');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (question) => {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
};

const createInteractiveAdmin = async () => {
  try {
    console.log('🚀 Cognova P1 - Admin Account Setup');
    console.log('=====================================\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected\n');

    // Get admin details from user
    const email = await askQuestion('📧 Enter admin email: ');
    const username = await askQuestion('👤 Enter admin username: ');
    const password = await askQuestion('🔑 Enter admin password (min 6 chars): ');
    const firstName = await askQuestion('👤 Enter first name: ');
    const lastName = await askQuestion('👤 Enter last name: ');

    // Validation
    if (!email || !username || !password || !firstName || !lastName) {
      console.log('❌ All fields are required!');
      process.exit(1);
    }

    if (password.length < 6) {
      console.log('❌ Password must be at least 6 characters long!');
      process.exit(1);
    }

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.log('❌ User already exists with email:', email);
      process.exit(1);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Create admin user
    const adminUser = new User({
      user_id: uuidv4(),
      email,
      username,
      password_hash,
      first_name: firstName,
      last_name: lastName,
      is_active: true
    });

    await adminUser.save();
    
    console.log('\n✅ Admin user created successfully!');
    console.log('📧 Email:', email);
    console.log('👤 Username:', username);
    console.log('🆔 User ID:', adminUser.user_id);
    console.log('\n📝 IMPORTANT: Add this email to ADMIN_EMAILS in your .env file:');
    console.log(`   ADMIN_EMAILS=${email}`);
    console.log('\n🔐 You can now login with these credentials!');

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  } finally {
    rl.close();
    mongoose.connection.close();
  }
};

// Run the script
createInteractiveAdmin();
