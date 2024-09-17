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
    subject: "Welcome to the SICP Charity Portal!",

    html: `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to SICP Charity Portal</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #2c3e50;
            color: white;
            text-align: center;
            padding: 30px 20px;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
        }
        .content {
            padding: 30px;
        }
        .footer {
            background-color: #34495e;
            color: #ecf0f1;
            text-align: center;
            padding: 20px;
            font-size: 0.9em;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #3498db;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin-top: 20px;
            transition: background-color 0.3s ease;
        }
        .button:hover {
            background-color: #2980b9;
        }
        .social-icons {
            margin-top: 20px;
        }
        .social-icons a {
            display: inline-block;
            margin: 0 10px;
            color: #ecf0f1;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to SICP Charity Portal!</h1>
        </div>
        <div class="content">
            <p>Dear {userFullName},</p>
            <p>We're thrilled to welcome you to the SICP Charity Portal community! Your registration is complete, and we're excited to have you join us in making a positive impact on the world.</p>
            <p>Here's what you can do now:</p>
            <ul>
                <li>Explore our current projects and initiatives</li>
                <li>Learn about volunteer opportunities</li>
                <li>Connect with other like-minded individuals</li>
                <li>Stay updated on our latest news and events</li>
            </ul>
            <p>To get started, simply click the button below to access your account:</p>
            <p style="text-align: center;">
                <a href="#" class="button">Access Your Account</a>
            </p>
            <p>If you have any questions or need assistance, our support team is always here to help. Don't hesitate to reach out!</p>
            <p>Thank you for joining us in our mission to create positive change. Together, we can make a real difference!</p>
            <p>Warm regards,<br>The SICP Charity Portal Team</p>
        </div>
        <div class="footer">
            <p>© 2024 SICP Charity Portal. All rights reserved.</p>
            <p>You're receiving this email because you registered at SICP Charity Portal.</p>
            <div class="social-icons">
                <a href="#">Facebook</a> | <a href="#">Twitter</a> | <a href="#">Instagram</a>
            </div>
        </div>
    </div>
</body>
</html>    
`,
  };

  transporter.sendMail(message);
};
