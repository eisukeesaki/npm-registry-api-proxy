import dotenv from 'dotenv';
import express, { Request, Response } from 'express';

dotenv.config();

const scheme = 'http';
const host = process.env.HOST;
const port = process.env.PORT;

const app = express();

app.get('/', (req: Request, res: Response) => {
  res.end('you got me');
});

app.listen(port, () => console.log(`node is listening to ${scheme}://${host}:${port}`));

