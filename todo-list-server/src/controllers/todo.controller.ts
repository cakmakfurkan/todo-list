import { ToDo, IToDo } from '../models/todo';
import { Request, Response } from 'express';
import * as util from '../utils/utils';
import { IUser } from '../models/user';

export const deleteTodo = (req: Request, res: Response): void => {
  const body = req.body;

  ToDo.findByIdAndDelete({ _id: body.id })
    .then(toDo => {
      if (!toDo)
        return res.status(404).json({ error: 'no to do with that id found' });

      util.agenda
        .cancel({ name: 'to do reminder', toDoID: toDo.id })
        .catch(error => {
          res.status(500).json(error);
        });
      res.status(200).json({ message: 'deleted successfully' });
    })
    .catch(error => {
      res.status(500).json(error);
    });
};

export const createToDo = async (
  req: Request,
  res: Response,
): Promise<Response | undefined> => {
  const body: IToDo = req.body;
  const user: IUser = res.locals.userData;
  body.userID = user._id ?? '';

  if (!body.userID || !body.task || !body.date || body.isRemind === undefined)
    return res.status(400).send({ error: 'bad request' });

  const newToDo: IToDo = await ToDo.create(body);
  newToDo
    .save()
    .then(() => {
      if (newToDo.isRemind) {
        try {
          util.agenda
            .create('to do reminder', { toDoID: newToDo.id })
            .schedule(newToDo.date)
            .unique({ toDoID: newToDo.id })
            .save();
        } catch (error) {
          res.status(500).json(error);
        }
      }
      return res.status(201).json({ message: 'to do successfully created' });
    })
    .catch(error => {
      res.status(500).json(error);
    });
};

export const updateToDo = (
  req: Request,
  res: Response,
): Response | undefined => {
  const body: IToDo = req.body;
  const user: IUser = res.locals.userData;
  body.userID = user._id ?? '';

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
      if (body.isRemind) {
        try {
          util.agenda
            .create('to do reminder', { toDoID: body._id })
            .schedule(query.date)
            .unique({ toDoID: body._id })
            .save();
        } catch (error) {
          res.status(500).json(error);
        }
      } else {
        util.agenda
          .cancel({ name: 'to do reminder', toDoID: body._id })
          .catch(error => {
            res.status(500).json(error);
          });
      }

      res.status(200).send({ message: 'to do is updated successfully' });
    })
    .catch(error => {
      res.status(500).json({ error });
    });
};

export const getToDos = (req: Request, res: Response): void => {
  const user: IUser = res.locals.userData;
  const toDoProjection = {
    __v: false,
    userID: false,
  };

  ToDo.find({ userID: user._id }, toDoProjection)
    .then(toDos => {
      res.status(200).json({ toDos: toDos });
    })
    .catch(error => {
      res.status(500).json({ error: error });
    });
};
