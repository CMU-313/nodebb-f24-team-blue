const nodemailer = require('nodemailer');

async function sendTestEmail() {
    // Create a transporter with your email service configuration
    let transporter = nodemailer.createTransport({
        service: 'gmail',  // Using Gmail service
        auth: {
            user: 'a.mannai2004@gmail.com',  // Your Gmail address
            pass: 'sqfb mnsg hdcs acub'  // Your App Password generated for Gmail
        },
    });

    // Email options
    let mailOptions = {
        from: '"Test" <a.mannai2004@gmail.com>',  // Sender address
        to: 'a.mannai2004@gmail.com',  // You can send it to yourself as a test
        subject: 'Test Email',  // Subject line
        text: 'This is a test email in plain text',  // Plain text body (Added to avoid spam)
        html: '<b>This is a test email</b>',  // HTML body
    };

    try {
        // Send email
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:');
        console.log('Message ID:', info.messageId);
        console.log('Response:', info.response);
    } catch (error) {
        console.error('Error occurred while sending email:', error);
    }
}

// Call the function to send the email
sendTestEmail();
