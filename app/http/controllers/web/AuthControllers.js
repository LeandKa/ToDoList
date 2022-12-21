const authService = require('../../../services/web/Auth')

class Auth {
    async login(req,res, next){
        await authService.login(req.body)
        .then((data) =>{
            res.status(data.status).json(data)
        })
        .catch(next)
    }
}

module.exports = new Auth()