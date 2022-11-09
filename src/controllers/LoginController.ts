import { Request, Response, NextFunction } from 'express';
import loginService from "../services/LoginService";
import HttpException from "../models/HttpException";

type User = {
  email: string;
  password: string;
}

const login = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const {email, password} : User = request.body;
      console.log(email, password);
      
      const result = await loginService.login(email, password);
  
      response.status(200).json(result);
    } catch (error: any) {
      next(new HttpException(error.status || 500, error.message, error.stack));
    }
};

export default { login };
