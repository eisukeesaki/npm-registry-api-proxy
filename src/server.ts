/*##############################################################################

# configure server instance

##############################################################################*/

import express, { Request, Response } from 'express';

const app = express();

app.get('/', (req: Request, res: Response) => {
  res.end('you got me');
});

export default app;
