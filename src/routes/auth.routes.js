import { Router } from "express";
import {
  registerUser,
  loginUser,
} from "../../src/controller/authController.js";

const routes = new Router();

const PATH = {
  REGISTER: "/register",
  LOGIN: "/login",
};

routes.route(PATH.REGISTER).post(registerUser);

routes.route(PATH.LOGIN).post(loginUser);

export default routes;
