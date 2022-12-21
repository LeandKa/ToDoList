const UserService = require('./../../../services/web/Users')


class User {
    async index(req,res,next){
        await UserService.index()
            .then(data =>{
                res.status(data.status).json(data)
            })
            .catch(next)
    }

    async show(req,res,next){
        await UserService.show(req.user_id, req.body.id)
            .then(data => {
                res.status(data.status).json(data)
            })
            .catch(next)
    }

    async store(req,res,next){
        await UserService.store(req.body)
            .then(data =>{
                res.status(data.status).json(data)
            })
            .catch(next)
    }

    async update(req,res,next){
        await UserService.update(req.user_id, req.body.id, req.body)
            .then(data => {
                res.status(data.status).json(data)
            })
            .catch(next)
    }

    async delete(req,res,next){
        await UserService.delete(req.user_id, req.body.id)
            .then(data => {
                res.status(data.status).json(data)
            })
            .catch(next)
    }
}


module.exports = new User()