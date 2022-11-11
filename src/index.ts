import * as dotenv from "dotenv";
import express from "express";
import { Request, Response, NextFunction } from 'express';
import cors from "cors";
import { router } from "./routes";
import erroMiddleware from "./middleware/erroMiddleware";
import  bodyParser from "body-parser";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());

app.use("/api", router);
app.use(erroMiddleware);

app.use((error: any, _request: Request, response: Response, _next: NextFunction) => {
  response.status(error.status || 500);
  const err: any = {
    error: error.message,
  };
  if (error.status === 500) {
    err.stack = error.stack;
  }
  response.json(err);
});



const PORT = process.env.PORT;
const NODE_ENV = process.env.NODE_ENV;

app.listen(PORT, () => {
  console.log(
      `
      Yep this is working 🍺 🎉 
      App listen on port: ${PORT} 🥷
      Env: ${NODE_ENV} 🦄
      `
  );
});