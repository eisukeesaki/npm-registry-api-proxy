/*##############################################################################

# configure server instance

##############################################################################*/

import express, { Request, Response } from 'express';
import registryRoutes from './routes/registry.routes';

console.log(registryRoutes);

const app = express();

/**
  * configure routes
  */
app.use(registryRoutes);

export default app;
