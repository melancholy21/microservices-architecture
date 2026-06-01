import { Router } from "express";
import { sendEmailNotification } from "../controllers/notification.controller.js";

const router = Router();

router.route("/send-email").post(sendEmailNotification);

export default router;