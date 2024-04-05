const tasksDatabase = {};

const bootstrapTasks = (userId) => {
  tasksDatabase[userId] = [{
    id: 0,
    name: 'Take a shower',
  }, {
    id: 1,
    name: 'Do dishes',
  }];
};

const getAllTasks = (userId) => tasksDatabase[userId];

const getTask = (userId, taskId) => tasksDatabase[userId]
  .find((task) => task.id.toString() === taskId);

const addTask = (userId, taskName) => {
  tasksDatabase[userId].push({ id: 2, name: taskName });
  return tasksDatabase[userId];
};

const setTasks = (userId, tasks) => {
  tasksDatabase[userId] = tasks;
};

export {
  bootstrapTasks, getAllTasks, getTask, addTask, setTasks,
};
