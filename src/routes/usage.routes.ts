/*##############################################################################

# define routes under /usage

##############################################################################*/

import express, { Request, Response } from 'express';
import pool from '../database/queryDB';

const router = express.Router();

router.get('/usages', async (req: Request, res: Response) => {
  const sql = `
    SELECT
      requests.headers AS req_headers,
      requests.time AS req_time,
      responses.headers AS res_headers,
      responses.body AS res_body,
      responses.time AS res_time
    FROM requests
    JOIN responses
    ON requests.id = responses.request_id`;

  try {
    const data = await pool.query(sql);

    const usages = {
      usages: data.rows,
    };

    res.send(usages);
  } catch (err) {
    console.error('error executing db query', err)
    res.sendStatus(500);
  }
});

export default router;
