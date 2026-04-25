# Contact Form Email Setup Guide

## Overview
Your portfolio now has a working contact form that sends email notifications! When someone fills out the contact form, you'll receive an email with their message, and they'll get a confirmation email.

## Setup Instructions

### Step 1: Install Dependencies
Open a terminal in the portfolio folder and run:
```bash
npm install
```

### Step 2: Get Gmail App Password
Since Gmail doesn't allow regular passwords for third-party apps, you need to create an **App Password**:

1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Click "Security" in the left sidebar
3. Scroll down to "App passwords" (requires 2FA to be enabled)
4. Select "Mail" and "Windows Computer" (or your device)
5. Google will generate a 16-character password
6. Copy this password (spaces included)

### Step 3: Configure Environment Variables
Open the `.env` file in the portfolio folder and update:
```
GMAIL_ADDRESS=dilushanmehavannan@gmail.com
GMAIL_APP_PASSWORD=your_16_char_password_here
RECIPIENT_EMAIL=dilushanmehavannan@gmail.com
```

**Important:** Keep this `.env` file private! Don't commit it to GitHub.

### Step 4: Start the Server
Run this command in your terminal:
```bash
npm start
```

You should see:
```
✓ Email service ready
Server running on http://localhost:5000
```

### Step 5: Test the Form
1. Open your portfolio in a browser (http://localhost:3000 or wherever you're serving it)
2. Fill out the contact form
3. Submit and check your email!

## How It Works
- When someone submits the form, it sends data to `http://localhost:5000/api/contact`
- The server processes the form and sends **two emails**:
  - ✉️ **Admin Email**: You receive the full message
  - ✉️ **User Email**: They receive a confirmation

## Troubleshooting

### Email not sending?
- Check that the app password is correct (16 characters)
- Ensure 2FA is enabled on your Gmail account
- Verify the `.env` file has correct email addresses

### "Make sure the server is running" error?
- The Node.js server isn't running
- Run `npm start` in a new terminal window
- Make sure the terminal is in the portfolio folder

### Server crashes?
- Check Node.js is installed: `node --version`
- Reinstall dependencies: `npm install`

## Deployment Notes
For production deployment (like Heroku, Railway, or a VPS):
1. Set the same environment variables on your hosting platform
2. Update the frontend to use the correct API URL (change from `localhost:5000` to your production URL)
3. Use a more robust email service if needed (AWS SES, SendGrid, etc.)

## Files Modified
- `portfolio/index.html` - Added name attributes to form inputs
- `portfolio/script.js` - Updated handleForm() to send to backend
- `package.json` - Project dependencies
- `.env` - Gmail credentials (keep secret!)
- `server.js` - Backend email handler

Enjoy! 🎉
