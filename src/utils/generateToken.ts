import jwt from "jsonwebtoken";

//Gera um hash para aplicação com base no segredo armazenado
export default (params = {}) =>{
   return jwt.sign(params, process.env.KEY ?? "", {
       //Expira em 24 horas
       expiresIn: 86400
   });
}
