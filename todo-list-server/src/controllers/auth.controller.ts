import { User, IUser } from '../models/user';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/utils';

const rounds = 10;

export const login = (req: Request, res: Response): void => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user)
        res.status(404).json({ error: 'no user with that email found' });
      else {
        bcrypt.compare(req.body.password, user.password, (error, match) => {
          if (error) res.status(500).json(error);
          else if (match) {
            user.password = '';
            res
              .cookie('token', generateToken(user), {
                //domain: '.localhost',
                httpOnly: false,
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000), //24 hour
              })
              .status(201)
              .json({ message: 'login is successful' });
          } else {
            res.status(403).json({ error: 'passwords do not match' });
          }
        });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
};

export const logout = (req: Request, res: Response): void => {
  res
    .cookie('token', '', {
      httpOnly: false,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), //24 hour
    })
    .status(200)
    .json({ message: 'logout is successful' });
};

export const createUser = (
  req: Request,
  res: Response,
): Response | undefined => {
  const body: IUser = req.body;

  if (!body.email || !body.password || !body.name)
    return res.status(400).json({ error: 'bad request' });

  User.findOne({ email: body.email })
    .then(response => {
      if (response)
        return res.status(403).json({ error: 'email is already registered' });

      bcrypt.hash(body.password, rounds, async (error, hash) => {
        if (error) return res.status(500).json(error);

        body.password = hash;
        const newUser: IUser = await User.create(body);
        newUser
          .save()
          .then(() => {
            res.status(201).json({ message: 'user successfully created' });
          })
          .catch(error => {
            res.status(500).json(error);
          });
      });
    })
    .catch(error => {
      res.status(500).json(error);
    });
};

export const updatePassword = (
  req: Request,
  res: Response,
): Response | undefined => {
  const body = req.body;

  if (!body.email || !body.oldPassword || !body.newPassword)
    return res.status(400).json({ error: 'bad request' });

  User.findOne({ email: body.email }).then(user => {
    if (!user) return res.status(404).json({ error: 'user not found' });

    bcrypt.compare(body.oldPassword, user.password, (error, match) => {
      if (error) res.status(500).json(error);
      else if (match)
        bcrypt.hash(body.newPassword, rounds, async (error, hash) => {
          if (error) return res.status(500).json(error);

          User.findOneAndUpdate(
            {
              email: body.email,
            },
            { password: hash },
          ).then(user => {
            if (!user) return res.status(404).json({ error: 'user not found' });

            res
              .status(200)
              .json({ message: 'password is successfully updated' });
          });
        });
      else res.status(403).json({ error: 'passwords do not match' });
    });
  });
};

export const deleteUser = (req: Request, res: Response): void => {
  const user: IUser = res.locals.userData;

  User.findByIdAndDelete({
    _id: user._id,
  })
    .then(result => {
      if (!result) return res.status(404).json({ error: 'user not found' });
      res.status(200).json({ message: 'user is successfully deleted' });
    })
    .catch(error => {
      res.status(500).json({ error: error });
    });
};
