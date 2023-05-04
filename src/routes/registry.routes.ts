/*##############################################################################

# define routes under /registry

##############################################################################*/

import express, { Request, Response } from 'express';
import client from 'axios';
// import { run as jsonProcessor } from 'node-jq';
import collectRequest from '../middlewares/collectRequest';

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
  (req: Request, res: Response) => {
    const pkg = req.params.package;
    const ver = req.params.version;

    client.get(`https://registry.npmjs.com/${pkg}/${ver}`)
      .then(function(response) {
        const pkgData = response.data;
        res.status(200).json(pkgData);

        // const resHeaders = {
        //   response: {
        //     headers: res.getHeaders(),
        //     body: pkgData,
        //     time: new Date().toISOString(),
        //   }
        // };
        // jsonProcessor('.', resHeaders, { input: "json" })
        //   .then(output => console.log(output))
        //   .catch(err => console.error(err));
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
