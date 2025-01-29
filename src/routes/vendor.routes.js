import { Router } from "express";
import {
  createVendor,
  deleteVendor,
  getAllVendors,
  updateVendor,
} from "../controller/vendorController.js";

const routes = Router();

const PATH = {
  DETAILS: "/",
};

routes
  .route(PATH.DETAILS)
  .post(createVendor)
  .get(getAllVendors)
  .put(updateVendor)
  .delete(deleteVendor);

export default routes;
