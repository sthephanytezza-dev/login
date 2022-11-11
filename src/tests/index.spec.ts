import app from "../server";
import request from "supertest";
import { describe, expect, it, jest } from '@jest/globals';
import UserRepository from "../repositories/UserRepository";
import LoginService from "../services/LoginService";


describe("Rotas de Integração de Usuário", () => {
  it("Cadastrar usuário", async () => {
    jest
      .spyOn(UserRepository, "createUser")
      .mockResolvedValue({ name: 'karol', password: '$2b$10$zlUKUHZzsDjadsUeYQu6cOFJaoK4pntqsnoPjUxjNlHLD0xuur0Fy@', email: 'karol@gmail.com' });
    const response = await request(app)
      .post("/api/signup")
      .send(
        {
          name: "karol",
          password: "A123456@",
          email: "karol@gmail.com",
        }
      );

    expect(response.statusCode).toEqual(200);
  });
  it("Cadastrar usuário com mesmo e-mail", async () => {
    jest
      .spyOn(UserRepository, "createUser")
      .mockResolvedValue({ message: "Email repetido", code: 409 });
    const response = await request(app)
      .post("/api/signup")
      .send(
        {
          name: "matheus",
          password: "A123456@",
          email: "karol@gmail.com",
        }
      );

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
      .send(
        {
          password: "String@123",
          email: "matheus@gmail.com"
        }
      );

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
      .send(
        {
          password: "123124@A",
          email: "matheus@gmail.com"
        }
      );

    expect(response.body.message).toEqual("Senha inválida!");
  });
  it("Login de usuário com email inexistente", async () => {
    jest
      .spyOn(LoginService, "login")
      .mockRejectedValue(
        {message: "E-mail ou senha inválida!", status: 401}
      );

    const response = await request(app)
      .post("/api/signin")
      .send(
        {
          password: "123124@A",
          email: "matheus@gmail.com"
        }
      );

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
      .set({ authorization: token });
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
      .set({ authorization: token });
    expect(response.body.message).toEqual("Token inválido!");
  });
});
