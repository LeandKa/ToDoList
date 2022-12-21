var bunyan = require('bunyan')
const log = bunyan.createLogger({name: "ListaService"})

const Lista = require('../../models/Lista')
const User = require('../../models/User')

const {genCodigo} = require('../../funcs/common.funcs')


module.exports = {
    async index(){
        try {
            
            var message = ""
            var success = 0

            const lista = await Lista.findAll({where:{
                status:0
            },
            include:[{
                association:"user "
            }]})

            return { status: 200, lista, message, success}

        } catch (error) {
            message = error
            success = 1

            log.error(message)

            return { status: 500, success, message }
        }
    },


    async store(user_id, body){
        try {
            
            var message = ""
            var success = 0


            if(!body.titulo || !body.descricao){
                message += "Falta de dados para a criação de uma lista. \n"
                success = 1
            }
            
            
            if(success != 0){
                return { status: 400, success, message }
            }

            var codigo = genCodigo()

            log.info(codigo)

            while(await Lista.findOne({ where: { id: codigo}})){
                codigo = genCodigo();
            }
            
            const lista = await Lista.create({
                id:codigo,
                titulo:body.titulo,
                descricao:body.descricao,
                usuario_id:user_id,
                status:0,
                criado_por:user_id,
                criado_em: new Date(),
                atualizado_por:user_id
            })


            return {lista, status:200, message, success:0}


        } catch (error) {
            message = error
            success = 1

            log.error(message)

            return { status: 500, success, message }
        }
    },

    async show(user_id, body){
        log.info(this.show)
        try {
            var message = ""
            var success = 0


            const lista = await Lista.findOne({
                where:{
                    id:body.id,
                    status:0
                }
                ,include:[{
                    association:"user"
                }]
            })
             

            return { status: 200, message, success, lista}


        } catch (error) {
            message = error
            success = 1

            log.error(message)

            return { status: 500, success, message }
        }
    },

    async update(user_id, id, body){
        log.info(this.update)
        try {
            
            var message = ""
            var success = 0
            var lista_data = {}
            let l = body

            const lista = await Lista.findOne({ where: {
                id: id, status: 0
            }})

            if(lista.criado_por !== user_id){
                message += "Você não tem permissão para editar este grupo. \n"
                success = 1
            }

            if(!lista) {
                message += "Lista informada não existe. \n"
                success = 1
            }

            if(success != 0){
                return { status: 400, success, message }
            }

            if(l.titulo != lista.titulo) lista_data.titulo = l.titulo
            if(l.descricao != lista.descricao) lista_data.descricao = l.descricao

            if(JSON.stringify(lista_data) !== JSON.stringify({})){
                lista_data.atualizado_por = user_id
                lista_data.atualizado_em = new Date()

            
                log.warn(lista_data)

                await Lista.update(lista_data, { where: { id: id, }})

                message += "Lista alterada com sucesso. "
            }else{
                message += "Nenhum campo alterado. "
            }


            return { status: 200, success, message, lista_data }

        } catch (error) {
            message = error
            success = 1

            log.error(message)

            return { status: 500, success, message }
        }
    },

    async delete(user_id, id){

        log.info(this.delete)

        try {
            var message = ""
            var success = 0

            var lista = {
                status:1,
                atualizado_por:user_id,
                atualizado_em: new Date()
            }

            if(!Lista.update(lista,{ where:{ id: id}})){
                message = "Lista de id " + id + ", não existe."

                return {status: 404, success: 1, message}
            }

            if(user_id !=  lista.criado_por){
                message += "Você não pode editar uma lista que não seja sua. \n"
                success = 1
            }

            message = "Lista de id " + id + ", foi atualizado."

            log.info(this.delete, message)

            return { status: 200, success: 0, message}

            
        } catch (error) {
            message = error
            success = 1

            log.error(message)

            return { status: 500, success, message }
        }

    }
}