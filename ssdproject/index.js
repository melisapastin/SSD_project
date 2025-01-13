// index.js (Firebase Cloud Function)
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

exports.sendEmail = functions.https.onCall((data, context) => {
  const { to } = data;  // Ensure the 'to' field is passed in the request

  // Configure nodemailer transport
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-email-password',
    },
  });

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: to,  // Recipient's email
    subject: 'Test Email',
    text: 'This is a test email from Firebase.',
  };

  return transporter.sendMail(mailOptions)
    .then(() => {
      return { message: 'Email sent successfully!' };
    })
    .catch((error) => {
      throw new functions.https.HttpsError('internal', 'Email sending failed', error);
    });
});
