const nodemailer =require("nodemailer");

const sendEmailFn = async ({ email, subject, msg }) => {
    return new Promise((resolve, reject) => {
        const mailTransporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL,
                pass: process.env.APP_PASS,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        const options = {
            from: {
                name: "Baemark",
                address: process.env.GMAIL,
            },
            to: email,
            subject: subject,
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #fff0f6; max-width: 600px; margin: 0 auto; padding: 30px; border-radius: 15px; border: 1px solid #fcd5ce;">
                    <div style="background-color: #ffe4ec; padding: 20px; border-radius: 10px; text-align: center;">
                        <h2 style="color: #d63384; margin-bottom: 10px;">🌸 Baemark Verification</h2>
                        <p style="color: #6c757d; font-size: 16px;">We’re so excited to have you with us!</p>
                    </div>
                    <div style="margin-top: 20px; color: #212529; font-size: 16px; line-height: 1.5;">
                        ${msg}
                    </div>
                    <p style="margin-top: 30px; font-size: 13px; color: #999; text-align: center;">
                        This is an automated message, please do not reply.
                    </p>
                    <div style="text-align: center; margin-top: 20px;">
                        <a href="https://baemark.com" style="text-decoration: none; background-color: #f783ac; color: white; padding: 10px 20px; border-radius: 25px; display: inline-block;">Visit Baemark</a>
                    </div>
                </div>
            `,
            headers: {
                'List-Unsubscribe': `<mailto:${process.env.GMAIL}>`,
                'Precedence': 'bulk',
            },
        };

        mailTransporter.sendMail(options, (err) => {
            if (err) {
                console.error(`❌ Failed to send message to ${email}.`, err);
                reject(err);
            } else {
                console.log(`✅ Message sent successfully to ${email}.`);
                resolve(true);
            }
        });
    });
};

module.exports = sendEmailFn;
