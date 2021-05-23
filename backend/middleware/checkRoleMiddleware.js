const jwt = require('jsonwebtoken')

module.exports = (role) => {
    return (req, res, next) => {
        try {
            const token = req.headers.authorization.split(' ')[1]
            if (!token) {
                return res.status(401).json({ message: 'not authorized' })
            }
            const decoded = jwt.verify(token, process.env.SECRET_KEY)
            if (decoded.role !== role) {
                return res.status(403).json({ message: 'forbidden' })
            }
            req.user = decoded
            next()
        } catch (error) {
            res.status(401).json({ message: 'not authorized' })
        }
    }
}
