import { Request as ExpressRequest } from 'express';

declare module 'express-serve-static-core' {
  export interface Request extends ExpressRequest {
    id?: string;
  }
}

