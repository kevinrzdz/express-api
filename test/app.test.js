import request from 'supertest';
import { app, server } from '../src/app.js';

describe('/login endpoint testing suite', () => {
  it('POST should return 200 when successful login', async () => {
    const response = await request(app)
      .post('/auth/login')
      .set('content-type', 'application/json')
      .send({
        user: 'kevin',
        password: '1234',
      });

    expect(response.status)
      .toBe(200);
  });

  it('POST should return 400 when no data provided', async () => {
    const response = await request(app)
      .post('/auth/login');

    expect(response.status)
      .toBe(400);
  });

  it('POST should return 400 when no username provided', async () => {
    const response = await request(app)
      .post('/auth/login')
      .set('content-type', 'application/json')
      .send({ password: '1234' });

    expect(response.status)
      .toBe(400);
  });

  it('POST should return 400 when no password provided', async () => {
    const response = await request(app)
      .post('/auth/login')
      .set('content-type', 'application/json')
      .send({ user: 'kevin' });

    expect(response.status)
      .toBe(400);
  });

  it('POST should return 401 when invalid credentials provided', async () => {
    const response = await request(app)
      .post('/auth/login')
      .set('content-type', 'application/json')
      .send({
        user: 'kevin',
        password: '12',
      });

    expect(response.status)
      .toBe(401);
  });
});

describe('/ endpoint testing suite', () => {
  it('GET should return 200 when jwt is valid', async () => {
    const loginResponse = await request(app)
      .post('/auth/login')
      .set('content-type', 'application/json')
      .send({
        user: 'kevin',
        password: '1234',
      });

    const response = await request(app)
      .get('/')
      .set('Authorization', `JWT ${loginResponse.body.token}`);

    expect(response.status)
      .toBe(200);
  });

  it('GET should return 401 when no jwt provided', async () => {
    const response = await request(app)
      .get('/');

    expect(response.status)
      .toBe(401);
  });

  it('GET should return 401 when invalid jwt provided', async () => {
    const response = await request(app)
      .get('/')
      .set('Authorization', 'JWT invalidToken');

    expect(response.status)
      .toBe(401);
  });
});

afterAll((done) => {
  server.close(done);
});
