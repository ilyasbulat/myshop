const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/signup', userController.registration)
router.post('/signin', userController.login)
router.get('/auth', authMiddleware, userController.check)

module.exports = router
