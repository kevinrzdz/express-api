const tasksDatabase = {};
let taskIdCounter = 0;

const bootstrapTasks = (userId) => {
  tasksDatabase[userId] = [];
};

const getAllTasks = (userId) => tasksDatabase[userId];

const getTask = (userId, taskId) => tasksDatabase[userId]
  .find((task) => task.id === Number(taskId));

const addTask = (userId, taskName) => {
  const newTaskId = taskIdCounter;
  taskIdCounter += 1;
  const newTask = { id: newTaskId, name: taskName };
  tasksDatabase[userId].push(newTask);
  return newTask;
};

const setTasks = (userId, tasksFromRequest) => {
  // Reset the tasks array for the user
  tasksDatabase[userId] = [];

  // Assign IDs and populate the tasks array for the user
  tasksFromRequest.forEach((task) => {
    tasksDatabase[userId].push({ id: taskIdCounter += 1, name: task.name });
  });

  return tasksDatabase[userId];
};

const deleteTask = (userId, taskId) => {
  tasksDatabase[userId] = tasksDatabase[userId].filter((task) => task.id !== Number(taskId));
};

export {
  bootstrapTasks, getAllTasks, getTask, addTask, setTasks, deleteTask,
};
