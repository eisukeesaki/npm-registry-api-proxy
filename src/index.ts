/*##############################################################################

# start server


##############################################################################*/

import dotenv from 'dotenv'; // unnecessary if you preload dotenv into node using --require module
import server from './server';

dotenv.config(); // unnecessary if you preload dotenv into node using --require module

const scheme = 'http';
const host = process.env.HOST;
const port = process.env.PORT;

server.listen(port, () => {
  console.log(`node server is listening to ${scheme}://${host}:${port}`)
});
