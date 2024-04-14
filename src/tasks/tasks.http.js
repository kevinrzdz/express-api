import * as tasksController from './tasks.controller.js';
import { getUser } from '../auth/users.controller.js';

const getAllTasks = (req, res) => {
  const { userId } = req.user;
  const user = getUser(userId);

  res.json({
    user: user.username,
    tasks: tasksController.getAllTasks(userId),
  });
};

const getTask = (req, res) => {
  const { userId } = req.user;
  const { taskId } = req.params;
  const task = tasksController.getTask(userId, taskId);

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
  const newTask = tasksController.addTask(userId, name);

  res.json({ task: newTask });
};

const setTasks = (req, res) => {
  const { userId } = req.user;
  const { tasks: tasksFromRequest } = req.body;

  const updatedTasks = tasksController.setTasks(userId, tasksFromRequest);

  res.json({ tasks: updatedTasks });
};

const deleteTask = (req, res) => {
  const { userId } = req.user;
  const { taskId } = req.params;

  tasksController.deleteTask(userId, taskId);

  res.send();
};

const editTask = (req, res) => {
  const { userId } = req.user;
  const { taskId } = req.params;
  const { name } = req.body;

  const newTask = tasksController.editTask(userId, taskId, name);

  res.json({ task: newTask });
};

const resetTasks = (req, res) => {
  const { userId } = req.user;
  tasksController.bootstrapTasks(userId);
  res.send();
};

export {
  getAllTasks, getTask, addTask, setTasks, deleteTask, editTask, resetTasks,
};
