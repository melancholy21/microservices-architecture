import { Router } from "express";
import { createAuditLog, getAuditLogs } from "../controllers/audit.controller.js";

const router = Router();

router.route('/logs')
    .post(createAuditLog)
    .get(getAuditLogs);

export default router;