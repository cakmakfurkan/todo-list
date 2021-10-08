import mongoose from 'mongoose';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { router as authRouter } from './routes/auth';
import { router as todoRouter } from './routes/todo';
import { handleJSONParseError } from './utils/utils';
import dotenv from 'dotenv';
dotenv.config();
const app = express();

const dbURI = 'mongodb://127.0.0.1/todo-list';

app.use(express.json());
app.use(cors());
app.use(handleJSONParseError);
app.use(cookieParser());
app.use('/api/auth', authRouter);
app.use('/api/todo', todoRouter);

mongoose.connect(process.env.MONGODB_URI || dbURI, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const db = mongoose.connection;

db.on('error', err => {
  console.log(err);
});

db.once('open', () => {
  console.log('db opened successfully');
});

app.listen(process.env.PORT || 2400, () => {
  console.log('Server started: ' + process.env.PORT || 2400);
});
