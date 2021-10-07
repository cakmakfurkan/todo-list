import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/user';
import dotenv from 'dotenv';
import HttpException from '../exceptions/httpException';
export { agenda } from './agenda';
dotenv.config();

const tokenSecret = process.env.TOKEN_SECRET || 'secret';

export const generateToken = (user: IUser) =>
  jwt.sign({ data: user }, tokenSecret, { expiresIn: '24h' });

export const checkToken = (token: string) =>
  <JwtPayload>jwt.verify(token, tokenSecret);

export const handleJSONParseError = (
  err: HttpException,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (
    err instanceof SyntaxError &&
    err.status >= 400 &&
    err.status < 500 &&
    err.message.indexOf('JSON') !== -1
  ) {
    res.status(400).json({ error: 'error parsing data' });
  } else {
    next();
  }
};
