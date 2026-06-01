import auditService from "../services/audit.service.js";
import { z } from "zod";
import { logger } from "../utils/logger.utils.js";

// Validation block acts as application firewall
const logSchema = z.object({
    serviceName: z.string().min(1, "serviceName is required"),
    userId: z.string().min(1, "userId is required"),
    action: z.string().min(1, "action is required"),
    status: z.enum(['success', 'failure', 'pending']),
    meta: z.record(z.any()).optional(), // Dynamic metadata storage
    ipAddress: z.string().optional()
});

export const createAuditLog = async (req, res) => {
    // DO LOG: Trace the incoming API milestone request step
    logger.debug(`Incoming audit request received from service: ${req.body?.serviceName || 'Unknown'}`);

    try {
        const validatedData = logSchema.parse(req.body);
        const savedLog = await auditService.createLog(validatedData);

        // DO LOG: Informational summary of application milestones
        logger.info('Audit entry queued successfully', {
            service: validatedData.serviceName,
            action: validatedData.action,
            status: validatedData.status
        });

        return res.status(201).json(savedLog);
    } catch (err) {
        if (err instanceof z.ZodError) {
            // DO LOG: Warnings for malformed client bad requests (doesn't mean server is broken)
            logger.warn('Audit log schema validation rejected', { errors: err.errors });
            return res.status(400).json({ error: err.errors });
        }

        // DO LOG: Actual system runtime exceptions with execution error details
        logger.error('Database write operation execution failed', { message: err.message, stack: err.stack });
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getAuditLogs = async (req, res) => {
    try {
        const { serviceName, userId, action, status, page = 1, limit = 50 } = req.query;
        const filters = { serviceName, userId, action, status };

        const logs = await auditService.getLogs(filters, parseInt(page, 10), parseInt(limit, 10));
        return res.status(200).json(logs);
    } catch (err) {
        logger.error('Audit query retrieval execution failed', { message: err.message });
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};