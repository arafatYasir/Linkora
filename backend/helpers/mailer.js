const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const { OAuth2 } = google.auth;
const oauthLink = "https://developer.google.com/oauthplayground";
const { EMAIL, MAILING_ID, MAILING_SECRET, MAILING_REFRESH, MAILING_ACCESS } = process.env;

const auth = new OAuth2(
    MAILING_ID,
    MAILING_SECRET,
    MAILING_REFRESH,
    oauthLink
)

const sendVerificationEmail = (email, url) => {
    auth.setCredentials({
        refresh_token: MAILING_REFRESH
    });

    const accessToken = auth.getAccessToken();
    const stmp = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: EMAIL,
            clientId: MAILING_ID,
            clientSecret: MAILING_SECRET,
            refreshToken: MAILING_REFRESH,
            accessToken
        }
    });
    const mailOptions = {
        from: EMAIL,
        to: email,
        subject: "Linkora Email Verification!",
        html: `<body style="background-color: #f7f9fc; margin: 0; padding: 0;"> <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.05);"> <tr> <td style="background: linear-gradient(90deg, #007bff, #00c6ff); padding: 20px 0; text-align: center; color: #ffffff; font-size: 24px; font-weight: bold;"> Linkora </td> </tr> <tr> <td style="padding: 30px; text-align: center;"> <h2 style="color: #333;">Verify Your Email Address</h2> <p style="color: #666; font-size: 16px; line-height: 1.5;"> Thanks for signing up for <strong>Linkora</strong>! Please confirm your email address to complete your registration. </p> <a href=${url} style="display: inline-block; margin-top: 20px; background: #007bff; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600;"> Verify Email </a> <p style="margin-top: 25px; color: #888; font-size: 14px;"> If you didn’t create an account, please ignore this email. </p> </td> </tr> <tr> <td style="background: #f1f3f8; text-align: center; padding: 15px; color: #999; font-size: 13px;"> © 2025 Linkora. All rights reserved. </td> </tr> </table> </body>`
    };
    stmp.sendMail(mailOptions, (err, res) => {
        if (err) {
            return err;
        }
        return res;
    })
}


// send reset-code
const sendPasswordResetCode = (email, code) => {
    auth.setCredentials({
        refresh_token: MAILING_REFRESH
    });

    const accessToken = auth.getAccessToken();
    const stmp = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: EMAIL,
            clientId: MAILING_ID,
            clientSecret: MAILING_SECRET,
            refreshToken: MAILING_REFRESH,
            accessToken
        }
    });
    const mailOptions = {
        from: EMAIL,
        to: email,
        subject: "Password reset request, Linkora!",
        html: `<body style="background-color:#f7f9fc;margin:0;padding:0;"><table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:auto;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 2px 6px rgba(0,0,0,0.05);"><tr><td style="background:linear-gradient(90deg,#007bff,#00c6ff);padding:20px 0;text-align:center;color:#ffffff;font-size:24px;font-weight:bold;">Linkora</td></tr><tr><td style="padding:30px;text-align:center;"><h2 style="color:#333;">Reset Your Password</h2><p style="color:#666;font-size:16px;line-height:1.6;">We received a request to reset your password for your <strong>Linkora</strong> account. Use the code below to reset your password. This code will expire in <strong>15 minutes</strong>.</p><div style="display:inline-block;background:#f0f4ff;border:1px solid #cfd9f0;padding:14px 28px;border-radius:6px;margin-top:20px;font-size:22px;letter-spacing:2px;color:#007bff;font-weight:bold;">${code}</div><p style="margin-top:25px;color:#888;font-size:14px;line-height:1.5;">Didn't request a password reset? You can safely ignore this email.</p><p style="margin-top:25px;color:#888;font-size:14px;">For your security, please do not share this code with anyone.</p></td></tr><tr><td style="background:#f1f3f8;text-align:center;padding:15px;color:#999;font-size:13px;">© 2025 Linkora. All rights reserved.</td></tr></table></body>
`    
    };
    stmp.sendMail(mailOptions, (err, res) => {
        if (err) {
            return err;
        }
        return res;
    })
}



module.exports = {sendVerificationEmail, sendPasswordResetCode};