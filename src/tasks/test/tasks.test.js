import request from 'supertest';
import { app, server } from '../../app.js';
import { clearUsers, registerUser } from '../../auth/users.js';

let loginResponse;
const tasks = [{ id: 0, name: 'Take a shower' }, { id: 1, name: 'Do dishes' }];

beforeAll(async () => {
  await registerUser('kevin', '1234');

  loginResponse = await request(app)
    .post('/login')
    .set('content-type', 'application/json')
    .send({
      user: 'kevin',
      password: '1234',
    });
});

describe('/tasks endpoint testing suite', () => {
  it('GET should return all tasks of the given user', async () => {
    const tasksResponse = await request(app)
      .get('/tasks')
      .set('Authorization', `JWT ${loginResponse.body.token}`);

    expect(tasksResponse.body.user).toBe('kevin');
    expect(tasksResponse.body.tasks.length).toBe(tasks.length);
    expect(tasksResponse.body.tasks[0].name).toBe(tasks[0].name);
    expect(tasksResponse.body.tasks[1].name).toBe(tasks[1].name);
  });

  it('GET /:id should return task with the specified id', async () => {
    const taskId = 1;
    const tasksResponse = await request(app)
      .get(`/tasks/${taskId}`)
      .set('Authorization', `JWT ${loginResponse.body.token}`);

    expect(tasksResponse.body.tasks.name).toBe(tasks[taskId].name);
  });

  it('Post /create should create the new task', async () => {
    const tasksResponse = await request(app)
      .post('/tasks/create')
      .set('Authorization', `JWT ${loginResponse.body.token}`)
      .send({ taskName: 'Walk' });

    expect(tasksResponse.body.tasks[2].name).toBe('Walk');
  });
});

afterAll((done) => {
  clearUsers();
  server.close(done);
});
