const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const sendLowStockAlert = async (userEmail, itemName, quantity) => {
    await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: userEmail,
        subject: `Low Stock Alert: ${itemName}`,
        text: `${itemName} is low on stock, current quantity: ${quantity}.`
    });
};

const sendOutOfStockAlert = async (userEmail, itemName) => {
    await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: userEmail,
        subject: `Out Of Stock Alert: ${itemName}`,
        text: `${itemName} is out of stock.`
    });
};

module.exports = { sendLowStockAlert, sendOutOfStockAlert };