import request from 'supertest';
import { app, server } from '../../app.js';
import { clearUsers, registerUser } from '../../auth/users.js';

let loginResponse;
let createdTasks;

const createTaskSet = () => ([
  { name: 'Take a shower' },
  { name: 'Do dishes' },
]);

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

beforeEach(async () => {
  createdTasks = await request(app)
    .put('/tasks')
    .set('Authorization', `Bearer ${loginResponse.body.token}`)
    .send({ tasks: createTaskSet() });
});

describe('/tasks endpoint testing suite', () => {
  it('should replace tasks for the user', async () => {
    const newTasks = createTaskSet()
      .concat({ name: 'Go shopping' });
    const tasksResponse = await request(app)
      .put('/tasks')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send({ tasks: newTasks });

    expect(tasksResponse.statusCode)
      .toBe(200);
    expect(tasksResponse.body.tasks)
      .toHaveLength(newTasks.length);

    // Create an array of expectations that only looks for the `name` property
    const expectedTasksWithNamesOnly = newTasks.map((task) => expect.objectContaining({ name: task.name }));
    expect(tasksResponse.body.tasks)
      .toEqual(expect.arrayContaining(expectedTasksWithNamesOnly));
  });

  it('should return all tasks for the given user', async () => {
    const tasksResponse = await request(app)
      .get('/tasks')
      .set('Authorization', `Bearer ${loginResponse.body.token}`);

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

  it('should return a specific task by id', async () => {
    const taskId = createdTasks.body.tasks[0].id;
    const taskResponse = await request(app)
      .get(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${loginResponse.body.token}`);

    expect(taskResponse.statusCode)
      .toBe(200);
    expect(taskResponse.body.task)
      .toBeDefined();
    expect(taskResponse.body.task.id)
      .toBe(taskId);
    expect(taskResponse.body.task.name)
      .toBe('Take a shower');
  });

  it('should create a new task', async () => {
    const newTaskName = 'Walk the dog';
    const tasksResponse = await request(app)
      .post('/tasks/create')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send({ name: newTaskName });

    expect(tasksResponse.statusCode)
      .toBe(200);
    expect(tasksResponse.body.task)
      .toBeDefined();
    expect(tasksResponse.body.task.name)
      .toEqual(newTaskName);
  });

  it('should delete the specified task', async () => {
    const taskToAdd = { name: 'Workout' };
    const addResponse = await request(app)
      .post('/tasks/create')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send(taskToAdd);

    const taskIdToDelete = addResponse.body.task.id;

    const deleteResponse = await request(app)
      .delete(`/tasks/${taskIdToDelete}`)
      .set('Authorization', `Bearer ${loginResponse.body.token}`);

    expect(deleteResponse.statusCode)
      .toBe(200);

    const getResponse = await request(app)
      .get('/tasks')
      .set('Authorization', `Bearer ${loginResponse.body.token}`);

    expect(getResponse.body.tasks)
      .not
      .toContainEqual(
        expect.objectContaining({ id: taskIdToDelete }),
      );
  });
});

afterAll((done) => {
  clearUsers();
  server.close(done);
});
