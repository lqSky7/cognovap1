const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const User = require('./models/user');

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');

    // Admin user details
    const adminData = {
      email: 'admin@cognovap1.com',
      username: 'admin',
      password: 'Admin123!', // Change this to a secure password
      first_name: 'Admin',
      last_name: 'User'
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('❌ Admin user already exists with email:', adminData.email);
      process.exit(1);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(adminData.password, salt);

    // Create admin user
    const adminUser = new User({
      user_id: uuidv4(),
      email: adminData.email,
      username: adminData.username,
      password_hash,
      first_name: adminData.first_name,
      last_name: adminData.last_name,
      is_active: true
    });

    await adminUser.save();
    
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', adminData.email);
    console.log('🔑 Password:', adminData.password);
    console.log('🆔 User ID:', adminUser.user_id);
    console.log('');
    console.log('⚠️  IMPORTANT: Change the password after first login!');
    console.log('📝 Make sure to add this email to ADMIN_EMAILS in your .env file:');
    console.log(`   ADMIN_EMAILS=${adminData.email}`);

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

// Run the script
createAdminUser();
