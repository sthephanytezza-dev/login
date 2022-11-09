import express from "express";
import cors from "cors";
import { router } from "./routes";
import erroMiddleware from "./middleware/erroMiddleware";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api", router);
app.use(erroMiddleware);

export default app;