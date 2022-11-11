import { Request, Response, NextFunction } from 'express';
import userService from "../services/UserService";
import HttpException from "../models/HttpException";

type User = {
  name: any;
  email: string;
  password: string;
}

const createUser = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const {email, name, password} : User = request.body;
      const result = await userService.createUser(email, name, password);
  
      response.status(200).json(result);
    } catch (error: any) {
      next(new HttpException(error.status || 500, error.message, error.stack));
    }
};

const getProfile = async (_request: Request, response: Response, next: NextFunction) => {
  try {        
    const user = await userService.getProfile(response.locals.email);
    
    response.status(200).json(user);

  } catch (error) {
    next(new HttpException(error.status || 500, error.message, error.stack));
  }
}

export default { createUser, getProfile };
