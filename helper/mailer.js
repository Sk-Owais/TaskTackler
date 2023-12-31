let mail = require('nodemailer')
function mailer(mailOption) {
    return new Promise((res, rej) => {
        let tranporter = mail.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: 'oshaikh427@gmail.com',
                pass: 'ouig gdez pfsc yyeh'
            }
        })
        tranporter.sendMail(mailOption, (error, info) => {
            if (error) {
                return rej(error)
            }
            return res(`mail is send to ${mailOption.to}`)
        })
    })
}
module.exports = { mailer };