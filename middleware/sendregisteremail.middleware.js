import nodemailer from "nodemailer";

export const sendWelcomeEmail = (userEmail, userFullName) => {
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
    subject: "Welcome to the Auction Portal! Your Journey Begins",

    html: `
     <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to the Auction Portal</title>
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
        <h1>Welcome to the Auction Portal</h1>
      </div>
      <div class="contents">
        <p>Hi ${userFullName ? userFullName.split(" ")[0] : "there"}!,</p>
        <p>
          Congratulations on joining the Auction Portal! We're excited to
          welcome you to our vibrant community of auction enthusiasts.
        </p>
        <p>
          By becoming a member, you gain access to a world of exciting
          opportunities and unique items to bid on. Whether you're a collector,
          investor, or simply curious about the auction experience, our platform
          offers something special for everyone.
        </p>
        <p>
          <br />
          If you have any questions or need assistance, feel free to contact our
          support team. We're here to ensure your journey with us is seamless
          and enjoyable.
        </p>
      </div>
      <div class="footer">
        <p>Best regards,</p>
        <p>The Auction Portal Team</p>
      </div>
    </div>
  </body>
</html>
`,
  };

  transporter.sendMail(message);
};
