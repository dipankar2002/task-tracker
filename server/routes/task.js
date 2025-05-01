import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { completeTask, createTask, deleteTask, getTasks, unCompleteTask, updateTask } from '../controllers/task.controller.js';
const router = express.Router();

router.delete('/delete/:taskId', authMiddleware, deleteTask);
router.put('/update/:taskId', authMiddleware, updateTask);
router.put('/complete/:taskId', authMiddleware, completeTask);
router.put('/uncomplete/:taskId', authMiddleware, unCompleteTask);
router.post('/create/:projectId', authMiddleware, createTask);
router.get('/allTasks/:projectId', authMiddleware, getTasks);

export default router;
