/*##############################################################################

# write HTTP response metadata to db

##############################################################################*/

import { Request, Response, NextFunction } from 'express';
import pool from '../database/queryDB';

// ?todo define return type Promise<pg.result>
async function collectResponse
  (req: Request, res: Response, next: NextFunction, pkgData: any) { // @todo determine if any type is appropriate for pkgData
  const resMetadata = {
    response: {
      headers: res.getHeaders(),
      body: pkgData,
      time: new Date().toISOString(),
    },
  };
  const sql = 'insert into responses (request_id, headers, time, body) values ($1, $2, $3, $4)';

  pool.query(sql, [req.id, resMetadata.response.headers, resMetadata.response.time, resMetadata.response.body]);

  next();
}

export default collectResponse

