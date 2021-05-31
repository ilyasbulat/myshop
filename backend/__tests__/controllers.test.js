const request = require('supertest')
const path = require('path')
const fs = require('fs')
const app = require('../app/app')
const truncate = require('../test-utils/truncate')
const clearStatic = require('../test-utils/file-delete')

describe('/api/user/signup endpoint tests', () => {
    afterAll(async () => {
        await truncate()
    })
    it('correct username should return 200 status code', async () => {
        const res = await request(app).post('/api/user/signup').send({
            email: 'test22@test.com',
            password: 'password',
        })
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('token')
    })
    it('already exists email should return 400 status code', async () => {
        const res = await request(app).post('/api/user/signup').send({
            email: 'test22@test.com',
            password: 'password',
        })
        expect(res.statusCode).toEqual(400)
    })
    it('empty email property should return 400 status code', async () => {
        const res = await request(app).post('/api/user/signup').send({
            email: '',
            password: 'password',
        })
        expect(res.statusCode).toEqual(400)
    })
    it('empty password property should return 400 status code', async () => {
        const res = await request(app).post('/api/user/signup').send({
            email: 'test@test.com',
            password: '',
        })
        expect(res.statusCode).toEqual(400)
    })
})

describe('/api/user/signin endpoint tests', () => {
    afterAll(async () => {
        await truncate()
    })
    it('create user and login should return 200 status code', async () => {
        const creds = {
            email: 'test@test.com',
            password: 'password',
        }
        await request(app).post('/api/user/signup').send(creds)
        const res = await request(app).post('/api/user/signin').send(creds)
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('token')
    })
    it('empty email property should return 400 status code', async () => {
        const res = await request(app).post('/api/user/signin').send({
            email: '',
            password: 'password',
        })
        expect(res.statusCode).toEqual(400)
    })
    it('empty password property should return 400 status code', async () => {
        const res = await request(app).post('/api/user/signin').send({
            email: 'test@test.com',
            password: '',
        })
        expect(res.statusCode).toEqual(400)
    })
})

describe('/api/type endpoint tests', () => {
    afterAll(async () => {
        await truncate()
    })
    it('user with role ADMIN can create type should return 200 status code', async () => {
        const creds = {
            email: 'test@test.com',
            password: 'password',
            role: 'ADMIN',
        }
        const res = await request(app).post('/api/user/signup').send(creds)
        const { token } = res.body
        const typeRes = await request(app)
            .post('/api/type')
            .set('Authorization', 'Bearer ' + token)
            .send({
                name: 'phone',
            })

        expect(typeRes.statusCode).toEqual(200)
    })
    it('get request to type endpoint should return status 200 and data type of array', async () => {
        const res = await request(app).get('/api/type').send()
        const { types } = res.body

        expect(res.statusCode).toEqual(200)

        expect(Array.isArray(types)).toBe(true)
    })
})
describe('/api/brand endpoint tests', () => {
    afterAll(async () => {
        await truncate()
    })
    it('user with role ADMIN can create brand should return 200 status code', async () => {
        const creds = {
            email: 'test@test.com',
            password: 'password',
            role: 'ADMIN',
        }
        const res = await request(app).post('/api/user/signup').send(creds)
        const { token } = res.body
        const brandRes = await request(app)
            .post('/api/brand')
            .set('Authorization', 'Bearer ' + token)
            .send({
                name: 'apple',
            })

        expect(brandRes.statusCode).toEqual(200)
    })
    it('get request to brand endpoint should return status 200 and data type of array', async () => {
        const res = await request(app).get('/api/brand').send()
        const { brands } = res.body

        expect(res.statusCode).toEqual(200)
        expect(Array.isArray(brands)).toBe(true)
    })
})

describe('/api/device endpoint tests', () => {
    afterAll(async () => {
        await truncate()
        // clearStatic()
    })

    const filePath = path.resolve(__dirname, '..', 'testFiles', 'test.jpg')

    it('POST /api/device create Device entity and image upload', async () => {
        const creds = {
            email: 'test@test.com',
            password: 'password',
            role: 'ADMIN',
        }
        const res = await request(app).post('/api/user/signup').send(creds)
        const { token } = res.body

        await request(app)
            .post('/api/brand')
            .set('Authorization', 'Bearer ' + token)
            .send({
                name: 'apple',
            })

        await request(app)
            .post('/api/type')
            .set('Authorization', 'Bearer ' + token)
            .send({
                name: 'phone',
            })

        const brandRes = await request(app).get('/api/brand').send()
        const { brands } = brandRes.body
        const typeRes = await request(app).get('/api/type').send()
        const { types } = typeRes.body

        const deviceRes = await request(app)
            .post('/api/device')
            .set('Authorization', 'Bearer ' + token)
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .field('name', 'samsung')
            .field('price', 100)
            .field('brandId', brands[0].id)
            .field('typeId', types[0].id)
            .attach('img', filePath)

        expect(deviceRes.statusCode).toEqual(200)
    })
})
