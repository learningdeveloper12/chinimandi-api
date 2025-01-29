import { Router } from "express";
import * as Controller from "../controller/speakerController.js";

const routes = Router();

const PATH = {
  DETAILS: "/",
  SPEAKERBYID: "/speakerById",
};

routes
  .route(PATH.DETAILS)
  .post(Controller.createSpeaker)
  .get(Controller.getAllSpeaker)
  .put(Controller.updateSpeaker)
  .delete(Controller.deleteSpeaker);

routes.route(PATH.SPEAKERBYID).get(Controller.getSpeakerById);

export default routes;
