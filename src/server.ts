/*##############################################################################

# configure server instance

##############################################################################*/

import express, { Request, Response } from 'express';
import registryRoutes from './routes/registry.routes';
import usageRoutes from './routes/usage.routes';

const app = express();

/**
  * configure routes
  */
app.use(registryRoutes);
app.use(usageRoutes);

export default app;
