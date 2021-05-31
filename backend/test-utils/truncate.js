var _ = require('lodash')
const models = require('../models/models')

async function truncate() {
    return await Promise.all(
        _.map(Object.keys(models), (key) => {
            if (['sequelize', 'Sequelize'].includes(key)) return null
            return models[key].destroy({ where: {}, force: true })
        })
    )
}

module.exports = truncate
