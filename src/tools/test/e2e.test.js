import request from 'supertest';
import { app, server } from '../../app.js';
import { clearUsers, registerUser } from '../../auth/users.controller.js';

beforeAll(() => registerUser('kevin', '1234'));

describe('/ endpoint testing suite', () => {
  it('GET should return 200 when jwt is valid', async () => {
    const loginResponse = await request(app)
      .post('/login')
      .set('content-type', 'application/json')
      .send({
        user: 'kevin',
        password: '1234',
      });

    const response = await request(app)
      .get('/')
      .set('Authorization', `Bearer ${loginResponse.body.token}`);

    expect(response.status).toBe(200);
  });

  it('GET should return 401 when no jwt provided', async () => {
    const response = await request(app)
      .get('/');

    expect(response.status).toBe(401);
  });

  it('GET should return 401 when invalid jwt provided', async () => {
    const response = await request(app)
      .get('/')
      .set('Authorization', 'JWT invalidToken');

    expect(response.status).toBe(401);
  });
});

afterAll((done) => {
  clearUsers();
  server.close(done);
});
