import { Router } from "express";
import * as Controller from "../controller/eventCategoriesController.js";

const routes = Router();

const PATH = {
  DETAILS: "/",
  EVENTCATEGORYBYID: "/eventCategoryById",
};

routes
  .route(PATH.DETAILS)
  .post(Controller.createEventCategory)
  .get(Controller.getAllEvents)
  .put(Controller.updateEventCategory)
  .delete(Controller.deleteEventCategory);

routes.route(PATH.EVENTCATEGORYBYID).get(Controller.getEventCategoryById);

export default routes;
