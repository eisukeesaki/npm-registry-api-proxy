/*##############################################################################

# write HTTP request/response metadata to db

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

// @todo define return type `Promise<pg.result>`?
async function collectResponse
  // @todo is type `any` for `pkgData` appropriate?
  (req: Request, res: Response, next: NextFunction, pkgData: any) {
  const resMetadata = {
    response: {
      headers: res.getHeaders(),
      body: pkgData,
      time: new Date().toISOString(),
    },
  };
  const sql =
    `INSERT INTO responses (request_id, headers, time, body)
      VALUES ($1, $2, $3, $4)`;
  const values = [
    req.id,
    resMetadata.response.headers,
    resMetadata.response.time,
    resMetadata.response.body
  ];

  pool.query(sql, values);

  next();
}

export { collectRequest, collectResponse }

