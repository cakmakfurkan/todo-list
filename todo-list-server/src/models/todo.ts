import { Schema, model, Document, Model } from 'mongoose';

export interface IToDo extends Document {
  _id?: string;
  userID: string;
  task: string;
  date: Date;
  isRemind: boolean;
  createdAt?: Date;
}

const schema: Schema = new Schema({
  userID: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  task: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  isRemind: {
    type: Boolean,
    required: true,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const ToDo: Model<IToDo> = model<IToDo>('ToDo', schema);
