import { Router } from "express";
import UserController from "./controllers/UserController";
import LoginController from "./controllers/LoginController";
import userValidate from "./middleware/userValidation";
import loginValidate from "./middleware/loginValidate";

import signinMiddleware from './middleware/signin';

const router = Router();

router.post("/signup", userValidate, UserController.createUser);
router.post("/signin", loginValidate, LoginController.login);
router.get("/profile", signinMiddleware, UserController.getProfile);

export { router };