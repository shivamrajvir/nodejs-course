const sgMail = require('sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcome = (email, name) => {
    sgMail.send({
        to: email,
        from: 'shiv.driftking@gmail.com',
        subject: 'Thanks for joining',
        text: 'This is a test email from shivam rajvir, welcome ' + name
    })
}

module.exports = {
    sendWelcome
}