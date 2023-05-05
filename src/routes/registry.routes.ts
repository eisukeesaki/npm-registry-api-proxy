/*##############################################################################

# define routes under /registry

##############################################################################*/

import express, { Request, Response, NextFunction } from 'express';
import client from 'axios';
import collectRequest from '../middlewares/collectRequest';
import collectResponse from '../middlewares/collectResponse';
import pool from '../database/queryDB';

const router = express.Router();

router.get('/registry/:package', (req: Request, res: Response) => {
  const pkg = req.params.package;

  client.get(`https://registry.npmjs.com/${pkg}`)
    .then(function(response) {
      const data = response.data;
      res.status(200).json(data);
    })
    .catch(function(error) {
      console.log(error);
      res.sendStatus(500);
    });
});

router.get('/registry/:package/:version',
  collectRequest, // write HTTP request metadata to db
  (req: Request, res: Response, next: NextFunction) => {
    const pkg = req.params.package;
    const ver = req.params.version;

    client.get(`https://registry.npmjs.com/${pkg}/${ver}`)
      .then(function(response) {
        const pkgData = response.data;
        res.status(200).json(pkgData);

        collectResponse(req, res, next, pkgData); // write HTTP response metadata to db
      })
      .catch(function(error) {
        console.log(error);
        res.sendStatus(500);
      });
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
