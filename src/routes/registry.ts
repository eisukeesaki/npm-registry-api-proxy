/*##############################################################################

# define routes under /registry

##############################################################################*/

import express, { Request, Response, NextFunction } from 'express';
import client from 'axios';
import {
  collectRequest,
  collectResponse
} from '../middlewares/registry';
import pool from '../database/queryDB';
import authenticate from '../middlewares/authN';

const router = express.Router();

router.get('/registry/search',
  // @todo collectRequest,
  async (req: Request, res: Response) => {
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

router.get('/registry/:package/:version',
  authenticate, // commented for demo purpose
  // collectRequest, // commented for demo purpose
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const pkg = req.params.package;
      const ver = req.params.version;
      const { data: pkgData } =
        await client.get(`https://registry.npmjs.com/${pkg}/${ver}`);

      res.status(200).json(pkgData);
      // collectResponse(req, res, next, pkgData); // commented for demo purpose
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  });

router.get('/registry/:package',
  // @todo collectRequest,
  async (req: Request, res: Response) => {
    try {
      const pkg = req.params.package;
      const { data } = await client.get(`https://registry.npmjs.com/${pkg}`);
      res.status(200).send(data);
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  });

export default router;
