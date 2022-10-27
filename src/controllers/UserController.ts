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

const getProfile = async (request: Request, response: Response, next: NextFunction) => {
  try {        
    const user = await userService.getUser(response.locals.email);

    if(!user) {
      throw {message: "Não autorizado!", status: 401};
    }

    const {password:_, ...userLogin} = user;
    
    response.status(200).json(userLogin);

  } catch (error) {
    next(new HttpException(error.status || 500, error.message, error.stack));
  }
}

export default { createUser, getProfile };
