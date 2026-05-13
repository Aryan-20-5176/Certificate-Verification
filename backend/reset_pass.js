const mongoose = require('mongoose');
const User = require('./src/models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const resetPass = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Sunita@1976', salt);
    
    await User.findOneAndUpdate(
      { email: 'kaundalaryan2@gmail.com' },
      { password: hashedPassword }
    );
    
    console.log('Password updated successfully for kaundalaryan2@gmail.com');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

resetPass();
