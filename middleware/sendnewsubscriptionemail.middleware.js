import nodemailer from "nodemailer";

export const sendNewSubscriptionEmail = async (userEmail) => {
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
    subject: "Thank You for Subscription - SICP Charity Portal!",

    html: `
     <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank You for Subscribing to SICP Charity Portal</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #4CAF50;
            color: white;
            text-align: center;
            padding: 20px;
        }
        .content {
            padding: 20px;
            background-color: #f9f9f9;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 0.8em;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Thank You for Subscribing!</h1>
    </div>
    <div class="content">
        <p>Dear Subscriber,</p>
        <p>Welcome to the SICP Charity Portal! We're thrilled to have you join our community of caring individuals dedicated to making a positive impact in the world.</p>
        <p>Here's what you can expect from us:</p>
        <ul>
            <li>Regular updates on our charitable initiatives</li>
            <li>Opportunities to get involved and volunteer</li>
            <li>Inspiring stories from the communities we serve</li>
            <li>Tips on how to make a difference in your local area</li>
        </ul>
        <p>If you have any questions or would like to learn more about our work, please don't hesitate to reach out to us.</p>
        <p>Thank you again for your support. Together, we can create lasting change!</p>
        <p>Best regards,<br>The SICP Charity Portal Team</p>
    </div>
    <div class="footer">
        <p>© 2024 SICP Charity Portal. All rights reserved.</p>
        <p>You're receiving this email because you subscribed to our newsletter. If you no longer wish to receive these emails, you can <a href="#">unsubscribe here</a>.</p>
    </div>
</body>
</html>
`,
  };

  await transporter.sendMail(message);
};
