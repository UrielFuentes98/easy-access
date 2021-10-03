declare namespace Express {
  export interface User {
    issuer: string;
  }

  export interface Request {
    wasLogin?: boolean;
  }
}
