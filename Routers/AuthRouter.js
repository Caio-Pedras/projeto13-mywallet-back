import { Router } from "express";
import {
  postLogin,
  postSignUp,
  logout,
} from "../Controllers/authControllers.js";
import validateSignUp from "../Middlewares/validateSignUp.js";
import validateLogin from "../Middlewares/validateLogin.js";
const authRouter = Router();

authRouter.post("/signup", validateSignUp, postSignUp);
authRouter.post("/login", validateLogin, postLogin);
authRouter.delete("/logout", logout);

export default authRouter;
