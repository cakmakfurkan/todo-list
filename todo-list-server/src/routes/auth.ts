import {
  createUser,
  login,
  logout,
  updateUserPassword,
  updatePassword,
  updateUserPermissions,
  deleteUser,
  getUsers,
  getAllUsers,
} from '../controllers/auth.controller';
import express from 'express';
export const router = express.Router();
import restrict from '../middlewares/middleware';

router.post('/login', login);

router.get('/logout', restrict, logout);

router.post('/createUser', restrict, createUser);

router.patch('/updateUserPassword', restrict, updateUserPassword);

router.patch('/updatePassword', restrict, updatePassword);

router.patch('/updatePermissions', restrict, updateUserPermissions);

router.delete('/deleteUser', restrict, deleteUser);

router.get('/getUsers', restrict, getUsers);

router.get('/getAllUsers', restrict, getAllUsers);
