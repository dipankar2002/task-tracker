import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { createProject, deleteProject, getProjects } from '../controllers/project.controller.js';
const router = express.Router();

router.delete('/delete/:id', authMiddleware, deleteProject);
router.post('/create', authMiddleware, createProject);
router.get('/allProjects', authMiddleware, getProjects);

export default router;
