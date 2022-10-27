import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { router } from "./routes";
import erroMiddleware from "./middleware/erroMiddleware";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

app.use("/api", router);
app.use(erroMiddleware);

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