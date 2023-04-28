/*##############################################################################

# configure server instance

##############################################################################*/

import express, { Request, Response } from 'express';
import client from 'axios';

const app = express();

/**
  * routes
  */
app.get('/:package', (req: Request, res: Response) => {
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
app.get('/:package/:version', (req: Request, res: Response) => {
  const pkg = req.params.package;
  const ver = req.params.version;

  client.get(`https://registry.npmjs.com/${pkg}/${ver}`)
    .then(function(response) {
      const data = response.data;
      res.status(200).json(data);
    })
    .catch(function(error) {
      console.log(error);
      res.sendStatus(500);
    });
});
app.get('/search', (req: Request, res: Response) => {
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

export default app;
