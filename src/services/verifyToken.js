const jwt = require('jsonwebtoken')

//verificacao de token de login
module.exports = function (req, res, next) {
    const token = req.header('auth-token')
    if (!token) return res.status(401).send('Acesso negado')

    try {
        const verified = jwt.verify(JSON.parse(token), process.env.SECRET_TOKEN)
        req.user = verified
        next()
    } catch (err) {
        console.log(err)
        res.status(400).send('Token inválido')
    }
}
