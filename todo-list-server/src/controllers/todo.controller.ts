import { ToDo, IToDo } from '../models/todo';
import { Request, Response } from 'express';
import * as util from '../utils/utils';

export const deleteTodo = (req: Request, res: Response) => {
  const body = req.body;

  ToDo.findByIdAndDelete({ _id: body.id })
    .then(toDo => {
      if (!toDo)
        return res.status(404).json({ error: 'no to do with that id found' });

      res.status(200).json({ message: 'deleted successfully' });
    })
    .catch(error => {
      res.status(500).json(error);
    });
};

export const createToDo = async (req: Request, res: Response) => {
  const body: IToDo = req.body;

  if (!body.userID || !body.task || !body.date || body.isRemind === undefined)
    return res.status(400).send({ error: 'bad request' });

  const newToDo: IToDo = await ToDo.create(body);
  newToDo
    .save()
    .then(() => {
      if (newToDo.isRemind) {
        try {
          util.agenda
            .create('to do reminder', { id: newToDo.id })
            .schedule(newToDo.date)
            .unique({ id: newToDo.id })
            .save();
        } catch (error) {
          console.log(error);
        }
      }
      res.status(201).json({ message: 'to do successfully created' });
    })
    .catch(error => {
      res.status(500).json(error);
    });
};

export const updateToDo = (req: Request, res: Response) => {
  const body = <IToDo>req.body;

  if (
    !body._id ||
    !body.userID ||
    !body.task ||
    !body.date ||
    body.isRemind === undefined
  )
    return res.status(400).send({ error: 'bad request' });

  ToDo.findOneAndUpdate({ _id: body._id }, body)
    .then(query => {
      if (!query)
        return res.status(404).json({ error: 'no to do with that id found' });
      if (query.isRemind) {
        try {
          util.agenda
            .create('to do reminder', { id: query.id })
            .schedule(query.date)
            .unique({ id: query.id })
            .save();
        } catch (error) {
          console.log(error);
        }
      } else {
        util.agenda
          .jobs({ name: 'to do reminder', id: query.id })
          .then(jobs => {
            if (jobs[0]) {
              jobs[0].remove();
            }
          })
          .catch(error => {
            console.log(error);
          });
      }

      res.status(200).send({ message: 'to do is updated successfully' });
    })
    .catch(error => {
      res.status(500).json({ error });
    });
};

export const getToDos = (req: Request, res: Response) => {
  const body = req.query;

  ToDo.find({ userID: body.userID })
    .then(toDos => {
      res.status(200).json({ toDos: toDos });
    })
    .catch(error => {
      res.status(500).json({ error: error });
    });
};
