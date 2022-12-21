var bunyan = require('bunyan')
const log = bunyan.createLogger({name: "UserService"})

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../../models/User')


const authHash = require('../../../config/auth.json')['secret_admin']


module.exports = {
    tokenGenerate(params = {}){
        var hash = authHash

        var token = hash != "" ? jwt.sign(params, hash, {expiresIn: 10800}) : ''

        return token
    },


    async login({ email, senha }){
        log.info(this.login)
        try {

            var message = ""
            var success = 0

            var user = await User.findOne({
                attributes:['id', 'nome', 'sobrenome', 'email', 'senha'],
                where:{
                    email: email,
                    status:0
                }
            })

            if(!user || !( bcrypt.compareSync(senha, user.senha))){
                message += "Usuários ou senha incorretos."
                success = 1

                log.warn(this.login, message, email)

                return { status: 200, success, message }
            }else{
                const __TOKEN__ = this.tokenGenerate({ id: user.id })
                if(__TOKEN__ == ''){
                    message += 'Erro ao gerar token de autenticação'
                    success = 1

                    log.warn(this.login, message)

                    return { status: 200, success, message}
                }

                message += "Usuário de id" +  user.id + ", foi logado com sucesso."

                log.warn(this.login, message)

                return {status: 200, message, user, __TOKEN__}


            }
            
        } catch (error) {
            message = error
            success = 1

            log.error(message)

            return { status: 500, success, message }
        }

    }

}