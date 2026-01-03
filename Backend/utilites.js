const jwt = require('jsonwebtoken')
const process = require('process')
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
dotenv.config();

function authenticateTokens(req, res, next) {

    const authheader = req.headers['authorization'] || req.headers['Authorization'];
    const token = authheader && authheader.split(" ")[1]

    if (!token) res.status(401);

    jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, (err, user) => {
        if (err) return res.json({ message: err.message })
        req.user = user
        next()
    })
}

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // your Gmail
        pass: process.env.EMAIL_PASS, // app password
    },
});

const sendReminderEmail = async (to, subject, text) => {
    try {
        await transporter.sendMail({
            from: `"Memopad+" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
        });
        console.log("Reminder email sent to:", to);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

module.exports = { authenticateTokens, sendReminderEmail }