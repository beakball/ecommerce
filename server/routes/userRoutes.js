import express from "express";
import {
  loginController,
  registerController,
  testController,
} from "../controllers/userController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

// routes
router.post("/register", registerController);
router.post("/login", loginController);
router.get("/test", requireSignIn, testController);

export default router;
