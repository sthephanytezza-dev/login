import * as bcrypt from "bcrypt";
import userRepository from "../repositories/UserRepository";

const createUser = async (email:string, name:string, password:string) => {
    try {
        const salt = bcrypt.genSaltSync();
        const hash = bcrypt.hashSync(password, salt);

        const user = {
            password: hash,
            name: name,
            email: email
        }
        return userRepository.createUser(user.email, user.name, user.password);
    } catch (error) {        
        throw error;
    }
};

const getUser = async (email:string) => {
    try {
        if(!email){
            throw {message: "E-mail não fornecido!", status: 400};
        }
        return userRepository.getUser(email);
    } catch (error) {        
        throw error;
    }
};

const getProfile = async (email: string) => {
    try {        
      if(!email){
        throw {message: "E-mail de usuário não informado!", status: 401};
      }
  
      const user = await userRepository.getUser(email);
  
      if(!user) {
        throw {message: "Não autorizado!", status: 401};
      }
  
      const {password:_, ...userLogin} = user;
      
      return userLogin;
  
    } catch (error) {
      throw {message: error.message, status: error.status};
    }
  }

export default { createUser, getUser, getProfile };
  