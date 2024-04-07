import request from 'supertest';
import { app, server } from '../../app.js';
import { clearUsers, registerUser } from '../../auth/users.js';

let loginResponse;
let createdTasks;
let authorization;

const createTaskSet = () => ([{ name: 'Take a shower' }, { name: 'Do dishes' }]);

beforeAll(async () => {
  await registerUser('kevin', '1234');

  loginResponse = await request(app)
    .post('/login')
    .set('content-type', 'application/json')
    .send({
      user: 'kevin',
      password: '1234',
    });

  authorization = `Bearer ${loginResponse.body.token}`;
});

const makeRequest = async (method, uri, data = null) => {
  let req = request(app)[method](uri).set('Authorization', authorization);
  if (data) {
    req = req.send(data);
  }
  return req;
};

beforeEach(async () => {
  createdTasks = await request(app)
    .put('/tasks')
    .set('Authorization', `Bearer ${loginResponse.body.token}`)
    .send({ tasks: createTaskSet() });
});

describe('/tasks endpoint testing suite', () => {
  it('PUT should replace tasks for the user', async () => {
    const newTasks = createTaskSet()
      .concat({ name: 'Go shopping' });
    const tasksResponse = await makeRequest('put', '/tasks', { tasks: newTasks });

    expect(tasksResponse.statusCode)
      .toBe(200);
    expect(tasksResponse.body.tasks)
      .toHaveLength(newTasks.length);

    const expectedTasks = newTasks.map((task) => expect.objectContaining({ name: task.name }));
    expect(tasksResponse.body.tasks)
      .toEqual(expect.arrayContaining(expectedTasks));
  });

  it('GET should return all tasks for the given user', async () => {
    const tasksResponse = await makeRequest('get', '/tasks');

    expect(tasksResponse.statusCode)
      .toBe(200);
    expect(tasksResponse.body.tasks)
      .toHaveLength(createTaskSet().length);
    createTaskSet()
      .forEach((task, index) => {
        expect(tasksResponse.body.tasks[index].name)
          .toBe(task.name);
      });
  });

  it('GET /:taskId should return a specific task by id', async () => {
    const taskId = createdTasks.body.tasks[0].id;
    const taskResponse = await makeRequest('get', `/tasks/${taskId}`);

    expect(taskResponse.statusCode)
      .toBe(200);
    expect(taskResponse.body.task)
      .toBeDefined();
    expect(taskResponse.body.task.id)
      .toBe(taskId);
    expect(taskResponse.body.task.name)
      .toBe('Take a shower');
  });

  it('POST should create a new task', async () => {
    const newTaskName = 'Walk the dog';
    const tasksResponse = await makeRequest('post', '/tasks/create', { name: newTaskName });

    expect(tasksResponse.statusCode)
      .toBe(200);
    expect(tasksResponse.body.task)
      .toBeDefined();
    expect(tasksResponse.body.task.name)
      .toEqual(newTaskName);
  });

  it('DELETE should delete the specified task', async () => {
    const taskToAdd = { name: 'Workout' };
    const addResponse = await makeRequest('post', '/tasks/create', taskToAdd);

    const taskIdToDelete = addResponse.body.task.id;

    const deleteResponse = await makeRequest('delete', `/tasks/${taskIdToDelete}`);

    expect(deleteResponse.statusCode)
      .toBe(200);

    const getResponse = await makeRequest('get', '/tasks');

    expect(getResponse.body.tasks)
      .not
      .toContainEqual(expect.objectContaining({ id: taskIdToDelete }));
  });

  it('PUT /:taskId should edit the given task', async () => {
    const taskId = createdTasks.body.tasks[0].id;
    const oldTask = createdTasks.body.tasks[0];
    const taskName = 'Workout';

    const tasksResponse = await makeRequest('put', `/tasks/${taskId}`, { name: taskName });

    expect(tasksResponse.statusCode)
      .toBe(200);
    expect(tasksResponse.body.task)
      .not
      .toContainEqual(oldTask);
    expect(tasksResponse.body.task.name)
      .toEqual(taskName);
  });
});

afterAll((done) => {
  clearUsers();
  server.close(done);
});
