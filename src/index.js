const express = require('express');
const nodemailer = require('nodemailer');

require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Sample route
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// POST route to send an email
app.post('/send-email', async (req, res) => {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: 'All fields are required: name, email, subject, message' });
    }

    try {

        console.log("process.env.EMAIL_USER :", process.env.EMAIL_USER);
        console.log("process.env.EMAIL_PASS :", process.env.EMAIL_PASS);
        // Configure the transporter
        const transporter = nodemailer.createTransport({
            host: 'smtp.hostinger.com', // Hostinger SMTP server
            port: 465, // Use 465 for SSL
            secure: true, // Use true for SSL
            auth: {
                user: process.env.EMAIL_USER, // Your Hostinger email address
                pass: process.env.EMAIL_PASS  // Your Hostinger email password
            }
        });

        transporter.verify((error, success) => {
            if (error) {
                console.error('SMTP connection error:', error);
            } else {
                console.log('SMTP connection successful:', success);
            }
        });

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email, // Send email to the provided email address
            subject: `Message from ${name}: ${subject}`,
            text: message,
            html: `
            <h3>New Message from ${name}</h3>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
            `
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});