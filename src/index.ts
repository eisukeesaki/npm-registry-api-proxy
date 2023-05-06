/*##############################################################################

# start server

##############################################################################*/

import dotenv from 'dotenv';
import server from './server';

dotenv.config();

const scheme = 'http';
const host = process.env.HOST;
const port = process.env.PORT;

server.listen(port, () => {
  console.log(`node server is listening to ${scheme}://${host}:${port}`)
});
