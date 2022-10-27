
import { NextFunction, Request, Response } from 'express';
import HttpException from '../models/HttpException';
 
function errorMiddleware(error: HttpException, request: Request, response: Response, next: NextFunction) {
  const status : number = error.status;
  const message = error.message;
  const stack = error.stack;
  response
    .status(status)
    .json({
      message,
      stack
    })
}
 
export default errorMiddleware;