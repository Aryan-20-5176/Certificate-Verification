const mongoose = require('mongoose');
const Certificate = require('./src/models/Certificate');
require('dotenv').config();

const checkDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const certs = await Certificate.find({});
    console.log('--- Database Certificates ---');
    certs.forEach(c => {
      console.log(`ID: ${c.certificateId}, Name: ${c.studentName}, Email: ${c.email}`);
    });
    console.log('-----------------------------');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkDB();
