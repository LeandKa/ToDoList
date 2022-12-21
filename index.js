const express = require('express')
const { createServer } = require('http')
const cors = require('cors')
const helmet = require('helmet')
const bunyan = require('bunyan')
const compression = require('compression')


const admin = require('./routes/admin')
const db = require('./database/index')


const log = bunyan.createLogger({name: "TodoList"})

var app = express()
app.use(compression())
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(helmet())
app.use(admin)

const httpServer = createServer(app)



db.sync()


const port = 3000

httpServer.listen(port,() => {
	log.info(`App listening at http://localhost:${port}`)
})
