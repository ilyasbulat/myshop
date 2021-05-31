const path = require('path')
const fs = require('fs')
const dir = path.resolve(__dirname, '..', 'static')

const clearStatic = () =>
    fs.readdir(dir, (err, files) => {
        if (err) {
            throw err
        }

        files.forEach((file) => {
            fs.unlink(path.resolve(dir, file), (err) => {
                if (err) throw err
            })
        })
    })

module.exports = clearStatic
