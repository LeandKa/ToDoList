var bunyan = require('bunyan')
const log = bunyan.createLogger({name: "UserService"})


const User = require("./../../models/User")

const bcrypt = require('bcrypt')
const { Op } = require("sequelize")

const {genCodigo, validaCPF, validaEmail,validaPassword} = require('../../funcs/common.funcs');


module.exports = {
    async index(){
        log.info(this.index)
        try {
            var message = ""
            var success = ""
            var status = 200


            var users = await User.findAll({
                attributes: ['id', 'nome', 'sobrenome', 'email', 'data_nascimento', 'cpf'],
                where:{
                    status:0
                }
            })
            
            return {status, message, users}


        } catch (error) {
            message = error
            success = 1

            log.error(message)

            return { status : 501, success, message}
        }
    },

    async store(body){

        log.info(this.store)

        try {
            var message = ""
            var success = 0
            var status = 200
            
            /**
             * Validações criação de Usuário
             */

            if(!body.nome || !body.sobrenome || !body.email || !body.data_nascimento || !body.cpf || !body.senha){
                message += "Erro - Todos os campos devem ser preenchidos. \n"
                success = 1
            }

            let {isValid} = validaCPF(body.cpf)
            if(!isValid){
                message += "Erro - Por favor mande um cpf valido. \n"
                success = 1
            }

            if(!validaEmail(body.email)){
                message += "Erro - E-mail passado foi mandado num formato invalido. \n"
                success = 1
            }

            if(!validaPassword(body.senha)){
                message += "Erro - Senha fraca demais por favor mande uma senha forte, Exemplo ao menos um digito,minúscula,maiúscula, caractere especial e no minimo 8 caracteres de tamanho. \n"
                success = 1
            }

            const user_find_email = await User.findOne({
                where:{
                    email: body.email
                }
            })

            if(user_find_email){
                message += `Já existe um usuário com estes dados registrados : ${user_find_email.email}. \n`
                success = 1
            }

            const user_find_cpf = await User.findOne({
                where: {
                    cpf: body.cpf
                }
            })

            if(user_find_cpf){
                message += `Já existe um usuário com estes dados registrados : ${user_find_cpf.cpf}. \n`
                success = 1
            }


            if(success !== 0){
                log.info(this.store, message)
                return { status: 400, success, message}
            }

            /**
             * Preparação de dados para cadastro
             */

            var codigo = genCodigo()

            log.info(codigo)

            while(await User.findOne({ where: { id: codigo}})){
                codigo = genCodigo();
            }

            let {cpf} = validaCPF(body.cpf)

            let salt = bcrypt.genSaltSync(10)
            let senhaHash = bcrypt.hashSync(body.senha, salt)


            /**
             * Registro do usuário banco
             */

            const user = await User.create({
                id:codigo,
                nome:body.nome,
                sobrenome:body.sobrenome,
                email:body.email,
                data_nascimento:body.data_nascimento,
                cpf:cpf,
                senha:senhaHash,
                status:0,
                criado_por:codigo,
                criado_em: new Date(),
                atualizado_por:codigo
            })
            

            return {user, status, message}
            
        } catch (error) {
            message = error
            success = 1

            log.error(message)

            return { status : 500, success, message}
        }
    },

    async show(user_id,id){
        log.info(this.show)
        try {
            var message = ""
            var success = 0


            const user = await User.findOne({
                where:{
                    id:id,
                    status: 0
                }
                ,attributes:['id', 'nome', 'sobrenome', 'cpf', 'email', 'data_nascimento']
            })

            return {status: 200, success, message, user}

            
        } catch (error) {
            message = error
            success = 1

            log.error(message)

            return { status : 501, success, message}
        }
    },


    async update(user_id, id, body){
        log.info(this.update)

        try {
            var message = ""
            var success = 0
            var usuario_data = {}
            let u = body

            const user = await User.findOne({ where: {
                id: id, status: 0
            }})

            if(!user) {
                message += "Usuário informado não existe. \n"
                success = 1
            }
            
            if(body.cpf){
                let {isValid} = validaCPF(body.cpf)
                if(!isValid){
                    message += "Cpf passado na edição não e valido. \n"
                    success = 1
                }
            }

            if(body.email){
                if(!validaEmail(body.email)){
                    message += "E-mail passado não e um e-mail valido. \n"
                    success = 1
                }
            }

            if(user_id !== user.criado_por){
                message += "Você não pode editar outro usuário. \n"
                success = 1
            }


            if(success != 0){
                return { status: 400, success, message }
            }

            if(u.nome != user.nome) usuario_data.nome = u.nome
            if(u.sobrenome != user.sobrenome) usuario_data.sobrenome = u.sobrenome
            if(u.data_nascimento != user.data_nascimento) usuario_data.data_nascimento = u.data_nascimento
            if(u.cpf != user.cpf) usuario_data.cpf = u.cpf
            if(u.email != user.email) usuario_data.email = u.email
            
            


            if(JSON.stringify(usuario_data) !== JSON.stringify({})){
                usuario_data.atualizado_por = user_id
                usuario_data.atualizado_em = new Date()

            
                log.warn(usuario_data)

                await User.update(usuario_data, { where: { id: id, }})

                message += "Usuário alterado com sucesso. "
            }else{
                message += "Nenhum campo alterado. "
            }

            return { status: 200, success, message, usuario_data }
            
        } catch (error) {
            message = error
            success = 1

            log.error(message)

            return { status : 501, success, message}
        }

    },


    async delete(user_id, id){
        log.info(this.delete)
        try {
            var message = ""

            var usuario = {
                status:1,
                atualizado_por:user_id,
                atualizado_em: new Date()
            }

            if(!User.update(usuario,{ where:{ id: id}})){
                message = "Usuário de id " + id + ", não existe."

                return {status: 404, success: 1, message}
            }

            if(user_id !== user.criado_por){
                message += "Você não pode editar outro usuário. \n"
                success = 1
            }

            message = "Usuário de id " + id + ", foi atualizado."

            log.info(this.delete, message)

            return { status: 200, success: 0, message}
            
        } catch (error) {
            message = error
            success = 1

            log.error(message)

            return { status : 501, success, message}
        }
    }

}