const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find({});
    console.log('--- Registered Users ---');
    users.forEach(u => {
      console.log(`Email: ${u.email}, Role: ${u.role}`);
    });
    console.log('------------------------');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkUsers();
