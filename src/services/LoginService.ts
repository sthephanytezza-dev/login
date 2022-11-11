import jwt from 'jsonwebtoken';
import * as bcrypt from "bcrypt";
import userRepository from "../repositories/UserRepository";

const login = async (email:string, password:string) => {
    try {
        const user = await userRepository.getUser(email);
        console.log(user);
        
        if(!user){
            throw {message: "E-mail inválido!", status: 401};
        }
        
        const verify = await bcrypt.compare(password, user.password);
        
        if(!verify){
            throw {message: "Senha inválida!", status: 401};
        }        
        
        const token = jwt.sign({email: user.email}, process.env.KEY ?? "", {
            //Expira em 24 horas
            expiresIn: 86400
        });        

        const {password:_, ...userLogin} = user;
        
        return {token, userLogin};
    } catch (error) {        
        throw error;
    }
};

export default { login };
  