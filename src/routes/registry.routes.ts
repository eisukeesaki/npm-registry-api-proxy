/*##############################################################################

# define routes under /registry

##############################################################################*/

import express, { Request, Response, NextFunction } from 'express';
import client from 'axios';
import collectRequest from '../middlewares/collectRequest';
import collectResponse from '../middlewares/collectResponse';
import pool from '../database/queryDB';

const router = express.Router();

router.get('/registry/:package', async (req: Request, res: Response) => {
  try {
    const pkg = req.params.package;
    const { data } = await client.get(`https://registry.npmjs.com/${pkg}`);
    res.status(200).send(data);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.get('/registry/:package/:version',
  collectRequest, // write HTTP request metadata to db
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const pkg = req.params.package;
      const ver = req.params.version;
      const { data: pkgData } = await client.get(`https://registry.npmjs.com/${pkg}/${ver}`);
      console.log(pkgData);

      res.status(200).json(pkgData);

      collectResponse(req, res, next, pkgData); // write HTTP response metadata to db
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  });

router.get('/registry/search', (req: Request, res: Response) => {
  client.get('https://registry.npmjs.com/-/v1/search', {
    params: {
      text: req.query.text,
      size: req.query.size,
      from: req.query.from,
      quality: req.query.quality,
      popularity: req.query.popularity,
      maintenance: req.query.maintenance,
    }
  })
    .then(function(response) {
      const data = response.data;
      res.status(200).json(data);
    })
    .catch(function(error) {
      console.log(error);
      res.sendStatus(500);
    });
});

export default router;
