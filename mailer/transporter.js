var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: 'sharedispenser@gmail.com',
        pass: 'kGNjLN7zGdenAKCG4C22CTjK'
    }
 });

 module.exports.transporter = transporter;