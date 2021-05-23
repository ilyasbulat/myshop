const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')

router.post('/signup', userController.registration)
router.post('/signin', userController.login)
router.get('/auth/:id', userController.check)

module.exports = router
