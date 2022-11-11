import express from "express";
import cors from "cors";
import { router } from "./routes";
import erroMiddleware from "./middleware/erroMiddleware";
import { Request, Response, NextFunction } from 'express';

const app = express();
app.use(express.json());
app.use(cors());

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

export default app;