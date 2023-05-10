/*##############################################################################

# configure server instance

##############################################################################*/

import express, { Request, Response } from 'express';
import registryRoutes from './routes/registry';
import usageRoutes from './routes/usage';
import registrationRoutes from './routes/registeration';

const app = express();

/*
* https://github.com/expressjs/body-parser#bodyparserjsonoptions
*/
app.use(express.json(
  // @todo pass in appropriate option(s)
  //     https://github.com/expressjs/body-parser#bodyparserjsonoptions
));

/**
  * configure routes
  */
app.use(registryRoutes);
app.use(usageRoutes);
app.use(registrationRoutes);

export default app;
