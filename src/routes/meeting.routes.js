import { Router } from "express";
import * as Controller from '../controller/meetingController.js'

const routes = Router();

const PATH = {
  DETAILS: "/",
  ALL_MEETINGS:'/getAllMeetings'
};

routes
  .route(PATH.DETAILS)
  .post(Controller.sendMeetingRequest)
  .get(Controller.getUserMeetingRequests)
  .put(Controller.updateMeetingRequestStatus)

  routes.route(PATH.ALL_MEETINGS).get(Controller.getAllMeetings);


export default routes;
