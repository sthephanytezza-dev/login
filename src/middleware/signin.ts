import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from 'express';

type JwtPayload = {
    email: string;
}

function signin(request: Request, response: Response, next: NextFunction) {    
    //Pega o token no Header da requestuisição
    const authHeader = request.headers.authorization;

    //Verifica se o token foi informado
    if(!authHeader)
        throw {message: "Nennhum token fornecido!", status: 401};
    
    //Partes do token gerado: Bearer dasjkjdai7q3980e3nd9sdnasd2 
    const parts = authHeader.split(' ');    

    //Verifica se o token possui duas partes
    if(parts.length !== 2)
        throw {message: "Erro no token!", status: 401};

    const [ scheme, token ] = parts;

    //Verifica se o token começa com Bearer
    if(!/^Bearer$/i.test(scheme))
        throw {message: "Token malformatado!", status: 401};
    
    //JWT verifica se o token é válido
    const {email} = jwt.verify(token, process.env.KEY ?? '') as JwtPayload;

    response.locals.email = email;
    next();
}

export default signin;
