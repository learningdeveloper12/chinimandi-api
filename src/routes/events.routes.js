import { Router } from "express";
import * as Controller from '../controller/eventController.js'
import authenticate from "../middelware/authMiddleware.js";

const routes = Router();

const PATH = {
  DETAILS: "/",
  USERBYID: "/eventById",
  VIEW_ATTENDEES:"/getEventAttendees",
  VIEW_SPEAKER:"/getEventSpeakers",
  SEND_REQUEST:"/send-request",
  STATUS_REQUEST:"/status-request",
  GET_REQUEST:"/get-request",
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


routes.route(PATH.SEND_REQUEST).get(Controller.sendAttendeeRequest);
routes.route(PATH.STATUS_REQUEST).get(Controller.statusAttendeeRequest);
routes.route(PATH.GET_REQUEST).get(Controller.getAttendeeRequest);

export default routes;
