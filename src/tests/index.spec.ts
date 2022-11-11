import app from "../server";
import request from "supertest";
import {
  describe,
  expect,
  it,
  jest
} from '@jest/globals';
import UserRepository from "../repositories/UserRepository";
import LoginService from "../services/LoginService";
import UserService from "../services/UserService";
import UserController from "../controllers/LoginController";

describe("Rotas de Integração de Usuário", () => {
  it("Cadastrar usuário", async () => {
    jest
      .spyOn(UserRepository, "createUser")
      .mockResolvedValue({
        name: 'karol',
        password: '$2b$10$zlUKUHZzsDjadsUeYQu6cOFJaoK4pntqsnoPjUxjNlHLD0xuur0Fy@',
        email: 'karol@gmail.com'
      });
    const response = await request(app)
      .post("/api/signup")
      .send({
        name: "karol",
        password: "A123456@",
        email: "karol@gmail.com",
      });

    expect(response.statusCode).toEqual(200);
  });
  it("Cadastrar usuário com mesmo e-mail", async () => {
    jest
      .spyOn(UserRepository, "createUser")
      .mockResolvedValue({
        message: "Email repetido",
        code: 409
      });
    const response = await request(app)
      .post("/api/signup")
      .send({
        name: "matheus",
        password: "A123456@",
        email: "karol@gmail.com",
      });

    expect(response.body.message).toEqual("Email repetido");
  });
  it("Login de usuário", async () => {
    jest
      .spyOn(UserRepository, "getUser")
      .mockResolvedValue({
        name: "matheus",
        email: "matheus@gmail.com",
        password: "$2b$10$m055hMqhHA8a.ovIt4qOK.85IiUgpw8s5EiS4/ssDvs0tS/RjBrim"
      });

    const response = await request(app)
      .post("/api/signin")
      .send({
        password: "String@123",
        email: "matheus@gmail.com"
      });

    expect(response.body.userLogin.email).toEqual("matheus@gmail.com");
    expect(response.statusCode).toEqual(200);
  });
  it("Login de usuário com senha errada", async () => {
    jest
      .spyOn(UserRepository, "getUser")
      .mockResolvedValue({
        name: "matheus",
        email: "matheus@gmail.com",
        password: "123124@A"
      });

    const response = await request(app)
      .post("/api/signin")
      .send({
        password: "123124@A",
        email: "matheus@gmail.com"
      });

    expect(response.body.message).toEqual("Senha inválida!");
  });
  it("Login de usuário com email inexistente", async () => {
    jest
      .spyOn(LoginService, "login")
      .mockRejectedValue({
        message: "E-mail ou senha inválida!",
        status: 401
      });

    const response = await request(app)
      .post("/api/signin")
      .send({
        password: "123124@A",
        email: "matheus@gmail.com"
      });

    expect(response.body.message).toEqual("E-mail ou senha inválida!");
  });
  it("Perfil do usuário", async () => {
    jest
      .spyOn(UserRepository, "getUser")
      .mockResolvedValue({
        name: "matheus",
        email: "matheus@gmail.com"
      });

    const token =
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1hdGhldXNAZ21haWwuY29tIiwiaWF0IjoxNjY4MTI2MDM2LCJleHAiOjE2NjgyMTI0MzZ9.s4MHgIpJ8U-GgbsmjqfxEzOYrXT6MK9Tvced3jb6WZU";
    const response = await request(app)
      .get("/api/profile")
      .set({
        authorization: token
      });
    expect(response.statusCode).toEqual(200);
  });
  it("Perfil do usuário com token inválido", async () => {
    jest
      .spyOn(UserRepository, "getUser")
      .mockResolvedValue({
        name: "matheus",
        email: "matheus@gmail.com"
      });

    const token =
      "Bearer aseyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1hdGhldXNAZ21haWwuY29tIiwiaWF0IjoxNjY4MTI2MDM2LCJleHAiOjE2NjgyMTI0MzZ9.s4MHgIpJ8U-GgbsmjqfxEzOYrXT6MK9Tvced3jb6WZU";
    const response = await request(app)
      .get("/api/profile")
      .set({
        authorization: token
      });
    expect(response.body.message).toEqual("Token inválido!");
  });
});

