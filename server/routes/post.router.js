import express from "express";
import upload from "../middlewares/multer.js";
import isAuthenticated from "../middlewares/userAuthentication.js";
import {
  addComment,
  addPost,
  bookmarkPost,
  deletePost,
  dislikePost,
  getAllPosts,
  getPostComments,
  getUserPosts,
  likePost,
} from "../controllers/post.controller.js";

const router = express.Router();

router.route("/addpost").post(isAuthenticated, upload.single("image"), addPost);
router.route("/allposts").get(isAuthenticated, getAllPosts);
router.route("/userposts/all").get(isAuthenticated, getUserPosts);
router.route("/like/:id").get(isAuthenticated, likePost);
router.route("/dislike/:id").get(isAuthenticated, dislikePost);
router.route("/comment/:id").post(isAuthenticated, addComment);
router.route("/comments/all/:id").get(isAuthenticated, getPostComments);
router.route("/delete/:id").delete(isAuthenticated, deletePost);
router.route("/bookmark/:id").post(isAuthenticated, bookmarkPost);

export default router;
