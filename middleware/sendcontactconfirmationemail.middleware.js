import nodemailer from "nodemailer";

export const sendContactConfirmationEmail = (
  userEmail,
  userName,
  userSubject,
  userMessage
) => {
  let config = {
    service: "gmail",
    auth: {
      user: process.env.googleEmail,
      pass: process.env.googlePassword,
    },
    tls: {
      rejectUnauthorized: false,
    },
  };
  let transporter = nodemailer.createTransport(config);

  let message = {
    from: `"${userName} <${userEmail}>" <${process.env.googleEmail}>`,
    to: process.env.RECEIVER_EMAIL,
    subject: userSubject,
    replyTo: userEmail,

    html: `
     <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${userSubject}</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f9;
        margin: 0;
        padding: 0;
        color: #333;
      }
      .email-container {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }
      .content {
        padding: 20px;
      }
      .content p {
        font-size: 16px;
        line-height: 1.5;
        margin-bottom: 20px;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="content">
        <p> ${userMessage}</p>
      </div>
    </div>
  </body>
</html>

`,
  };

  transporter.sendMail(message);
};
