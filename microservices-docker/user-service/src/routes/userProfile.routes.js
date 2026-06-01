import { Router } from "express";
import { initializeSettings, getMySettings, administrativeOverride } from "../controllers/userProfile.controller.js";
import { verifyUserSession } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/initialize").post(initializeSettings);

router.use(verifyUserSession);
router.route("/me").get(getMySettings);
router.route("/admin/override/:targetAuthUserId").put(administrativeOverride);

export default router;