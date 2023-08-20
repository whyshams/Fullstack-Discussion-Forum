import express from "express";
const router = express.Router();
import {
  userAuth,
  userLogout,
  userRegister,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  getUser,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "backend/public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

router.post("/", upload.single("picture"), userRegister);
router.post("/auth", userAuth);
router.post("/logout", userLogout);
router
  .route("/profile")
  .get(protect, getUserProfile)

  .put(protect, upload.single("picture"), updateUserProfile);
router.get("/profile/:userId", getUser);
router.delete("/delete", protect, deleteUser);

export default router;
