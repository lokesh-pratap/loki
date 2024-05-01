import nodemailer from 'nodemailer';

const user = process.env.GMAIL_ID;
const pass = process.env.GMAIL_KEY;

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: user,
        pass: pass
    },
});

export const send_mail = (mailOptions) => {
    return new Promise((resolve, reject) => {
        try {
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(info);
                }
            });
        } catch (error) {
            reject(error);
        }
    });
};