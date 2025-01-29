import { Router } from "express";
import * as Controller from '../controller/postController.js'
import { fileUpload } from "../lib/file-uploder/file-upload.js";

const routes = Router();

const PATH = {
  DETAILS: "/",
  LIKE: "/like-post",
  COMMENT: "/comment-post",
};

routes
  .route(PATH.DETAILS)
  .get(Controller.getPost)

  routes.post("/",fileUpload.single("postImage"),Controller.createPost)

routes
  .route(PATH.LIKE)
  .post(Controller.likePost)

routes
  .route(PATH.COMMENT)
  .post(Controller.commentPost)


export default routes;
