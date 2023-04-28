/*##############################################################################

# configure server instance

##############################################################################*/

import express, { Request, Response } from 'express';
import client from 'axios';

const app = express();

app.get('/search', (req: Request, res: Response) => {
  client.get('https://registry.npmjs.com/-/v1/search', {
    params: {
      text: req.query.text,
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
