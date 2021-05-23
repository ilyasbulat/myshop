const uuid = require('uuid')
const path = require('path')
const { Device, DeviceInfo } = require('../models/models')
const ApiError = require('../error/ApiError')
const { type } = require('os')

class DeviceController {
    async create(req, res, next) {
        try {
            const { name, price, brandId, typeId, info } = req.body
            const { img } = req.files
            let filename = uuid.v4() + 'jpg'
            img.mv(path.resolve(__dirname, '..', 'static', filename))

            const device = Device.create({
                name,
                price,
                brandId,
                typeId,
                img: filename,
            })

            if (info) {
                info = JSON.parse(info)
                info.forEach((i) =>
                    DeviceInfo.create({
                        title: i.title,
                        description: i.description,
                        deviceId: device.id,
                    })
                )
            }

            return res.send(device)
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }
    async getAll(req, res) {
        let { brandId, typeId, limit, page } = req.body
        page = page || 1
        limit = limit || 9
        let offset = page * limit - limit
        let devices
        if (!brandId && !typeId) {
            devices = Device.findAndCountAll({
                limit,
                offset,
            })
        }
        if (brandId && !typeId) {
            devices = Device.findAndCountAll({
                where: { brandId },
                limit,
                offset,
            })
        }
        if (!brandId && typeId) {
            devices = Device.findAndCountAll({
                where: { typeId },
                limit,
                offset,
            })
        }
        if (brandId && typeId) {
            devices = Device.findAndCountAll({
                where: { brandId, typeId },
                limit,
                offset,
            })
        }
        return res.send(devices)
    }
    async getOne(req, res) {
        const { id } = req.params
        const device = Device.findOne({
            where: { id },
            include: { model: DeviceInfo, as: 'info' },
        })

        return res.send(device)
    }
}

module.exports = new DeviceController()
