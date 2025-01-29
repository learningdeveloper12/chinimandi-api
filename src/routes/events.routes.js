import { Router } from "express";
import * as Controller from '../controller/eventController.js'
import authenticate from "../middelware/authMiddleware.js";

const routes = Router();

const PATH = {
  DETAILS: "/",
  USERBYID: "/eventById",
  VIEW_ATTENDEES:"/getEventAttendees",
  VIEW_SPEAKER:"/getEventSpeakers",
};

routes
  .route(PATH.DETAILS)
  .post(authenticate, Controller.createEvent)
  .get(Controller.getAllEvents)
  .put(authenticate, Controller.updateEvent)
  .delete(authenticate, Controller.deleteEvent);

routes.route(PATH.USERBYID).get(Controller.getEventById);

routes.route(PATH.VIEW_ATTENDEES).get(Controller.getEventAttendees);
routes.route(PATH.VIEW_SPEAKER).get(Controller.getEventSpeakers);

export default routes;
