import express from "express";
import {
  Register,
  Login,
  Logout,
  getProfile,
  getAllUsers,
  follow,
  unFollow,
  getUserById,
  getMe,
  updateProfile,
} from "../controllers/userController.js";
import upload from "../config/multer.js";
import { isLoggedIn } from "../middlewares/authMiddleware.js";

const Router = express.Router();
Router.get("/me", isLoggedIn, getMe);
Router.post("/register", Register);
Router.post("/login", Login);
Router.get("/logout", Logout);
Router.get("/profile", isLoggedIn, getProfile);
Router.get("/all-users", isLoggedIn, getAllUsers);
Router.put(
  "/update-profile",
  isLoggedIn,
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "coverPicture", maxCount: 1 },
  ]),
  updateProfile
);
Router.put("/follow/:userId", isLoggedIn, follow);
Router.put("/unfollow/:userId", isLoggedIn, unFollow);
Router.get("/:id", isLoggedIn, getUserById);

export default Router;
