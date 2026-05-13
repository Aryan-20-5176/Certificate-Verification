const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  console.log(`Attempting to send email to: ${options.email}...`);
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"CertiVerify Portal" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('Nodemailer info:', info.response);
};

module.exports = sendEmail;
