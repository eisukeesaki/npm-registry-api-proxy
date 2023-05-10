// import pool from './database/queryDB';
// (async () => {
//   const res = await pool.query('SELECT now()');
//   console.log(res.rows[0]);
// })();

/*##############################################################################

# start server

##############################################################################*/

import 'dotenv/config';
import server from './server';

const scheme = 'http';
const host = process.env.HOST;
const port = process.env.PORT;

server.listen(port, () => {
  console.log(`node server is listening to ${scheme}://${host}:${port}`)
});
