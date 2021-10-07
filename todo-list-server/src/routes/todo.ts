import {
  createToDo,
  deleteTodo,
  getToDos,
  updateToDo,
} from '../controllers/todo.controller';
import express from 'express';
export const router = express.Router();
import restrict from '../middlewares/middleware';

router.post('/create', restrict, createToDo);

router.delete('/delete', restrict, deleteTodo);

router.put('/update', restrict, updateToDo);

router.get('/get', restrict, getToDos);
