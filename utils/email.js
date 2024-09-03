const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.from = `Adventours <${process.env.EMAIL_FROM}>`;
    }

    createTransport() {
        if (process.env.NODE_ENV === 'production') {
            // The teacher used Sendgrid:
            // return nodemailer.createTransport({
            //     service: 'SendGrid',
            //     auth: {
            //         user: process.env.SENDGRID_USERNAME,
            //         pass: process.env.SENDGRID_PASSWORD,
            //     },
            // });
            // ChatGPT says thet for Mailersend I need this config:
            return nodemailer.createTransport({
                host: 'smtp.mailersend.net',
                port: 587,
                secure: false,
                auth: {
                    user: process.env.EMAIL_SMTP_USERNAME,
                    pass: process.env.EMAIL_SMTP_USER_PASSWORD,
                },
            });
        }

        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }

    // Send the actual email
    async send(template, subject) {
        // 1) Render HTML based on a pug template
        const html = pug.renderFile(
            `${__dirname}/../views/emails/${template}.pug`,
            {
                firstName: this.firstName,
                url: this.url,
                subject,
            }
        );

        // 2) Define email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText.convert(html),
        };

        // 3) Create a transport and send email
        await this.createTransport().sendMail(mailOptions);
    }

    async sendWelcome() {
        await this.send('welcome', 'Welcome to the Adventours Family!');
    }

    async sendPasswordReset() {
        await this.send('passwordReset', 'Reset your password for Adventours');
    }
};
