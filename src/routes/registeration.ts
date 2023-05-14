/*##############################################################################

# define routes under /register

##############################################################################*/

import express, { Request, Response, NextFunction } from 'express';
import createUser from '../middlewares/registration';
import pool from '../database/queryDB';
import prng from '../../modules/prng/support/js/Alea';
let random = null;

const router = express.Router();

/*
summary: take email as input, create a new User, store the User in db, and send the created User
input: email
output: User
process:
    extract email from request body
        if body doesn't exist, send client error response and return
    generate primary key
    make `INSERT INTO RETURNING` query to public.users@db-server
    send the RETURNINGed User to the client
    ---
    catch & handle errors
test: tests/endpoints/registration/post.js
todos:
  validate req body and react according to result
  ?define return type
*/
router.post('/registration',
  async (req: Request, res: Response) => {
    const email = req.body.email;
    if (!email)
      return res.sendStatus(400);

    try {
      let primaryKey = prng([Date.now()]).uint32();
      const sql = 'INSERT INTO users (id, email) values ($1, $2) RETURNING *';

      const user = await pool.query(sql, [primaryKey, email]);

      res.status(201).json(user.rows[0]);
    } catch (err) {
      console.trace('db failed to create new user record', err);
      res.sendStatus(500);
    }
  });

export default router;
