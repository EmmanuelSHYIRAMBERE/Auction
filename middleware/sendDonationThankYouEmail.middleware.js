import nodemailer from "nodemailer";

export const sendDonationThankYouEmail = async (userEmail, userFullName) => {
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
    subject: "Thank You for Donation - SICP Charity Portal!",

    html: `
     <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Thank You for Your Donation</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        align-items: center;
        justify-content: center;
        margin: 0;
        padding: 0;
        background-color: #fdf7f6;
      }

      .outer-container {
        margin: 0 auto 20px;
        width: 60%;
      }

      .contents {
        text-align: left;
        background-color: #f0f0f0;
        padding: 20px;
        border-radius: 2px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      .heading {
        color: #fff;
        background-color: #13544e;
        width: 100%;
        border-radius: 2px;
        padding: 2px;
        margin-top: 0;
        text-align: center;
      }

      p {
        color: #666;
      }

      .footer {
        margin-top: 20px;
        text-align: center;
        color: #999;
      }
    </style>
  </head>
  <body>
    <div class="outer-container">
      <div class="heading">
        <h1>Thank You for Your Donation</h1>
      </div>
      <div class="contents">
        <p>Hi ${userFullName ? userFullName : ""}!,</p>
        <p>
          We want to express our deepest gratitude for your generous donation. Your support means the world to us and your contribution will make a significant impact to achieve our mission. 
        </p>
        <p>
 Should you have any questions or want to learn more, feel free to reach out to us. We look forward to staying
          connected with you.        </p>
      </div>
      <div class="footer">
        <p>Best regards,</p>
        <p>The SICP Charity Portal Team</p>
      </div>
    </div>
  </body>
</html>
`,
  };

  await transporter.sendMail(message);
};
