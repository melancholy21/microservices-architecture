import winston from "winston";

// SECURITY: Blacklist of sensitive data keys that should NEVER print to console/files
const SENSITIVE_KEYS = ['password', 'token', 'apiKey', 'secret', 'creditCard', 'ssn', 'cookie', 'session'];

const maskSensitiveData = winston.format((info) => {
    const mask = (obj) => {
        for (let key in obj) {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                mask(obj[key]); // Recursively check nested meta objects
            } else if (SENSITIVE_KEYS.includes(key.toLowerCase()) || SENSITIVE_KEYS.some(k => key.toLowerCase().includes(k))) {
                obj[key] = '[MASKED_FOR_SECURITY]';
            }
        }
    };
    mask(info);
    return info;
});

// PERFORMANCE/DEBUG: Configuration for local development
const developmentFormat = winston.format.combine(
    maskSensitiveData(),
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message, ...metadata }) => {
        const metaStr = Object.keys(metadata).length ? JSON.stringify(metadata) : '';
        return `[${timestamp}] ${level}: ${message} ${metaStr}`;
    })
);

// PRODUCTION: Clean, machine-readable JSON pipeline
const productionFormat = winston.format.combine(
    maskSensitiveData(),
    winston.format.timestamp(),
    winston.format.json()
);

export const logger = winston.createLogger({
    // PERFORMANCE: Adjust volume via environment variable (e.g., LOG_LEVEL=warn skips info/debug logs)
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.NODE_ENV === 'production' ? productionFormat : developmentFormat,
    transports: [
        new winston.transports.Console()
    ],
});