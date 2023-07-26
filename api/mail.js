

const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
   service: "gmail",
   auth: {
      user: process.env.IMAP_USERNAME,
      pass: process.env.IMAP_PASSWORD,
   }
});


function send({ from, to, subject, text, html }) {

   return transport.sendMail({
      from: from || `ZGC Case Management System <${process.env.IMAP_USERNAME}>`,
      to,
      subject,
      text,
      html
   });
}

if (process.env.OFFLINE && process.env.NODE_ENV !== 'production') {
   send = function({ to, subject, text, html }) {
      console.log('======================================================================================');
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Body: ${text || html}`);
      console.log('======================================================================================');
   }
}

const mail = {
   send,
}

module.exports = mail;