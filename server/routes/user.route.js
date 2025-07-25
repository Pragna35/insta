import express from "express";
import {register, login, logout, getProfile, editProfile, getSuggestedUsers, followOrUnfollow} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/userAuthentication.js";
import upload from "../middlewares/multer.js";


const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/:id").get( isAuthenticated ,getProfile);
router.route("/profile/edit").post(isAuthenticated, upload.single("profilePicture"), editProfile);
router.route("/suggestedusers").get(isAuthenticated, getSuggestedUsers);
router.route("/followorunfollow/:id").post(isAuthenticated, followOrUnfollow)

export default router;
