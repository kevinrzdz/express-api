import request from 'supertest'
import { app, server } from '../../app.js'
import { clearUsers, registerUser } from '../users.controller.js'

beforeAll(() => registerUser('kevin', '1234'))

describe('/login endpoint testing suite', () => {
  it('POST should return 200 when successful login', async () => {
    const response = await request(app)
      .post('/login')
      .set('content-type', 'application/json')
      .send({
        user: 'kevin',
        password: '1234'
      })

    expect(response.status).toBe(200)
  })

  it('POST should return 400 when no data provided', async () => {
    const response = await request(app).post('/login')

    expect(response.status).toBe(400)
  })

  it('POST should return 400 when no username provided', async () => {
    const response = await request(app)
      .post('/login')
      .set('content-type', 'application/json')
      .send({ password: '1234' })

    expect(response.status).toBe(400)
  })

  it('POST should return 400 when no password provided', async () => {
    const response = await request(app)
      .post('/login')
      .set('content-type', 'application/json')
      .send({ user: 'kevin' })

    expect(response.status).toBe(400)
  })

  it('POST should return 401 when invalid credentials provided', async () => {
    const response = await request(app)
      .post('/login')
      .set('content-type', 'application/json')
      .send({
        user: 'kevin',
        password: '12'
      })

    expect(response.status).toBe(401)
  })
})

afterAll((done) => {
  clearUsers()
  server.close(done)
})
