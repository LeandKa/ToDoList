module.exports = (req, res, next) => {
    const jwt = require('jsonwebtoken')
    const authHash = require('./../../../config/auth.json')

    const authHeader = req.headers.authorization

    if(!authHeader){
        return res.status(401).send({ error: "Usuário não autenticado "})
    }

    //Bearer hash
    const parts = authHeader.split(' ')

    if(!parts.length === 2){
        return res.status(401).send({ error: "Token error" })
    }

    const [ scheme, token ] = parts

    if(!/^Bearer$/i.test(scheme)){
        return res.status(401).send({ error: 'Token mal formatado' })
    }

    var hash = authHash.secret_admin

    jwt.verify(token, hash, (err, decoded) =>{
        if(err){
            return res.status(401).send({ error: "Usuário não autenticadd"})
        }

        req.user_id = decoded.id

        return next()
    })

}