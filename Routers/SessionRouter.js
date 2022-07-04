import { Router } from "express";
import {
  postLogin,
  postSignUp,
  logout,
} from "../Controllers/sessionControllers.js";
import validateSignUp from "../Middlewares/validateSignUp.js";
import validateLogin from "../Middlewares/validateLogin.js";
const sessionRouter = Router();

sessionRouter.post("/signup", validateSignUp, postSignUp);
sessionRouter.post("/login", validateLogin, postLogin);
sessionRouter.delete("/logout", logout);

export default sessionRouter;
