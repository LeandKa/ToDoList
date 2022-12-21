const express = require('express')
const router = express.Router()

const Controller = require('./../app/http/controllers')


const AuthMiddleware = require('./../app/http/middlewares/Auth')


/**
 * 
 * Login
 */

router.post('/login',                                               Controller.Auth.login)

/**
 * 
 * Registro de Usuário
 */
router.post('/user',                                                Controller.User.store)

router.use(AuthMiddleware)

/**
 * 
 * Crud de Usuários
 */

router.get('/lista/user',                                           Controller.User.index)
router.get('/user',                                                 Controller.User.show)
router.put('/user',                                                 Controller.User.update)
router.put('/apagar/usuario',                                       Controller.User.delete)


/**
 * 
 * Crud de Lista
 * 
 */

router.get('/lista',                                                Controller.Lista.index)
router.post('/lista',                                               Controller.Lista.store)
router.get('/lista/show',                                           Controller.Lista.show)
router.put('/lista',                                                Controller.Lista.update)
router.put('/apagar/lista',                                         Controller.Lista.delete)


/**
 * 
 * Crud de Item
 * 
 */

router.get('/item',                                                Controller.Item.index)
router.post('/item',                                               Controller.Item.store)
router.get('/item/show',                                           Controller.Item.show)
router.put('/item',                                                Controller.Item.update)
router.put('/apagar/item',                                         Controller.Item.delete)




module.exports = router