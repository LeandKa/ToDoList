const { Sequelize } = require('sequelize')
const env = process.env.NODE_ENV || 'development'
const config = require('./../config/config.json')[env]


const Item = require('./../app/models/Item')
const Lista = require('./../app/models/Lista')
const User = require('./../app/models/User')


const db = new Sequelize(config)

Item.init(db)
Lista.init(db)
User.init(db)


Item.associate(db.models)
Lista.associate(db.models)
User.associate(db.models)

module.exports = db