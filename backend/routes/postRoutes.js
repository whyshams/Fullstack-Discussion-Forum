import express from "express";
import {
  getFeedPosts,
  getUserPosts,
  likePost,
  createPost,
  createComment,
  editPost,
  deletePost,
  getPostById,
} from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

//Create
router.post("/", protect, createPost);

//Read
router.get("/", protect, getFeedPosts);
router.get("/:userId/posts", getUserPosts);
router.get("/:id", protect, getPostById);

// UPDATE
router.put("/edit", editPost);
router.patch("/:id/like", protect, likePost);
router.post("/:postId/comments", protect, createComment);

//delete
router.delete("/delete", protect, deletePost);

//routes for react native
router.post("/allpostapp", protect, getFeedPosts);

export default router;
