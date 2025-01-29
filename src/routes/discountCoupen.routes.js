import { Router } from "express";
import * as Controller from "../controller/discountCoupenController.js";

const routes = Router();

const PATH = {
  DETAILS: "/",
  DISCOUNT_COUPEN_BY_ID: "/disCoupenByID",
};

routes
  .route(PATH.DETAILS)
  .post(Controller.createDiscountCoupen)
  .get(Controller.getAllDiscountCoupen)
  .put(Controller.updateDiscountCoupen)
  .delete(Controller.deleteDiscountCoupen);

routes.route(PATH.DISCOUNT_COUPEN_BY_ID).get(Controller.getDiscountCoupenById);

export default routes;
