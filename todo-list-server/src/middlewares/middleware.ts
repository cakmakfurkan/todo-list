import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/user';
import { checkToken } from '../utils/utils';

export default function restrict(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token: string = req.cookies.token;
  if (!token) return res.status(401).send({ message: 'please login' });
  try {
    const user = <IUser>checkToken(token).data;
    res.locals.userData = user;
    next();
  } catch (err) {
    res.status(401).json({
      error: new Error('invalid request'),
    });
  }
}
