const app = require('./app/app')
const sequelize = require('./db')
const models = require('./models/models')

const PORT = process.env.PORT || 8080

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
