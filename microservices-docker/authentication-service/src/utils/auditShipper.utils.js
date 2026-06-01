import axios from 'axios';

/**
 * Dispatches an event background promise to the centralized audit logging engine.
 */
export const shipToAuditLog = async ({ userId, action, status, meta = {}, ipAddress }) => {
    try {
        const auditPayload = {
            serviceName: 'authentication-service-engine', // Identifies this microservice
            userId: userId || 'anonymous',
            action,
            status,
            meta,
            ipAddress: ipAddress || '0.0.0.0'
        };

        // Post directly to Audit Engine's endpoint
        await axios.post(process.env.AUDIT_SERVICE_URL, auditPayload);
    } catch (err) {
        // Log locally if the audit engine is unreachable, but don't disrupt the user's session
        console.error('Failed to ship log to Audit Engine:', err.message);
    }
};