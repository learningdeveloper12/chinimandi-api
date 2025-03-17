import { Router } from "express";
import * as Controller from "../controller/bookEventController.js";
import { fileUpload } from "../lib/file-uploder/file-upload.js";

const routes = Router();

const PATH = {
  DETAILS: "/",
  BOOK_EVENT_BY_ID: "/BookeventByID",
  USER_BOOKINGS: "/UserBooking",
  APPLY_DISCOUNT: "/applyDiscountCoupon",
  BULK_BOOKING: "/bulkBooking",
};

routes
  .route(PATH.DETAILS)
  .post(Controller.createEvntBooking)
  .get(Controller.getAllEvntBookings)
  .put(Controller.updateEvntBooking)
  .delete(Controller.deleteEvntBooking);
  

routes.route(PATH.BOOK_EVENT_BY_ID).get(Controller.getEvntBookingById);
routes.route(PATH.USER_BOOKINGS).get(Controller.getMyBookings);
routes.route(PATH.APPLY_DISCOUNT).post(Controller.applyDiscountCoupon);

routes.post(PATH.BULK_BOOKING,fileUpload.single("file"),Controller.bulkCreateBookEvent)
export default routes;
