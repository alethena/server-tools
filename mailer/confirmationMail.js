const transporter = require('./transporter').transporter;
var Raven = require('raven');
Raven.config('https://853db40d557b42189a6b178ba7428001@sentry.io/1470742').install();

async function sendConfirmationMail(htmlBody, recipient) {
    // setup e-mail data
    var mailOptions = {
        from: '"Alethena Transaction Reporting" <sharedispenser@gmail.com>', // sender address (who sends)
     //    to: 'b.rickenbacher@intergga.ch, benjamin@alethena.com', // list of receivers (who receives)
         to: [recipient], // list of receivers (who receives)
 
        subject: 'Please confirm your reported trade', // Subject line
        text: "", // plaintext body
        html: htmlBody, // html body
    };
 
    // send mail with defined transport object
 
    try {
        info = await transporter.sendMail(mailOptions);
        console.log('Message sent: ' + JSON.stringify(info));
    } catch (e) {
        Raven.captureException(e);
    }
 
 }
 
 module.exports.sendConfirmationMail = sendConfirmationMail;
 