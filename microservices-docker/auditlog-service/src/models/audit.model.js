import mongoose, { Schema } from 'mongoose';

const AuditLogSchema = new Schema(
    {
        serviceName: {
            type: String,
            required: true,
            index: true // Helps filter logs if shared by multiple microservices
        },
        userId: {
            type: String,
            required: true,
            index: true
        },
        action: {
            type: String,
            required: true,
            index: true
        },
        status: {
            type: String,
            enum: ['success', 'failure', 'pending'],
            required: true
        },
        meta: {
            type: mongoose.Schema.Types.Mixed, // Completely dynamic JSON data bucket
            default: {}
        },
        ipAddress: {
            type: String
        }, timestamp: {
            type: Date,
            default: Date.now,
        },
    }, {
    versionKey: false,
});

// Compound performance index for time-series lookups
AuditLogSchema.index({ serviceName: 1, userId: 1, timestamp: -1 });

//TTL
AuditLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 });

const AuditLog = mongoose.model("AuditLog", AuditLogSchema);
export default AuditLog;