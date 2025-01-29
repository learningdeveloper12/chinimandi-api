import { Router } from "express";
import authRoutes from "./auth.routes.js";
import user from "./user.routes.js";
import events from "./events.routes.js";
import vendor from "./vendor.routes.js";
import authenticate from "../middelware/authMiddleware.js";
import imageUploder from "./imageUploder.routes.js";
import eventCategories from "./eventCategories.routes.js";
import bookEvent from "./bookEvent.routes.js";
import discountCoupn from "./discountCoupen.routes.js";
import meeting from "./meeting.routes.js";
import speaker from "./speakers.routes.js";
import post from "./post.routes.js";
import chinimandiUser from "./chinimandiUser.routes.js";

const routes = new Router();

const PATH = {
  AUTH: "/auth",
  AllUSRS: "/users",
  EVENTS: "/event",
  VENDOR: "/vendor",
  IMAGE_UPLOAD: "/imageUpload",
  EVENT_CATEGORIES: "/eventCategories",
  BOOK_EVENT: "/bookEvent",
  DISCOUNT_COUPEN: "/discountCoupen",
  MEETING: "/meetings",
  SPEAKER: "/speakers",
  POST: "/post",
  CHINIMANDIUSER: "/chinimandiUser"
};

routes.use(PATH.AUTH, authRoutes);
routes.use(PATH.EVENTS, events);
routes.use(PATH.BOOK_EVENT, bookEvent);
routes.use(PATH.POST, post);
routes.use(PATH.CHINIMANDIUSER, chinimandiUser);
// -----------------------------
routes.use(authenticate);
// -----------------------------

routes.use(PATH.AllUSRS, user);
routes.use(PATH.VENDOR, vendor);
routes.use(PATH.IMAGE_UPLOAD, imageUploder);
routes.use(PATH.EVENT_CATEGORIES, eventCategories);
routes.use(PATH.DISCOUNT_COUPEN, discountCoupn);
routes.use(PATH.MEETING, meeting);
routes.use(PATH.SPEAKER, speaker);

export default routes;
