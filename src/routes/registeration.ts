/*##############################################################################

# define routes under /register

##############################################################################*/

import express, { Request, Response, NextFunction } from 'express';
import pool from '../database/queryDB';
import crypto from 'node:crypto';

interface User {
  id: string;
  username: string;
  api_key: string;
}

const router = express.Router();

// @todo ?define return type
async function createUser(username: string, req: Request): Promise<User> {
  const apiKey = crypto.randomUUID();

  const values = [username, apiKey];
  const sql =
    'INSERT INTO users (username, api_key) VALUES ($1, $2) RETURNING *';

  const user = await pool.query(sql, values);

  return user.rows[0];
}

router.post('/registration', async (req: Request, res: Response) => {
  console.trace('req.body: %o', req.body);
  try {
    // @todo validate POST body
    const username = req.body.username;

    if (username) {
      const user = await createUser(username, req);

      res.status(201).json(user);
    } else
      return res.status(400).send('invalid argument');
  } catch (err) {
    console.trace('failed to create new user record in db', err);
    res.sendStatus(500);
  }
});

export default router;
