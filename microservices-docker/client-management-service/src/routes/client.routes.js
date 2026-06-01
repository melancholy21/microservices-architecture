import { Router } from "express";
import { createProfile, getProfile, updateProfile } from "../controllers/client.controller.js";

const router = Router();

router.route("/").post(createProfile);
router.route("/:authUserId").get(getProfile).put(updateProfile);

export default router;