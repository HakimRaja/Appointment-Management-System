const nodemailer = require('nodemailer');
var transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "b9e793c2374ea9",
    pass: "7460657e3e4eaf",
  },
});
const sender = {
  address: process.env.MAILTRAP_FROM_EMAIL,
  name: process.env.MAILTRAP_FROM_NAME,
};
const sendCancelationEmail = async (to, subject, html) => {
  try {
    await transport.sendMail({
      from: sender,
      to,
      subject,
      html,
      category: "Appointment Cancelled",
    });
  } catch (error) {
    console.log("Email send error:", error);
  }
};

module.exports = sendCancelationEmail;
