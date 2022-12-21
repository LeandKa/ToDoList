var bunyan = require('bunyan')
const log = bunyan.createLogger({name: "ItemService"})


const Item = require('../../models/Item')
const Lista = require('../../models/Lista')

const {genCodigo} = require('../../funcs/common.funcs')

module.exports = {
    async index(){
        log.info(this.index)
        try {

            var message = ""
            var success = 0

            const item = await Item.findAll({
                where:{
                    status:0
                },
                include:[{
                    association:'lista'
                }]
            })
            
            
            return { status: 200, item, message, success}

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

            if(!body.descricao || !body.lista_id){
                message += "Esta faltando dados. \n"
                success = 1
            }

            const lista = await Lista.findOne({
                where:{
                    id:body.lista_id,
                    status:0
                }
            })

            if(!lista){
                message += "Você esta criado um item para uma lista que não existe. \n"
                success = 1
            }

            if(success == 1){
                return { status: 400, message, success}
            }

            codigo = genCodigo()

            log.info(codigo)

            while(await Item.findOne({ where: { id: codigo}})){
                codigo = genCodigo();
            }

            const item = await Item.create({
                id:codigo,
                descricao:body.descricao,
                lista_id:body.lista_id,
                status:0,
                criado_por:user_id,
                criado_em: new Date(),
                atualizado_por:user_id
            })

            return {item, status:200, message, success:0}
            
        } catch (error) {
            message = error
            success = 1

            log.error(message)

            return { status: 500, success, message }
        }
    },

    async show(user_id, id){
        try {
            var message = ""
            var success = 0


            const item = await Item.findOne({
                where:{
                    id:id,
                    status:0
                }
                ,include:[{
                    association:"lista"
                }]
            })
             

            return { status: 200, message, success, item}
        } catch (error) {
            message = error
            success = 1

            log.error(message)

            return { status: 500, success, message }
        }
    },

    async update(user_id, id, body){
        try {

            var message = ""
            var success = 0
            var item_data = {}
            let i = body

            const item = await Item.findOne({ where: {
                id: id, status: 0
            }})

            if(item.criado_por !== user_id){
                message += "Você não tem permissão para editar este grupo. \n"
                success = 1
            }

            if(!item) {
                message += "Item informado não existe. \n"
                success = 1
            }

            if(success != 0){
                return { status: 400, success, message }
            }


            if(i.descricao != item.descricao) item_data.descricao = i.descricao

            if(JSON.stringify(item_data) !== JSON.stringify({})){
                item_data.atualizado_por = user_id
                item_data.atualizado_em = new Date()

            
                log.warn(item_data)

                await Item.update(item_data, { where: { id: id, }})

                message += "Item alterado com sucesso. "
            }else{
                message += "Nenhum campo alterado. "
            }


            return { status: 200, success, message, item_data }

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

            var item = {
                status:1,
                atualizado_por:user_id,
                atualizado_em: new Date()
            }

            if(!Item.update(item,{ where:{ id: id}})){
                message = "Lista de id " + id + ", não existe."

                return {status: 404, success: 1, message}
            }

            if(user_id !=  item.criado_por){
                message += "Você não pode editar uma item que não seja sua. \n"
                success = 1
            }

            message = "Item de id " + id + ", foi atualizado."

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