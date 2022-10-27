import * as bcrypt from "bcrypt";
import userRepository from "../repositories/UserRepository";
import generateToken from "../utils/generateToken";

const login = async (email:string, password:string) => {
    try {
        const user = await userRepository.getUser(email);
        if(!user){
            throw {message: "E-mail ou senha inválida!", status: 401};
        }
        
        const verify = await bcrypt.compare(password, user.password);
        
        if(!verify){
            throw {message: "Senha inválida!", status: 401};
        }

        const token = generateToken({ email: user.email });

        const {password:_, ...userLogin} = user;
        
        return {token, userLogin};
    } catch (error) {        
        throw error;
    }
};

export default { login };
  