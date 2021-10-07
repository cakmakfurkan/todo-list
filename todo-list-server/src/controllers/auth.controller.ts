import { User, IUser } from '../models/user';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/utils';
import { agenda } from '../utils/agenda';

const rounds = 10;

export const login = (req: Request, res: Response) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user)
        res.status(404).json({ error: 'no user with that email found' });
      else {
        bcrypt.compare(req.body.password, user.password, (error, match) => {
          if (error) res.status(500).json(error);
          else if (match)
            res
              .cookie('token', generateToken(user), {
                httpOnly: true,
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000), //24 hour
              })
              .status(201)
              .json({ message: 'login is successful' });
          else res.status(403).json({ error: 'passwords do not match' });
        });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
};

export const logout = (req: Request, res: Response) => {
  res
    .cookie('token', '', {
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), //24 hour
    })
    .status(200)
    .json({ message: 'logout is successful' });
};

export const createUser = (req: Request, res: Response) => {
  const body = req.body;

  if (
    !body.email ||
    !body.password ||
    !body.name ||
    !body.permissions ||
    !body.authorizedAreas ||
    !body.role
  )
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
          .then(user => {
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

export const updateUserPassword = (req: Request, res: Response) => {
  const body = req.body;

  if (!body.email || !body.newPassword)
    return res.status(400).json({ error: 'bad request' });

  User.findOne({ email: body.email, systemID: body.systemID }).then(user => {
    if (!user) return res.status(404).json({ error: 'user not found' });

    bcrypt.hash(body.newPassword, rounds, async (error, hash) => {
      if (error) return res.status(500).json(error);

      User.findOneAndUpdate({ email: body.email }, { password: hash }).then(
        user => {
          if (!user) return res.status(404).json({ error: 'user not found' });

          res.status(200).json({ message: 'password is successfully updated' });
        },
      );
    });
  });
};

export const updatePassword = (req: Request, res: Response) => {
  const body = req.body;

  if (!body.email || !body.oldPassword || !body.newPassword)
    return res.status(400).json({ error: 'bad request' });

  User.findOne({ email: body.email, systemID: body.systemID }).then(user => {
    if (!user) return res.status(404).json({ error: 'user not found' });

    bcrypt.compare(body.oldPassword, user.password, (error, match) => {
      if (error) res.status(500).json(error);
      else if (match)
        bcrypt.hash(body.newPassword, rounds, async (error, hash) => {
          if (error) return res.status(500).json(error);

          User.findOneAndUpdate(
            {
              email: body.email,
              systemID: body.systemID,
            },
            { password: hash },
          ).then(user => {
            if (!user) return res.status(404).json({ error: 'user not found' });

            res
              .status(200)
              .json({ message: 'password is succesfully updated' });
          });
        });
      else res.status(403).json({ error: 'passwords do not match' });
    });
  });
};

export const deleteUser = (req: Request, res: Response) => {
  const body = req.body;

  if (!body.email) return res.status(400).json({ error: 'bad request' });

  User.findByIdAndDelete({
    email: body.email,
    systemID: body.systemID,
  })
    .then(result => {
      if (!result) return res.status(404).json({ error: 'user not found' });

      res.status(200).json({ message: 'user is successfully deleted' });
    })
    .catch(error => {
      res.status(500).json({ error: error });
    });
};

export const updateUserPermissions = (req: Request, res: Response) => {
  const body = req.body;

  if (!body.email || !body.permissions)
    return res.status(400).json({ error: 'bad request' });

  User.findOneAndUpdate(
    {
      email: body.email,
      systemID: body.systemID,
    },
    {
      permissions: body.permissions,
    },
  )
    .then(response => {
      if (!response) return res.status(404).json({ error: 'user not found' });

      res.status(200).json({ message: 'user is successfully updated' });
    })
    .catch(error => {
      res.status(500).json({ error: error });
    });
};

export const getUsers = (req: Request, res: Response) => {
  const usersProjection = {
    __v: false,
    _id: false,
    password: false,
  };

  User.find({ systemID: req.query.systemID }, usersProjection)
    .then(users => {
      res.status(200).json({ users: users });
    })
    .catch(error => {
      res.status(500).json({ error: error });
    });
};

export const getAllUsers = (req: Request, res: Response) => {
  const usersProjection = {
    __v: false,
    _id: false,
    password: false,
  };

  User.find({}, usersProjection)
    .then(users => {
      res.status(200).json({ users: users });
    })
    .catch(error => {
      res.status(500).json({ error: error });
    });
};
