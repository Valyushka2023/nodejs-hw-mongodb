import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();


const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,

    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
    connectionTimeout: 60000,
    tls: {
        rejectUnauthorized: false
    }
});


transporter.verify(function (error, success) {
    if (error) {
        console.log('Помилка SMTP:', error);
    } else {
        console.log('SMTP готовий до використання');
    }
});

export default transporter;