const nodemailer = require('nodemailer')
require('dotenv').config()

const servicemail = process.env.SERVERMAIL;
const pass = process.env.SP;


var transporter = nodemailer.createTransport({
    service: 'gmail',
    host:'smtp.gmail.com',
    post:465,
    secure:true,
    auth: {
      user: servicemail,
      pass: pass,
    }
});

const sendVerification=(email,link)=>{
    console.log(servicemail)
    console.log(pass)
    try {
        
        var mailOptions = {
            from: servicemail,
            to: email,
            subject: `Account Verification`,
        text: `Verification Link: ${link}`
    };
    
      transporter.sendMail(mailOptions, function(error, info){
          if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      }); 
        return true;  
    } catch (error) {
        console.error(error)
        return false;
    }
}

module.exports = {
    sendVerification,
}