import type { NextFunction, Response, Request } from "express";

function handle404Error(_req: Request, res: Response, _next: NextFunction) {
  res.status(404).json({
    status: 404,
    message: 'Resource not found'
  });
}

export default handle404Error;