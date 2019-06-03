const transporter = require('./transporter').transporter;
var Raven = require('raven');
Raven.config('https://853db40d557b42189a6b178ba7428001@sentry.io/1470742').install();

async function sendSDNotification(fileName, content, recipients) {
    // setup e-mail data
    var mailOptions = {
        from: '"Alethena Share Dispenser JMT V. 1.0" <sharedispenser@gmail.com>', // sender address (who sends)
     //    to: 'b.rickenbacher@intergga.ch, benjamin@alethena.com', // list of receivers (who receives)
         to: recipients, // list of receivers (who receives)
 
        subject: 'Share Dispenser Transaction Notification', // Subject line
        text: "", // plaintext body
        html: '<b>There is a new transaction on the Alethena share dispenser </b><br> This is an automatic email. See the attached csv file for details', // html body
        attachments: [
            {
                filename: fileName,
                content: content
            }
        ]
    };
 
    // send mail with defined transport object
 
    try {
        info = await transporter.sendMail(mailOptions);
        console.log('Message sent: ' + JSON.stringify(info));
    } catch (e) {
        Raven.captureException(e);
    }
 
 }
 
 module.exports.sendSDNotification = sendSDNotification;
 