import express from 'express';
import * as tasksController from './tasks-controller.js';

const router = express.Router();

router.route('/')
  .get(tasksController.getAllTasks)
  .put(tasksController.setTasks)
  .delete(tasksController.resetTasks);

router.route('/:taskId')
  .get(tasksController.getTask)
  .put(tasksController.editTask)
  .delete(tasksController.deleteTask);

router.route('/create')
  .post(tasksController.addTask);

export default router;
