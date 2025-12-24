const nodemailer = require("nodemailer");
require("dotenv").config();

// Configure the Nodemailer transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'khushdesai1030@gmail.com',
        pass: process.env.PASSWORD
    }
});

module.exports = transporter;