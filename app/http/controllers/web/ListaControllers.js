const listaService = require('../../../services/web/Lista')

class Lista {
    async index(req, res, next){
        await listaService.index(req.body)
        .then((data) =>{
            res.status(data.status).json(data)
        })
        .catch(next)
    }

    async store(req,res, next){
        await listaService.store(req.user_id, req.body)
        .then((data) =>{
            res.status(data.status).json(data)
        })
        .catch(next)
    }

    async show(req, res, next){
        await listaService.show(req.user_id, req.body)
        .then((data) =>{
            res.status(data.status).json(data)
        })
        .catch(next)
    }

    async update(req,res,next){
        await listaService.update(req.user_id, req.body.id, req.body)
            .then(data => {
                res.status(data.status).json(data)
            })
            .catch(next)
    }

    async delete(req, res, next){
        await listaService.delete(req.user_id, req.body.id)
            .then(data => { 
                res.status(data.status).json(data)
            })
            .catch(next)
    }
}

module.exports = new Lista()