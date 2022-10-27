import * as yup from "yup";
import { Request, Response, NextFunction } from 'express';
import HttpException from "../models/HttpException";

const userSchema = yup.object().shape({
  name: yup
    .string()
    .matches(/^([aA-zZ]+[aA-zZ\s]+)+$/, "O nome deve conter apenas letras!")
    .required("Informe o nome!"),
  email: yup
    .string()
    .email("E-mail inválido!")
    .required("Informe o e-email!"),
  password: yup
    .string()
    .min(8, "A senha precisa de ter no mínimo 8 caracteres!")
    .matches(
      /^((?=.*[\W]){1})(?=.*\d)((?=.*[A-Z]){1}).*$/,
      "A senha deve conter pelo menos uma letra maiúscula, um número e um caractere especial!"
    )
    .required("Informe a senha"),
});

export default async (request: Request, response: Response, next: NextFunction) => {
  try {
    await userSchema.validate(request.body);
    
    next();
  } catch (error) {    
    next(new HttpException(400, `${error.message}`));
  }
}
