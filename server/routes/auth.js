import express from 'express';
import { signup, login, logout, deleteUser, checkUser, users } from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.delete('/deleteUser', authMiddleware, deleteUser);

router.get("/check", authMiddleware, checkUser);
router.get("/allUsers", authMiddleware, users);

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

export default router;
