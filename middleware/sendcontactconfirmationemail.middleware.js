import nodemailer from "nodemailer";

export const sendContactConfirmationEmail = (userEmail, userName) => {
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
    from: process.env.googleEmail,
    to: userEmail,
    subject: "Confirmation: We Have Received Your Message",

    html: `
     <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Message Received</title>
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
      .header {
        background-color: #007bff;
        color: #fff;
        padding: 20px;
        text-align: center;
      }
      .content {
        padding: 20px;
      }
      .content h1 {
        font-size: 24px;
        margin-bottom: 20px;
        color: #007bff;
      }
      .content p {
        font-size: 16px;
        line-height: 1.5;
        margin-bottom: 20px;
      }
      .footer {
        text-align: center;
        padding: 20px;
        font-size: 12px;
        color: #777;
      }
      .button {
        display: inline-block;
        margin-top: 20px;
        padding: 10px 20px;
        background-color: #007bff;
        color: #fff;
        text-decoration: none;
        border-radius: 4px;
        transition: background-color 0.3s ease;
      }
      .button:hover {
        background-color: #0056b3;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <h1>Thank You!</h1>
      </div>
      <div class="content">
        <p>Dear ${userName},</p>
        <p>
          We have received your message and would like to thank you for
          contacting us. Our team is reviewing your inquiry and will get back to
          you as soon as possible. Your patience is appreciated.
        </p>
      </div>
      <div class="footer">
        <p>
          If you have any questions or would like to learn more about our
          projects, feel free to reach out to us. We look forward to staying
          connected with you.
        </p>
        <p>Best regards,</p>
        <p>The SICP Charity Portal Team</p>
      </div>
    </div>
  </body>
</html>

`,
  };

  transporter.sendMail(message);
};
