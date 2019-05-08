const transporter = require('./transporter').transporter;

async function sendConfirmationMail(code, recipient) {
    // setup e-mail data
    var mailOptions = {
        from: '"Alethena Transaction Reporting" <sharedispenser@gmail.com>', // sender address (who sends)
     //    to: 'b.rickenbacher@intergga.ch, benjamin@alethena.com', // list of receivers (who receives)
         to: [recipient], // list of receivers (who receives)
 
        subject: 'Please confirm your reported trade', // Subject line
        text: "", // plaintext body
        html: `Plase click the link below: <br><br> <a href="http://localhost:3000/reporting/confirmtrade/` + code + '"> Confirm Trade </a>', // html body
    };
 
    // send mail with defined transport object
 
    try {
        info = await transporter.sendMail(mailOptions);
        console.log('Message sent: ' + JSON.stringify(info));
    } catch (e) {
        console.log(e);
    }
 
 }
 
 module.exports.sendConfirmationMail = sendConfirmationMail;
 