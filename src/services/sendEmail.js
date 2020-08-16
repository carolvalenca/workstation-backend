const nodemailer = require('nodemailer')

//arquivo responsavel por enviar os emails com token de verificacao
const transporter = nodemailer.createTransport({ // Configura os parâmetros de conexão com servidor.
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'teste.incodde@gmail.com',
      pass: 'teste123_'
    },
    tls:{
        ciphers:'SSLv3'
    }
})

const mailOptions = { // Define informações pertinentes ao E-mail que será enviado
    from: 'teste.incodde@gmail.com',
    to: '',
    subject: 'EMAIL DE VERIFICAÇÃO',
    text: ''
  }

const sendEmail = (email, tokenVerificacao) => {
    mailOptions.to = email
    mailOptions.text = `Link de confirmação ->  http://localhost:3000/verify/${tokenVerificacao}   token -> ${tokenVerificacao}`
    transporter.sendMail(mailOptions, (err, info) => { // Função que, efetivamente, envia o email.
        if (err) {
            return console.log(err)
        }
    
        console.log(info)
    })
}


module.exports = sendEmail