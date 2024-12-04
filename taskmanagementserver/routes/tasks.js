import express from 'express';
import { getAllTasks, newTask, searchTask, getTaskById, updateTaskById, deleteTaskById, markTaskAsCompleted } from '../controllers/task-controller.js'; // Import the controller function (include .js extension)

const router = express.Router();

router.post('/', newTask)
router.get('/', getAllTasks)
router.get('/search', searchTask)
router.get('/:id', getTaskById)
router.put('/:id', updateTaskById)
router.delete('/:id', deleteTaskById)
router.patch('/:id/complete', markTaskAsCompleted)

export default router;
