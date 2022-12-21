const itemService = require('../../../services/web/Item')

class Item {
    async index(req,res, next){
        await itemService.index(req.body)
        .then((data) =>{
            res.status(data.status).json(data)
        })
        .catch(next)
    }
    
    async store(req, res, next){
        await itemService.store(req.user_id, req.body)
        .then((data) =>{
            res.status(data.status).json(data)
        })
        .catch(next)
    }

    async show(req, res, next){
        await itemService.show(req.user_id, req.body.id)
        .then((data) => {
            res.status(data.status).json(data)
        })
        .catch(next)
    }

    async update(req, res, next){
        await itemService.update(req.user_id, req.body.id, req.body)
        .then((data) => {
            res.status(data.status).json(data)
        })
        .catch(next)
    }

    async delete(req, res, next){
        await itemService.delete(req.user_id, req.body.id)
        .then((data) => {
            res.status(data.status).json(data)
        })
        .catch(next)
    }
}

module.exports = new Item()