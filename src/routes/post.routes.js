import { Router } from "express";
import * as Controller from '../controller/postController.js'
import { fileUpload } from "../lib/file-uploder/file-upload.js";

const routes = Router();
const PATH = {
  DETAILS: "/",
  ALL_POSTS: "/all-posts",
  UPDATE_POST: "/update-post",
  DELETE_POST: "/delete-post",
  LIKE: "/like-post",
  COMMENT: "/comment-post",
};

routes
  .route(PATH.DETAILS)
  .get(Controller.getPost)
routes.get(PATH.ALL_POSTS, Controller.getAllPosts)
routes.put(PATH.UPDATE_POST, fileUpload.single("postImage"), Controller.updatePost)
routes.delete(PATH.DELETE_POST, Controller.deletePosts)

routes.post("/", fileUpload.single("postImage"), Controller.createPost)

routes
  .route(PATH.LIKE)
  .post(Controller.likePost)

routes
  .route(PATH.COMMENT)
  .post(Controller.commentPost)

export default routes;