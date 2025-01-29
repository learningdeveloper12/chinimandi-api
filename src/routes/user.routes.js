import { Router } from "express";
import {
  getAllUser,
  logedinUser,
} from "../../src/controller/userController.js";

const routes = Router();

const PATH = {
  DETAILS: "/",
  GETME: "/me",
};

routes.route(PATH.DETAILS).get(getAllUser);
routes.route(PATH.GETME).get(logedinUser);

export default routes;
