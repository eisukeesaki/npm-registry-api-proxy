/*##############################################################################

# write HTTP request metadata to db

##############################################################################*/

import { Request, Response, NextFunction } from 'express';
import pool from '../database/queryDB';

// @do? define return type Promise<pg.result>
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

  const sql = 'INSERT INTO requests (headers, time) VALUES ($1, $2) RETURNING id';
  const values = [request.request.headers, request.time];
  await pool.query(sql, values)
    .then((res) => req.id = res.rows[0].id)
    .catch((err) => console.error('error executing db query', err.stack));

  next();
}

export default collectRequest
