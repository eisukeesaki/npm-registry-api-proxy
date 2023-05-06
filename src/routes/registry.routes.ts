/*##############################################################################

# define routes under /registry

##############################################################################*/

import express, { Request, Response, NextFunction } from 'express';
import client from 'axios';
import collectRequest from '../middlewares/collectRequest';
import collectResponse from '../middlewares/collectResponse';
import pool from '../database/queryDB';

const registry = express.Router();

registry.get('/registry/search', async (req: Request, res: Response) => {
  try {
    const { data } =
      await client.get('https://registry.npmjs.com/-/v1/search', {
        params: {
          text: req.query.text,
          size: req.query.size,
          from: req.query.from,
          quality: req.query.quality,
          popularity: req.query.popularity,
          maintenance: req.query.maintenance,
        }
      });

    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

registry.get('/registry/:package/:version',
  // write HTTP request metadata to db
  collectRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const pkg = req.params.package;
      const ver = req.params.version;
      const { data: pkgData } =
        await client.get(`https://registry.npmjs.com/${pkg}/${ver}`);

      res.status(200).json(pkgData);
      // write HTTP response metadata to db
      collectResponse(req, res, next, pkgData);
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  });

registry.get('/registry/:package', async (req: Request, res: Response) => {
  try {
    const pkg = req.params.package;
    const { data } = await client.get(`https://registry.npmjs.com/${pkg}`);
    res.status(200).send(data);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

export default registry;
