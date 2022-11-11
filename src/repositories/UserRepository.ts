const knex = require("../database/connection");


const createUser = async (email:string, name:string, password:string) => {
    try {
        const user = await knex("user").insert({ email, name, password });
        return user;
    } catch (error) {
       throw {message: "Email repetido!", status: 409};
    }
};

const getUser = async (email: string) => {
    try {
        const user = await knex("user").select().where({ email }).first();
        if(!user)
            throw {message: "Usuário não encontrado!", status: 400};

        return user;
    } catch (error) {
       throw {message: error.message, status: error.status};
    }
}

export default { createUser, getUser };
  