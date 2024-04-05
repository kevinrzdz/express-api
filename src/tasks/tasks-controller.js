import * as tasks from './tasks.js';
import { getUser } from '../auth/users.js';

const getAllTasks = (req, res) => {
  const { userId } = req.user;
  const user = getUser(userId);
  res.json({
    user: user.username,
    tasks: tasks.getAllTasks(userId),
  });
};

const getTask = (req, res) => {
  const { userId } = req.user;
  const { taskId } = req.params;
  const user = getUser(userId);
  res.json({
    user: user.username,
    tasks: tasks.getTask(userId, taskId),
  });
};

const addTask = (req, res) => {
  const { userId } = req.user;
  const { taskName } = req.body;
  const user = getUser(userId);

  res.json({
    user: user.username,
    tasks: tasks.addTask(userId, taskName),
  });
};

export { getAllTasks, getTask, addTask };
