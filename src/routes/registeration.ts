/*##############################################################################

# define routes under /register

##############################################################################*/

import express, { Request, Response, NextFunction } from 'express';
import createUser from '../middlewares/registration';

const router = express.Router();

router.post('/registration',
  async (req: Request, res: Response): Promise<void> => {
    console.trace('req.body: %o', req.body);
    try {
      // @todo validate POST body
      const username = req.body.username;

      if (username) {
        const user = await createUser(username, req);

        res.status(201).json(user);
      } else
        res.status(400).send('invalid argument');
    } catch (err) {
      console.trace('failed to create new user record in db', err);
      res.sendStatus(500);
    }
  });

export default router;
