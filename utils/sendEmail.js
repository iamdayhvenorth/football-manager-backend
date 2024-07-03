const nodemailer = require("nodemailer")

const sendEmail = async (from,to,subject,message) => {
    const AUTH_PASS = "nyyj tnui yqbc ivlg"
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        host: 'smtp.gmail.com',
        port: 465, //587
        auth: {
            user: process.env.AUTH_EMAIL,
            pass: AUTH_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    })

    const mailOptions = {
        from: `DaveCodeSolutions ${from}`,
        to,
        subject,
        html: message
    }
    transporter.sendMail(mailOptions, function (err,info) {
        if(err) console.log(err)
        console.log('Email sent: ' + info.response);
    })
}

module.exports = sendEmail;