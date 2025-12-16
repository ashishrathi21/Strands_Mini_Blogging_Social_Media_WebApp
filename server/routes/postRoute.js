import express from "express";
import { isLoggedIn } from "../middlewares/authMiddleware.js";
import upload from "../config/multer.js";
import {
  createPost,
  deletePost,
  likeOrDislikePost,
  getAllPosts,
  getPublicPosts,
  getMyPosts,
} from "../controllers/postController.js";

const Router = express.Router();

Router.delete("/delete-post/:postId", isLoggedIn, deletePost);
Router.put("/like-post/:postId", isLoggedIn, likeOrDislikePost);
Router.get("/all-posts", isLoggedIn, getAllPosts);
Router.post("/create-post", isLoggedIn, upload.single("image"), createPost);
Router.get("/public-posts", isLoggedIn, getPublicPosts);
Router.get("/my-posts", isLoggedIn, getMyPosts);

export default Router;
