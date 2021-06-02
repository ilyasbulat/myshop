require('dotenv').config()

const bcrypt = require('bcrypt')
const ApiError = require('../error/ApiError')
const { User, Type, Device, Brand } = require('../models/models')

jest.mock('bcrypt')
jest.mock('../error/ApiError')
jest.mock('../models/models')

const userController = require('../controllers/userController')
const typeController = require('../controllers/typeController')
const deviceController = require('../controllers/deviceController')
const brandController = require('../controllers/brandController')

const res = {
    send: jest.fn(),
}

const next = jest.fn()

describe('user controller login', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })
    const email = 'joe@test.com'
    const password = 'test123'
    const role = 'USER'

    it('when user with this credentials exists', async () => {
        User.findOne.mockResolvedValue({ email, password, role })
        bcrypt.compareSync.mockReturnValue(true)

        await userController.login({ body: { email, password } }, res, next)
        expect(res.send).toHaveBeenCalled()
        expect(ApiError.badRequest).not.toHaveBeenCalled()
    })

    it('when user not exists', async () => {
        User.findOne.mockResolvedValue(null)

        await userController.login({ body: { email, password } }, res, next)
        expect(res.send).not.toHaveBeenCalled()
        expect(next).toHaveBeenCalled()
        expect(ApiError.badRequest).toHaveBeenCalledWith(
            'user with this email not found'
        )
    })
    // ...
})

describe('user controller registration', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })
    const id = 1
    const email = 'joe@test.com'
    const password = 'test123'
    const role = 'USER'

    it('reg new user with proper credentials', async () => {
        User.findOne.mockResolvedValue(null)
        User.create.mockResolvedValue({ id, email, password, role })
        await userController.registration(
            { body: { email, password } },
            res,
            next
        )
        expect(res.send).toHaveBeenCalled()
        expect(ApiError.badRequest).not.toHaveBeenCalled()
    })

    it('reg new user with already used creds', async () => {
        User.findOne.mockResolvedValue({ email, password })
        await userController.registration(
            { body: { email, password } },
            res,
            next
        )

        expect(res.send).not.toHaveBeenCalled()
        expect(ApiError.badRequest).toHaveBeenCalledWith(
            'user with this email exists'
        )
    })

    it('reg new user with missing password', async () => {
        User.findOne.mockResolvedValue(null)
        await userController.registration(
            { body: { email, password: '' } },
            res,
            next
        )

        expect(res.send).not.toHaveBeenCalled()
        expect(ApiError.badRequest).toHaveBeenCalledWith(
            'email or password is empty'
        )
    })

    it('reg new user with missing email', async () => {
        User.findOne.mockResolvedValue(null)
        await userController.registration(
            { body: { email, password: '' } },
            res,
            next
        )

        expect(res.send).not.toHaveBeenCalled()
        expect(ApiError.badRequest).toHaveBeenCalledWith(
            'email or password is empty'
        )
    })
})

describe('type controller tests', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('create type', async () => {
        await typeController.create({ body: { name: 'something' } }, res, next)

        expect(res.send).toHaveBeenCalled()
        expect(ApiError.badRequest).not.toHaveBeenCalled()
    })

    it('create type with empty name property of request body', async () => {
        await typeController.create({ body: { name: '' } }, res, next)

        expect(res.send).not.toHaveBeenCalled()
        expect(ApiError.badRequest).toHaveBeenCalled()
    })

    it('getAll types', async () => {
        await typeController.getAll({}, res)

        expect(Type.findAll).toHaveBeenCalled()
        expect(res.send).toHaveBeenCalled()
        expect(ApiError.badRequest).not.toHaveBeenCalled()
    })
})

describe('device controller test', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    const payload = {
        name: ' name',
        price: 10,
        brandId: 1,
        typeId: 1,
    }

    const img = {
        mv: jest.fn(),
    }

    it('create device', async () => {
        await deviceController.create(
            {
                body: payload,
                files: { img },
            },
            res,
            next
        )
        expect(res.send).toHaveBeenCalled()
        expect(ApiError.badRequest).not.toHaveBeenCalled()
        expect(img.mv).toHaveBeenCalled()
    })

    it('getAll devices', async () => {
        const body = {
            brandId: 1,
            typeId: 1,
            limit: 1,
            page: 1,
        }

        await deviceController.getAll({ body }, res, next)
        expect(res.send).toHaveBeenCalled()
    })

    it('getOne devices', async () => {
        const params = {
            id: 1,
        }

        await deviceController.getOne({ params }, res, next)
        expect(Device.findOne).toHaveBeenCalled()
        expect(res.send).toHaveBeenCalled()
        expect(ApiError.badRequest).not.toHaveBeenCalled()
    })
})

describe('brand conttoller tests', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    const body = {
        name: 'something',
    }

    it('create brand', async () => {
        await brandController.create({ body }, res, next)

        expect(res.send).toHaveBeenCalled()
        expect(Brand.create).toHaveBeenCalled()
        expect(ApiError.badRequest).not.toHaveBeenCalled()
    })

    it('create brand without param', async () => {
        await brandController.create({ body: { name: '' } }, res, next)

        expect(res.send).not.toHaveBeenCalled()
        expect(Brand.create).not.toHaveBeenCalled()
        expect(ApiError.badRequest).toHaveBeenCalledWith('param name required')
    })

    it('getAll brand', async () => {
        await brandController.getAll({}, res, next)

        expect(Brand.findAll).toHaveBeenCalled()
        expect(res.send).toHaveBeenCalled()
    })
})
