import { Router } from "express";
import { createReservation, getUserReservations, cancelReservation } from "../controllers/reservation.controller.js";
import { verifyUserSession } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyUserSession);

router.route("/").post(createReservation);
router.route("/user/:authUserId").get(getUserReservations);
router.route("/cancel/:id").put(cancelReservation);

export default router;