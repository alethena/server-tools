const transporter = require('./transporter').transporter;

async function sendSDNotification(fileName, content, recipients) {
    // setup e-mail data
    var mailOptions = {
        from: '"Alethena Share Dispenser JMT V. 0.1" <sharedispenser@gmail.com>', // sender address (who sends)
     //    to: 'b.rickenbacher@intergga.ch, benjamin@alethena.com', // list of receivers (who receives)
         to: reci, // list of receivers (who receives)
 
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
        console.log(e);
    }
 
 }
 
 module.exports.sendSDNotification = sendSDNotification;