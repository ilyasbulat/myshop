const { Brand } = require('../models/models')
const ApiError = require('../error/ApiError')

class BrandController {
    async create(req, res, next) {
        const { name } = req.body
        if (!name) {
            return next(ApiError.badRequest('param name required'))
        }
        const brand = await Brand.create({ name })
        return res.send({ brand })
    }

    async getAll(req, res) {
        const brands = await Brand.findAll()
        return res.send({ brands })
    }
}

module.exports = new BrandController()