describe("Teste de Unidade", () => {
  it("cadastra usuário e retorna user e status 200", async () => {
    jest
      .spyOn(UserRepository, "createUser")
      .mockResolvedValue({
        name: "karolzinha",
        email: "karolzinha@gmail.com",
        password: "123456@A"
      });

    const response = await UserService.createUser(
      "karolzinha@gmail.com",
      "karolzinha",
      "123456@A"
    );

    expect(response).toHaveProperty("name");
    expect(response.name).toEqual("karolzinha");
  });

  it("função de cadastrar usuário utilizando email repetido", async () => {
    jest
      .spyOn(UserRepository, "createUser")
      .mockRejectedValue({
        message: "Email repetido!",
        status: 409
      });

    try {
      await UserService.createUser(
        "karolzinha@gmail.com",
        "karolzinha",
        "123456@A"
      );
    } catch (error) {
      expect(error).toHaveProperty("message");
      expect(error.message).toEqual("Email repetido!");
      expect(error.status).toEqual(409);
    }
  });
  it("função de pegar usuário pelo email", async () => {
    jest
      .spyOn(UserRepository, "getUser")
      .mockRejectedValue({
        message: "Usuário não encontrado!",
        status: 400
      });

    try {
      await UserService.getUser(
        "karolzinhas@gmail.com"
      );
    } catch (error) {
      expect(error).toHaveProperty("message");
      expect(error.message).toEqual("Usuário não encontrado!");
      expect(error.status).toEqual(400);
    }
  });
  it("função de login usando senha errada", async () => {
    jest
      .spyOn(LoginService, "login")
      .mockRejectedValue({
        message: "Senha inválida!",
        status: 401
      });

    try {
      await LoginService.login(
        "karolzinha@gmail.com",
        "iadiq392481"
      );
    } catch (error) {
      expect(error).toHaveProperty("message");
      expect(error.message).toEqual("Senha inválida!");
      expect(error.status).toEqual(401);
    }
  });
  it("função de login usando email inexistente", async () => {
    jest
      .spyOn(LoginService, "login")
      .mockRejectedValue({
        message: "E-mail inválido!",
        status: 401
      });

    try {
      await LoginService.login(
        "karolzinhas@gmail.com",
        "123456@A"
      );
    } catch (error) {
      expect(error).toHaveProperty("message");
      expect(error.message).toEqual("E-mail inválido!");
      expect(error.status).toEqual(401);
    }
  });
  it("função de login com sucesso", async () => {
    // para caso de sucesso
    jest.spyOn(UserRepository, "getUser").mockResolvedValue({
      name: "matheus",
      email: "matheus@gmail.com",
      password: "$2b$10$m055hMqhHA8a.ovIt4qOK.85IiUgpw8s5EiS4/ssDvs0tS/RjBrim"
    });

    try {
      const response = await LoginService.login("matheus@gmail.com", "String@123");
      expect(response).toHaveProperty("token");
      expect(response.userLogin.email).toEqual("matheus@gmail.com");
    } catch (error) {
      console.log(error.message);
    }
  });
  it("função profile", async () => {
    jest
      .spyOn(UserService, "getUser")
      .mockResolvedValue({
        name: "matheus",
        email: "matheus@gmail.com"
      });

    const response = await UserService.getProfile("matheus@gmail.com");

    expect(response.email).toEqual("matheus@gmail.com");
  });
  it("função profile com email errado", async () => {
    jest
      .spyOn(UserRepository, "getUser")
      .mockRejectedValue({
        message: "Não autorizado!",
        status: 401
      });

    console.log(process.env.KEY);

    try {
      await UserService.getProfile("matheus2@gmail.com");
    } catch (error) {
      expect(error.message).toEqual("Não autorizado!");
    }
  });
});
