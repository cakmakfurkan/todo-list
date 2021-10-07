import {
  createUser,
  login,
  logout,
  updatePassword,
  deleteUser,
} from '../controllers/auth.controller';
import express from 'express';
export const router = express.Router();
import restrict from '../middlewares/middleware';

router.post('/login', login);

router.post('/createUser', createUser);

router.get('/logout', restrict, logout);

router.patch('/updatePassword', restrict, updatePassword);

router.delete('/deleteUser', restrict, deleteUser);
