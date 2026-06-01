import AuditLog from "../models/audit.model.js";
import { logger } from "../utils/logger.utils.js";

class AuditService {
    constructor() {
        this.logBuffer = [];
        this.maxBatchSize = 500;   // Accumulate up to 500 logs in memory
        this.flushInterval = 2000; // Or flush every 2 seconds max
        this.isFlushing = false; // Tracks if database is busy

        // Background interval to periodically flush logs even if traffic is slow
        setInterval(() => this.flushLogs(), this.flushInterval);
    }

    // High-speed memory ingestion (Replaces individual database writes)
    async createLog(logData) {
        this.logBuffer.push(logData);

        // If the buffer hits capacity before the 2-second timer, flush it immediately
        if (this.logBuffer.length >= this.maxBatchSize) {
            // A non-awaited call here so the controller gets an instant response
            this.flushLogs();
        }

        // Return a mock confirmation instantly so the microservice calling you isn't kept waiting
        return {
            success: true,
            message: "Log queued for batch processing"
        };
    }

    // Optimized bulk database operation
    async flushLogs() {
        if (this.logBuffer.length === 0 || this.isFlushing) return;

        this.isFlushing = true;

        // Take a snapshot of the current batch and clear the primary buffer instantly
        const batchToSave = [...this.logBuffer];
        this.logBuffer = [];

        try {
            // Write hundreds of logs to disk in ONE single network round-trip
            await AuditLog.insertMany(batchToSave, { ordered: false });
            logger.info(`Successfully batched and saved ${batchToSave.length} audit logs.`);
        } catch (err) {
            logger.error('Bulk log insertion collapsed:', { message: err.message });
        } finally {
            this.isFlushing = false;
        }
    }

    async getLogs(filters = {}, page = 1, limit = 50) {
        const query = {};
        if (filters.serviceName) query.serviceName = filters.serviceName;
        if (filters.userId) query.userId = filters.userId;
        if (filters.action) query.action = filters.action;
        if (filters.status) query.status = filters.status;

        const skip = (page - 1) * limit;
        const data = await AuditLog.find(query)
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await AuditLog.countDocuments(query);

        return {
            metadata: {
                totalDocs: total,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                hasNextPage: skip + limit < total
            },
            data
        };
    }
}

// Export a single default instance
export default new AuditService();