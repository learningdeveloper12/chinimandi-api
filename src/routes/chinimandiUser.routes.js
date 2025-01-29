import { Router } from "express";
import * as Controller from '../controller/chinimandiUserController.js'

const routes = Router();

const PATH = {
  DETAILS: "/",
};

routes
  .route(PATH.DETAILS)
  .post(Controller.updateChinimandiUser)


export default routes;
