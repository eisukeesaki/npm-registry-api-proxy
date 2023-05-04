/*##############################################################################

# write HTTP request metadata to db

##############################################################################*/

import { Request, Response, NextFunction } from 'express';
import pool from '../database/queryDB';

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

  pool.query(`insert into requests (headers, time) values ($1, $2)`,
    [request.request.headers, request.time]);

  next();
}

export default collectRequest
