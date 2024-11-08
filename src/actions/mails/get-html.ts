
// HTML Template
export const getResetHtmlTemplate = (name: string, resetLink: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      background-color: #f4f4f4;
    }
    .container {
      max-width: 600px;
      margin: auto;
      background: #fff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    h1 {
      color: #333;
    }
    p {
      font-size: 16px;
      line-height: 1.5;
      color: #555;
    }
    a.button {
      display: inline-block;
      padding: 10px 15px;
      color: #fff;
      background-color: #007bff;
      text-decoration: none;
      border-radius: 5px;
    }
    @media (max-width: 600px) {
      .container {
        width: 100%;
        padding: 10px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Password Reset Request</h1>
    <p>Hi ${name},</p>
    <p>We received a request to reset your password. Click the button below to reset it:</p>
    <p><a href="${resetLink}" class="button">Reset Password</a></p>
    <p>If you didn’t request this, you can safely ignore this email.</p>
    <p>Thank you!</p>
  </div>
</body>
</html>
`;

// HTML Template for Email Verification
export const getVerifyUserHtmlTemplate = (
  name: string,
  verificationLink: string
) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      background-color: #f4f4f4;
    }
    .container {
      max-width: 600px;
      margin: auto;
      background: #fff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    h1 {
      color: #333;
    }
    p {
      font-size: 16px;
      line-height: 1.5;
      color: #555;
    }
    a.button {
      display: inline-block;
      padding: 10px 15px;
      color: #fff;
      background-color: #007bff;
      text-decoration: none;
      border-radius: 5px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Email Verification</h1>
    <p>Hi ${name},</p>
    <p>Thank you for registering! Please verify your email address by clicking the link below:</p>
    <p><a href="${verificationLink}" class="button">Verify Email</a></p>
    <p>If you didn't create an account, you can ignore this email.</p>
    <p>Thank you!</p>
  </div>
</body>
</html>
`;

export const getContactHtmlTemplate = (
  name: string,
  email: string,
  message: string,
  siteTitle: string
) => `
<html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        color: #333;
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
      }
      .container {
        width: 80%;
        max-width: 600px;
        margin: 20px auto;
        padding: 20px;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      h1 {
        color: #333;
        font-size: 24px;
        margin-bottom: 20px;
      }
      p {
        line-height: 1.6;
        margin: 0 0 10px;
      }
      .about-us {
        margin-top: 20px;
        padding-top: 20px;
        border-top: 1px solid #ddd;
      }
      .about-us h2 {
        font-size: 20px;
        margin: 0 0 10px;
      }
      .about-us p {
        margin: 0;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Contact Form Submission</h1>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
      <div class="about-us">
        <h2>About Us</h2>
        <p>Thank you for reaching out to us. We are dedicated to providing exceptional service and support. If you have any questions or need further assistance, please do not hesitate to contact us.</p>
        <p>Best regards,<br>${siteTitle}</p>
      </div>
    </div>
  </body>
</html>
`;


export const getReplyHtmlTemplate = (name: string, reply: string, siteTitle: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reply to Your Message</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      background-color: #f4f4f4;
    }
    .container {
      max-width: 600px;
      margin: auto;
      background: #fff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    h1 {
      color: #333;
    }
    p {
      font-size: 16px;
      line-height: 1.5;
      color: #555;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Reply to Your Message</h1>
    <p>Hi ${name},</p>
    <p>We have replied to your message:</p>
    <p><em>"${reply}"</em></p>
    <p>If you have further questions, feel free to reach out.</p>
    <p>Best regards,<br>${siteTitle}</p>
  </div>
</body>
</html>
`;
