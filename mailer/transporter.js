var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 465,
    secure: true,
    auth: {
        user: 'apikey',
        pass: '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'
    }
 });

 module.exports.transporter = transporter;
