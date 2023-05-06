/*##############################################################################

# write HTTP request metadata to db

##############################################################################*/

import { Request, Response, NextFunction } from 'express';
import pool from '../database/queryDB';

// @todo define return type `Promise<pg.result>`?
async function collectRequest(req: Request, res: Response, next: NextFunction) {
  const request = {
    request: {
      headers: {
        method: req.method,
        path: req.path,
        protocol: req.protocol,
        host: req.header('Host'),
        userAgent: req.header('User-Agent'),
        accept: req.header('Accept'),
      }
    },
    time: new Date().toISOString(),
  };

  try {
    const sql =
      'INSERT INTO requests (headers, time) VALUES ($1, $2) RETURNING id';
    const values = [request.request.headers, request.time];

    const insertedId = (await pool.query(sql, values)).rows[0].id;

    req.id = insertedId;
  } catch (err) {
    console.error('error executing db query', err)
  }

  next();
}

export default collectRequest
