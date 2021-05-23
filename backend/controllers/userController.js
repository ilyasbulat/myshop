const ApiError = require('../error/ApiError')

class UserController {
    async login(req, res) {}
    async registration(req, res) {}

    async check(req, res, next) {
        const { id } = req.params
        if (!id) {
            next(ApiError.badRequest('no id param in query'))
        }
        res.send({ id })
    }
}

module.exports = new UserController()
