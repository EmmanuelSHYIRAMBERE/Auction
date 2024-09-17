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
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank You for Your Donation - SICP Charity Portal</title>
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
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Thank You for Your Donation!</h1>
    </div>
    <div class="content">
        <p>Dear $${userFullName},</p>
        <p>On behalf of everyone at the SICP Charity Portal, we want to express our heartfelt gratitude for your generous donation. Your support makes a real difference in the lives of those we serve.</p>
        <p>Your contribution will help us to:</p>
        <ul>
            <li>Provide essential resources to communities in need</li>
            <li>Fund vital research and development projects</li>
            <li>Support our ongoing educational and outreach programs</li>
            <li>Expand our reach to help even more people</li>
        </ul>
        <p>We're truly grateful for your commitment to our cause. Your donation is not just a financial contribution; it's an investment in a better future for all.</p>
        <p>If you'd like to see the impact of your donation or learn more about our current projects, please visit our website.</p>
        <p style="text-align: center;">
            <a href="#" class="button">View Our Projects</a>
        </p>
        <p>Thank you again for your generosity and support. Together, we are making the world a better place!</p>
        <p>With sincere appreciation,<br>The SICP Charity Portal Team</p>
    </div>
    <div class="footer">
        <p>© 2024 SICP Charity Portal. All rights reserved.</p>
        <p>This email was sent to ${userEmail}. If you have any questions about your donation, please <a href="#">contact us</a>.</p>
    </div>
</body>
</html>
`,
  };

  await transporter.sendMail(message);
};
