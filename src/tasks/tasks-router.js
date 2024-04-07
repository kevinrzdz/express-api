import express from 'express';
import * as tasksController from './tasks-controller.js';

const router = express.Router();

router.route('/').get(tasksController.getAllTasks);

router.route('/').put(tasksController.setTasks);

router.route('/:taskId').get(tasksController.getTask);

// router.route('/:taskId').get(tasksController.editTask);

router.route('/:taskId').delete(tasksController.deleteTask);

router.route('/create').post(tasksController.addTask);

export default router;
