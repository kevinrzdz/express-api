import * as tasksHttps from './tasks.https.js';
import { getUser } from '../auth/users.https.js';

const getAllTasks = (req, res) => {
  const { userId } = req.user;
  const user = getUser(userId);

  res.json({
    user: user.username,
    tasks: tasksHttps.getAllTasks(userId),
  });
};

const getTask = (req, res) => {
  const { userId } = req.user;
  const { taskId } = req.params;
  const task = tasksHttps.getTask(userId, taskId);

  if (!task) {
    res.status(404)
      .json({ message: 'Task not found' });
  } else {
    res.json({ task });
  }
};

const addTask = (req, res) => {
  const { userId } = req.user;
  const { name } = req.body;
  const newTask = tasksHttps.addTask(userId, name);

  res.json({ task: newTask });
};

const setTasks = (req, res) => {
  const { userId } = req.user;
  const { tasks: tasksFromRequest } = req.body;

  const updatedTasks = tasksHttps.setTasks(userId, tasksFromRequest);

  res.json({ tasks: updatedTasks });
};

const deleteTask = (req, res) => {
  const { userId } = req.user;
  const { taskId } = req.params;

  tasksHttps.deleteTask(userId, taskId);

  res.send();
};

const editTask = (req, res) => {
  const { userId } = req.user;
  const { taskId } = req.params;
  const { name } = req.body;

  const newTask = tasksHttps.editTask(userId, taskId, name);

  res.json({ task: newTask });
};

const resetTasks = (req, res) => {
  const { userId } = req.user;
  tasksHttps.bootstrapTasks(userId);
  res.send();
};

export {
  getAllTasks, getTask, addTask, setTasks, deleteTask, editTask, resetTasks,
};
