require('dotenv').config()
const express = require('express')
const cors = require('cors')
const sequelize = require('./db')
const models = require('./models/models')
const fileUpload = require('express-fileupload')
const PORT = process.env.PORT || 8080
const router = require('./routes/index')
const errorHandler = require('./middleware/errorHandlerMiddleware')

const app = express()

app.use(cors())
app.use(express.json())
app.use(fileUpload({}))
app.use('/api', router)
app.use(errorHandler)

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log(`app running on port ${PORT}`))
    } catch (error) {
        console.log(error)
    }
}

start()
