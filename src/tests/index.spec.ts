import app from "../server";
import request from "supertest";
import { describe, expect, it, jest } from '@jest/globals';
import UserRepository from "../repositories/UserRepository";

describe("Rotas de Usuário", () => {
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
  it("Buscar usuário", async () => {
    jest
      .spyOn(UserRepository, "getUser")
      .mockResolvedValue({ 
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN0aGVhcmF1am85QGdtYWlsLmNvbSIsImlhdCI6MTY2Njg5OTUwOSwiZXhwIjoxNjY2OTg1OTA5fQ.bcrLdZNsMx9cttsJl20xbMh4-vGcRxlzXDvweu6Z8DI",
        user: {
          name: "Karol",
          email: "karol@gmail.com"
        }
      });
    const response = await request(app)
      .post("/api/signin")
      .send(
        {
          password: "A123456@",
          email: "karol@gmail.com",
        }
      );

    // expect(response.body.message).toEqual("Email repetido");
    console.log(response);
    
  });
});
